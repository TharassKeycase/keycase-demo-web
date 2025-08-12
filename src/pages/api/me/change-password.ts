import { NextApiResponse } from 'next';
import { sendMethodNotAllowed, ValidationError } from '@/lib/errors';
import { authenticateJWT } from '@/lib/apiHelper';
import { AuthenticatedRequest } from '@/lib/authMiddleware';
import { changePassword } from '@/services/users';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  switch (req.method) {
    case "PUT":
      return changePasswordHandler(req, res);
    default:
      sendMethodNotAllowed(res, req.method, req.url);
      break;
  }
}

const changePasswordHandler = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  const { currentPassword, newPassword } = req.body;

  // Validate required fields
  if (!currentPassword || !newPassword) {
    throw new ValidationError(1001, 400, "Current password and new password are required");
  }

  // Validate new password length
  if (newPassword.length < 6) {
    throw new ValidationError(1001, 400, "New password must be at least 6 characters long");
  }

  // Validate that new password is different from current
  if (currentPassword === newPassword) {
    throw new ValidationError(1001, 400, "New password must be different from current password");
  }

  const userId = Number(req.user.sub);
  await changePassword(userId, currentPassword, newPassword);
  
  res.status(200).json({ message: "Password changed successfully" });
}

export default authenticateJWT(handler);