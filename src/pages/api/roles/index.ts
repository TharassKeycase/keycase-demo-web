import { NextApiRequest, NextApiResponse } from 'next';
import prisma from "../../../lib/prisma";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const roles = await prisma.role.findMany();
      res.status(200).json(roles);
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error instanceof Error ? error.message : 'An error occurred' });
    }
  } else {
    res.status(405).json({ error: "Method not supported" });
  }
}

export default handler;