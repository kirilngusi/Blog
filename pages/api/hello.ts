// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getAllPosts } from "../../lib/notion";

export default async function handler(req: any, res: any) {
    const response = await getAllPosts();
    res.status(200).json(response);
}
