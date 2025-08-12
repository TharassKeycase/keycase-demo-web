import { NextApiResponse } from 'next';
import { getUser, updateUser, deleteUser } from '@/services/users';
import { sendMethodNotAllowed } from '@/lib/errors';
import { authenticateJWT } from '@/lib/apiHelper';
import { AuthenticatedRequest } from '@/lib/authMiddleware';
import { ValidationError } from '@/lib/errors';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const { userId } = req.query;
  
  // Validate userId
  if (!userId || Array.isArray(userId) || isNaN(Number(userId))) {
    throw new ValidationError(1001, 400, "Invalid user ID");
  }
  
  const id = parseInt(userId);
  
  switch (req.method) {
    case "GET":
      await getHandler(req, res, id);
      break;
    case "PUT":
      await updateHandler(req, res, id);
      break;
    case "DELETE":
      await deleteHandler(req, res, id);
      break;
    default:
      sendMethodNotAllowed(res, req.method, req.url);
      break;
  }
}

const getHandler = async (req: AuthenticatedRequest, res: NextApiResponse, id: number) => {
  const user = await getUser(id);
  res.status(200).json(user);
}

const updateHandler = async (req: AuthenticatedRequest, res: NextApiResponse, id: number) => {
  const userData = req.body;
  const updatedUser = await updateUser(id, userData, req.user.id);
  res.status(200).json(updatedUser);
}

const deleteHandler = async (req: AuthenticatedRequest, res: NextApiResponse, id: number) => {
  await deleteUser(id, req.user.id);
  res.status(204).end();
}

export default authenticateJWT(handler);