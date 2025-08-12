import { NextApiResponse } from 'next';
import { restoreProduct } from '@/services/products';
import { sendMethodNotAllowed } from '@/lib/errors';
import { authenticateJWT, checkCanEdit } from '@/lib/apiHelper';
import { AuthenticatedRequest } from '@/lib/authMiddleware';
import { ValidationError } from '@/lib/errors';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const { productId } = req.query;
  
  // Validate productId
  if (!productId || Array.isArray(productId) || isNaN(Number(productId))) {
    throw new ValidationError(1004, 400, "Invalid product ID");
  }
  
  const id = parseInt(productId);
  
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
  const restoredProduct = await restoreProduct(id, req.user.id);
  res.status(200).json(restoredProduct);
}

export default authenticateJWT(handler);