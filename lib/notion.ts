import { Client } from "@notionhq/client";
import { ListBlockChildrenResponse } from '@notionhq/client/build/src/api-endpoints'

import { NotionAPI } from 'notion-client'

const notion: any = new Client({ auth: process.env.NOTION_API_KEY });

const api = new NotionAPI();

export const getAllPosts = async () => {
    const res = await notion.databases.query({
        database_id: process.env.NOTION_DATABASE_ID,
    });
    return res.results;
};

export const getPage = async (pageId: string) => {
    const res = await notion.pages.retrieve({ page_id: pageId })
    return res;
}

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

export const test = async (pageId: string) => {
  const page = await api.getPage(pageId);
  return page;
}