import { NextApiResponse } from 'next';
import { getOrdersByCustomer } from '@/services/orders';
import { sendMethodNotAllowed } from '@/lib/errors';
import { authenticateJWT } from '@/lib/apiHelper';
import { AuthenticatedRequest } from '@/lib/authMiddleware';
import { ValidationError } from '@/lib/errors';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const { customerId } = req.query;
  
  // Validate customerId
  if (!customerId || Array.isArray(customerId) || isNaN(Number(customerId))) {
    throw new ValidationError(1002, 400, "Invalid customer ID");
  }
  
  const id = parseInt(customerId);
  
  if (req.method === "GET") {
    const orders = await getOrdersByCustomer(id);
    res.status(200).json(orders);
  } else {
    sendMethodNotAllowed(res, req.method, req.url);
  }
}

export default authenticateJWT(handler);