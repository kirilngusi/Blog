// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { NotionAPI } from 'notion-client'

import {getAllPosts , getBlocks } from '../../lib/notion';

type Data = {
    name: string;
};

export default async function handler(req: any, res: any) {
    // const response: any = await notion.databases.retrieve({
    //     database_id: process.env.NOTION_DATABASE_ID,
    // });
    const response = await getAllPosts();
    res.status(200).json(response);
}
