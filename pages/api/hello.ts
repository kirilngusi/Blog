// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
const { Client } = require("@notionhq/client");

const notion:any = new Client({ auth: process.env.NOTION_API_KEY  });


type Data = {
    name: string;
};

export default async function handler(req: any, res: any) {
    const response: any = await notion.databases.retrieve({
        database_id: process.env.NOTION_DATABASE_ID,
    });
    res.status(200).json({response});
}
