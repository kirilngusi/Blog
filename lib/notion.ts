import { Client } from "@notionhq/client";
import { ListBlockChildrenResponse } from '@notionhq/client/build/src/api-endpoints'
import { NotionAPI } from "notion-client";
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

// notion-client fetches page bodies through got, which sends its own default
// User-Agent ("got (https://github.com/sindresorhus/got)"). Notion now rejects
// that UA with 403 on /api/v3/loadPageChunk — the same request succeeds with a
// browser or curl UA — so every post page failed to render. Override it here.
const NOTION_USER_AGENT =
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

export const getPageContent = async (pageId: string) => {
    const recordMap = await new NotionAPI().getPage(pageId, {
        gotOptions: { headers: { "user-agent": NOTION_USER_AGENT } },
    });
    return normalizeRecordMap(recordMap);
};
