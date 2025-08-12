import { NextApiRequest, NextApiResponse } from 'next';
import { getBaseUrl } from "@/lib/utils";
import { authenticateJWT,  checkCanEdit } from '@/lib/apiHelper';
import { createCustomer, deleteCustomer, getCustomers, CustomerQueryParams } from '@/services/customers';
import { CustomerCreate } from '@/types/customer';
import { AuthenticatedRequest } from '@/lib/authMiddleware';
import { sendMethodNotAllowed } from '@/lib/errors';

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse,
): Promise<void> {
  switch (req.method) {
    case "GET":
      await getHandler(req, res);
      break;
    case "POST":
      await postHandler(req, res);
      break;
    default:
      sendMethodNotAllowed(res, req.method, req.url);
      break;
  }
}

const getHandler = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  // Anyone authenticated can view customers
  const { page, limit, search, sortBy, sortOrder } = req.query;
  
  const params: CustomerQueryParams = {
    page: page ? parseInt(page as string) : undefined,
    limit: limit ? parseInt(limit as string) : undefined,
    search: search as string | undefined,
    sortBy: sortBy as 'name' | 'email' | 'createdAt' | 'updatedAt' | undefined,
    sortOrder: sortOrder as 'asc' | 'desc' | undefined,
  };

  const result = await getCustomers(params);
  res.status(200).json(result);
}

const postHandler = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  // Check if user can edit (admin or manager)
  const userWithRole = req.user.role;  
  if (!userWithRole || !checkCanEdit(userWithRole)) {
    return res.status(403).json({ error: 'Access denied: Edit permission required' });
  }
  
  const customer = await createCustomer(req.body as CustomerCreate);
  const baseUrl = getBaseUrl();
  const location = `${baseUrl}/api/customers/${customer.id}`;
  res.setHeader("Location", location).status(201).json(customer);
}


export default authenticateJWT(handler);
