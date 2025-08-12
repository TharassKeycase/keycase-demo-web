import { NextApiRequest, NextApiResponse } from 'next';
import { deleteProduct, getProduct, getProducts, updateProduct } from '@/services/products';
import { sendMethodNotAllowed, ValidationError } from '@/lib/errors';
import { authenticateJWT, checkCanDelete, checkCanEdit } from '@/lib/apiHelper';
import { AuthenticatedRequest } from '@/lib/authMiddleware';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {

  const { productId } = req.query;
  
  //check if productId is a number
  if (isNaN(Number(productId))) {
    throw new ValidationError(1004, 404, "Product ID must be a number");
  }

  switch (req.method) {
    case "GET":
      await getHandler(req, res, Number(productId));
      break;
    case "PUT":
      await updateHandler(req, res, Number(productId));
      break;
    case "DELETE":
      await deleteHandler(req, res, Number(productId));
      break;
    default:
      sendMethodNotAllowed(res, req.method, req.url);
      break;
  }
}

const getHandler = async (req: NextApiRequest, res: NextApiResponse, productId: number) => {
  const product = await getProduct(productId);
  res.status(200).json(product);
}

const updateHandler = async (req: AuthenticatedRequest, res: NextApiResponse, productId: number) => {
  const userWithRole = req.user.role; 
  if (!userWithRole || !checkCanEdit(userWithRole)) {
    return res.status(403).json({ error: 'Access denied: Edit permission required' });
  }
  
  const product = await updateProduct(productId, req.body, req.user.id);
  res.status(200).json(product);
}

const deleteHandler = async (req: AuthenticatedRequest, res: NextApiResponse, productId: number) => {
  const userWithRole = req.user.role;
  if (!userWithRole || !checkCanDelete(userWithRole)) {
    return res.status(403).json({ error: 'Access denied: Delete permission required' });
  }
  await deleteProduct(productId, Number(req.user.sub));
  res.status(204).end();
}

export default authenticateJWT(handler);
