import { NextApiResponse } from 'next';
import { createProduct, getProducts, ProductQueryParams } from '@/services/products';
import { sendMethodNotAllowed } from '@/lib/errors';
import { authenticateJWT, requireView, requireEdit, checkCanEdit } from '@/lib/apiHelper';
import { AuthenticatedRequest } from '@/lib/authMiddleware';


async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return getHandler(req, res);
    case "POST":
      return createHandler(req, res);
    default:
      sendMethodNotAllowed(res, req.method, req.url);
      break;
  }
}

const getHandler = async (req: AuthenticatedRequest, res: NextApiResponse) => { 
  const { page, limit, search, sortBy, sortOrder, minPrice, maxPrice } = req.query;
  
  const params: ProductQueryParams = {
    page: page ? parseInt(page as string) : undefined,
    limit: limit ? parseInt(limit as string) : undefined,
    search: search as string | undefined,
    sortBy: sortBy as 'name' | 'price' | 'createdAt' | 'updatedAt' | undefined,
    sortOrder: sortOrder as 'asc' | 'desc' | undefined,
    minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
    maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
  };

  const result = await getProducts(params);
  res.status(200).json(result);
}

const createHandler = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  const userWithRole = req.user.role; 
  if (!userWithRole || !checkCanEdit(userWithRole)) {
    return res.status(403).json({ error: 'Access denied: Edit permission required' });
  }
  const product = req.body;
  const newProduct = await createProduct(product, Number(req.user.sub));
  res.status(201).json(newProduct);
}


export default authenticateJWT(handler);
