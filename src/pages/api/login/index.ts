import { NextApiRequest, NextApiResponse } from 'next';
import jwt from "jsonwebtoken";
import { compare } from "bcryptjs";
import { getUserByUsername } from "../../../lib/apiHelper"; // function to retrieve user from database
import { getErrorMessage } from "../../../lib/utils";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  // If request method is not POST, return an error
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { username, password, expiresIn } = req.body;

    // If username or password is missing, return an error
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Please provide username and password" });
    }

    // Retrieve user from database
    const user = await getUserByUsername(username);
 
    // If user doesn't exist or password is incorrect, return an error
    if (!user || !(await compare(password, user.passwordHash))) {
      return res.status(401).json({ message: "Invalid login credentials" });
    }

    // Generate JWT token with user ID and role information
    const token = jwt.sign(
      {
        id: user.id,
        sub: user.id,
        username: user.username,
        email: user.email,              
        role: user.role.name,
      },
      process.env.NEXTAUTH_SECRET!,
      {
        expiresIn: expiresIn || "200h",
      }
    );

    // Return token and user data
    return res.status(200).json({
      token,
     
    });
  }
  catch (error) {
    console.log(error);
    return res.status(500).json(getErrorMessage(5001, [error instanceof Error ? error.message : 'Unknown error']));
  }
}
