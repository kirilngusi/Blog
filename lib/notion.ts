import { Client } from "@notionhq/client";
import { ListBlockChildrenResponse } from '@notionhq/client/build/src/api-endpoints'
import { NotionAPI } from "notion-client";
import { getPageContentBlockIds } from "notion-utils";
import { siteConfig } from './siteConfig'
import { PostMeta, toPostMeta } from './posts'

const notion: any = new Client({ auth: process.env.NOTION_API_KEY });

export const getAllPosts = async (slug?: string) => {
    let dbQuery: any = {
      database_id:  process.env.NOTION_DATABASE_ID,
      filter: { and: [{ property: 'status', select: { equals: 'published' } }] },
      sorts: [{ property: 'Date', direction: 'descending' }],
    }

    if (slug) {
      dbQuery.filter.and.push({ property: 'slug', rich_text: { equals: slug } })
    }

    const response = await notion.databases.query(dbQuery)
    return response.results
};

export const getPage = async (pageId: string) => {
    const res = await notion.pages.retrieve({ page_id: pageId })
    return res;
}

// notion-client (6.12.x) returns record-map entries double-wrapped as
// { spaceId, value: { value: <block>, role } }, while react-notion-x expects
// { role, value: <block> }. Flatten each map so the renderer can read block.id
// and block.type instead of crashing on undefined.
const flattenMap = (map: Record<string, any> | undefined) => {
    if (!map) return;
    for (const key of Object.keys(map)) {
        const entry = map[key];
        if (
            entry &&
            entry.value &&
            entry.value.value !== undefined &&
            entry.value.role !== undefined &&
            entry.value.id === undefined
        ) {
            map[key] = { role: entry.value.role, value: entry.value.value };
        }
    }
};

export const normalizeRecordMap = (recordMap: any) => {
    if (!recordMap) return recordMap;
    flattenMap(recordMap.block);
    flattenMap(recordMap.collection);
    flattenMap(recordMap.collection_view);
    flattenMap(recordMap.notion_user);
    return recordMap;
};

export const getBlocks = async (blockId: string) => {
    const blocks = []
    let cursor
    while (true) {
      const { results, next_cursor }: ListBlockChildrenResponse =
        await notion.blocks.children.list({
          start_cursor: cursor,
          block_id: blockId,
        })
  
      blocks.push(...results)
      if (!next_cursor) break
      cursor = next_cursor
    }
    return blocks
}
// Single entry point for "all published posts, normalized". Server-only: it
// lives here rather than in lib/posts.ts so that client components importing
// posts.ts (PostCard) never pull @notionhq/client into the browser bundle.
export const getPostList = async (): Promise<PostMeta[]> => {
    const rows = await getAllPosts();
    const posts: PostMeta[] = rows.map(toPostMeta);
    // A post with no slug has no reachable URL, so drop it here rather than let
    // every list render a dead /blog/ link.
    return posts.filter((p) => p.slug);
};

// notion-client 6.x fetches page bodies through got and never sets a
// User-Agent, so requests go out as "got (https://github.com/sindresorhus/got)"
// — a UA Notion now rejects with 403 on /api/v3/loadPageChunk, which broke
// every post page at build time. Notion is not blocking automation as such: a
// UA that identifies the caller passes fine. notion-client 8.x fixed this the
// same way, by declaring itself. Upgrading is the real fix, but it is a 6.x to
// 8.x jump that react-notion-x has to make in step, so declare ourselves here.
const NOTION_USER_AGENT = `kirilngusi-blog (+${siteConfig.url})`;

// getPage only loads the first 100-block chunk in one go and fetches the rest
// afterwards — but those late blocks come back double-wrapped (see flattenMap),
// so notion-client can't see their children and stops there. A table, toggle or
// nested list past block ~100 then renders empty. Finish the job after
// normalizing, when every block's content ids are readable.
const MAX_FETCH_ROUNDS = 10;

export const getPageContent = async (pageId: string) => {
    const api = new NotionAPI();
    const gotOptions = { headers: { "user-agent": NOTION_USER_AGENT } };
    const recordMap = normalizeRecordMap(await api.getPage(pageId, { gotOptions }));

    for (let round = 0; round < MAX_FETCH_ROUNDS; round++) {
        const missing = getPageContentBlockIds(recordMap).filter(
            (id) => !recordMap.block[id]
        );
        if (!missing.length) break;
        const res = await api.getBlocks(missing, gotOptions);
        Object.assign(recordMap.block, res.recordMap.block);
        normalizeRecordMap(recordMap);
    }
    return recordMap;
};
