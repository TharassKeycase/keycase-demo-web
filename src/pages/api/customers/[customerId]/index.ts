import { NextApiRequest, NextApiResponse } from 'next';

import { authenticateJWT, checkCanEdit, checkCanDelete } from '@/lib/apiHelper';
import { deleteCustomer, getCustomer, updateCustomer } from '@/services/customers';
import { sendMethodNotAllowed, ValidationError } from '@/lib/errors';
import { AuthenticatedRequest } from '@/lib/authMiddleware';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const customerId = req.query.customerId as string; //convert to number 
  const id = parseInt(customerId); 
  if (isNaN(id)) {
    throw new ValidationError(1003, 400, "Customer ID is not a number");    
  }  
  switch (req.method) {
    case "GET":
      await getHandler(req, res, id);
      break;
    case "PUT":
      await putHandler(req, res, id);
      break;
    case "DELETE":
      await deleteHandler(req, res, id);
      break;
    default:
      sendMethodNotAllowed(res, req.method, req.url);
      break;
  }
}

const getHandler = async (req: AuthenticatedRequest, res: NextApiResponse, customerId: number) => {
  // Anyone authenticated can view customers
  const customer = await getCustomer(customerId);
  res.status(200).json(customer);
}

const putHandler = async (req: AuthenticatedRequest, res: NextApiResponse, customerId: number) => {
  // Check if user can edit (admin or manager)
  const userWithRole = req.user.role;
  if (!userWithRole|| !checkCanEdit(userWithRole)) {
    return res.status(403).json({ error: 'Access denied: Edit permission required' });
  }
  
  const customer = await updateCustomer(customerId, req.body);
  res.status(200).json(customer);
}

const deleteHandler = async (req: AuthenticatedRequest, res: NextApiResponse, customerId: number) => {
  // Check if user can delete (admin or manager)
  const userWithRole = req.user.role;
  if (!userWithRole || !checkCanDelete(userWithRole)) {
    return res.status(403).json({ error: 'Access denied: Delete permission required' });
  }
  
  await deleteCustomer(customerId);
  res.status(200).json({ message: "Customer deleted" });
}

export default authenticateJWT(handler);
