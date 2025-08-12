import { NextApiResponse } from 'next';
import { createUser, getUsers } from '@/services/users';
import { sendMethodNotAllowed } from '@/lib/errors';
import { authenticateJWT, requireAdmin, requireView } from '@/lib/apiHelper';
import { AuthenticatedRequest } from '@/lib/authMiddleware';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return requireAdmin()(getHandler)(req, res);  // Only admins can view all users
    case "POST":
      return requireAdmin()(createHandler)(req, res);  // Only admins can create users
    default:
      sendMethodNotAllowed(res, req.method, req.url);
      break;
  }
}

const getHandler = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  const users = await getUsers();
  res.status(200).json(users);
}

const createHandler = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  const userData = req.body;
  const newUser = await createUser(userData, req.user.id);
  res.status(201).json(newUser);
}

export default handler;