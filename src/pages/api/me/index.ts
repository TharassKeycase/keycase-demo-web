import { NextApiResponse } from "next";

import { authenticateJWT } from "@/lib/apiHelper";
import { AuthenticatedRequest } from "@/lib/authMiddleware";
import { sendMethodNotAllowed } from "@/lib/errors";
import {
  getCurrentUserProfile,
  updateCurrentUserProfile,
} from "@/services/profile";

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return getHandler(req, res);
    case "PUT":
      return updateHandler(req, res);
    default:
      sendMethodNotAllowed(res, req.method, req.url);
      break;
  }
}

const getHandler = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  const userProfile = await getCurrentUserProfile(Number(req.user.sub));
  res.status(200).json(userProfile);
};

const updateHandler = async (
  req: AuthenticatedRequest,
  res: NextApiResponse,
) => {
  const profileData = req.body;
  const updatedProfile = await updateCurrentUserProfile(
    Number(req.user.sub),
    profileData,
  );
  res.status(200).json(updatedProfile);
};

export default authenticateJWT(handler);
