import { NextApiResponse } from 'next';
import { getOrder, updateOrder, deleteOrder, restoreOrder } from '@/services/orders';
import { sendMethodNotAllowed } from '@/lib/errors';
import { authenticateJWT, checkCanDelete, checkCanEdit } from '@/lib/apiHelper';
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
  const order = await getOrder(id);
  res.status(200).json(order);
}

const updateHandler = async (req: AuthenticatedRequest, res: NextApiResponse, id: number) => {
  const userWithRole = req.user.role;
  if (!userWithRole || !checkCanEdit(userWithRole)) {
    return res.status(403).json({ error: 'Access denied: Edit permission required' });
  }
  const orderData = req.body;
  const updatedOrder = await updateOrder(id, orderData, req.user.id);
  res.status(200).json(updatedOrder);
}

const deleteHandler = async (req: AuthenticatedRequest, res: NextApiResponse, id: number) => {
  const userWithRole = req.user.role;
  if (!userWithRole || !checkCanDelete(userWithRole)) {
    return res.status(403).json({ error: 'Access denied: Edit permission required' });
  }

  await deleteOrder(id, req.user.id);
  res.status(204).end();
}

export default authenticateJWT(handler);