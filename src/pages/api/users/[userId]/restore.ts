import { NextApiResponse } from 'next';
import { restoreUser } from '@/services/users';
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
    case "POST":
      await restoreHandler(req, res, id);
      break;
    default:
      sendMethodNotAllowed(res, req.method, req.url);
      break;
  }
}

const restoreHandler = async (req: AuthenticatedRequest, res: NextApiResponse, id: number) => {
  const restoredUser = await restoreUser(id, req.user.id);
  res.status(200).json(restoredUser);
}

export default authenticateJWT(handler);