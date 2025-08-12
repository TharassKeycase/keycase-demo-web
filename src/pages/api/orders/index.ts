import { NextApiResponse } from 'next';
import { createOrder, getAllOrders, OrderQueryParams } from '@/services/orders';
import { sendMethodNotAllowed } from '@/lib/errors';
import { authenticateJWT, requireView, requireEdit, checkCanEdit } from '@/lib/apiHelper';
import { AuthenticatedRequest } from '@/lib/authMiddleware';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return requireView()(getHandler)(req, res);
    case "POST":
      return requireEdit()(createHandler)(req, res);
    default:
      sendMethodNotAllowed(res, req.method, req.url);
      break;
  }
}

const getHandler = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  const { page, limit, search, sortBy, sortOrder, customerId, state } = req.query;
  
  const params: OrderQueryParams = {
    page: page ? parseInt(page as string) : undefined,
    limit: limit ? parseInt(limit as string) : undefined,
    search: search as string | undefined,
    sortBy: sortBy as 'id' | 'total' | 'createdAt' | 'state' | undefined,
    sortOrder: sortOrder as 'asc' | 'desc' | undefined,
    customerId: customerId ? parseInt(customerId as string) : undefined,
    state: state as string | undefined,
  };

  const result = await getAllOrders(params);
  res.status(200).json(result);
}

const createHandler = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  const userWithRole = req.user.role;
  if (!userWithRole || !checkCanEdit(userWithRole)) {
    return res.status(403).json({ error: 'Access denied: Edit permission required' });
  }
  const orderData = req.body;
  const newOrder = await createOrder(orderData, req.user.id);
  res.status(201).json(newOrder);
}

export default authenticateJWT(handler);