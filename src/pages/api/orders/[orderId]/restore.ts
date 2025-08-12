import { NextApiResponse } from 'next';
import { restoreOrder } from '@/services/orders';
import { sendMethodNotAllowed } from '@/lib/errors';
import { authenticateJWT, checkCanEdit } from '@/lib/apiHelper';
import { AuthenticatedRequest } from '@/lib/authMiddleware';
import { ValidationError } from '@/lib/errors';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const { orderId } = req.query;
  
  // Validate orderId
  if (!orderId || Array.isArray(orderId) || isNaN(Number(orderId))) {
    throw new ValidationError(1003, 400, "Invalid order ID");
  }
  
  const id = parseInt(orderId);
  
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
  const userWithRole = req.user.role;
  if (!userWithRole || !checkCanEdit(userWithRole)) {
    return res.status(403).json({ error: 'Access denied: Edit permission required' });
  }
  const restoredOrder = await restoreOrder(id, req.user.id);
  res.status(200).json(restoredOrder);
}

export default authenticateJWT(handler);