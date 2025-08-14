import type { NextApiRequest, NextApiResponse } from "next";

import { SignupRequest } from "@/types/user";

import { sendMethodNotAllowed, sendTechnicalError } from "@/lib/errors";
import { signup } from "@/services/users";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    sendMethodNotAllowed(res);
  }

  try {
    const { username, firstname, lastname, email } = req.body as SignupRequest;

    const newUser = await signup({ username, firstname, lastname, email });

    res.status(200).json({
      success: true,
      message: "User created successfully",
      data: newUser,
    });
  } catch (error) {
    sendTechnicalError(res, error);
  }
}
