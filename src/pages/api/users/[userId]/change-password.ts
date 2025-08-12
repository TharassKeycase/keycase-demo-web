import { NextApiResponse } from 'next';
import { sendMethodNotAllowed, ValidationError } from '@/lib/errors';
import { authenticateJWT, requireEdit } from '@/lib/apiHelper';
import { AuthenticatedRequest } from '@/lib/authMiddleware';
import { changePassword, adminChangePassword } from '@/services/users';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  switch (req.method) {
    case "PUT":
      return requireEdit()(changePasswordHandler)(req, res);
    default:
      sendMethodNotAllowed(res, req.method, req.url);
      break;
  }
}

const changePasswordHandler = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  const { userId } = req.query;
  const { newPassword } = req.body;

  // Validate required fields
  if (!newPassword) {
    throw new ValidationError(1001, 400, "New password is required");
  }

  // Validate new password length
  if (newPassword.length < 6) {
    throw new ValidationError(1001, 400, "New password must be at least 6 characters long");
  }

  const userIdNumber = parseInt(userId as string);
  if (isNaN(userIdNumber)) {
    throw new ValidationError(1001, 400, "Invalid user ID");
  }

  // Admin can change password without current password
  await adminChangePassword(userIdNumber, newPassword, req.user.id);
  
  res.status(200).json({ message: "Password changed successfully" });
}

export default handler;