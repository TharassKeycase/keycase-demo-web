import { NextApiResponse } from 'next';
import { changePassword } from '@/services/users';
import { sendMethodNotAllowed } from '@/lib/errors';
import { authenticateJWT } from '@/lib/apiHelper';
import { AuthenticatedRequest } from '@/lib/authMiddleware';
import { ValidationError } from '@/lib/errors';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    sendMethodNotAllowed(res, req.method, req.url);
    return;
  }

  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new ValidationError(1001, 400, "Current password and new password are required");
  }

  if (newPassword.length < 8) {
    throw new ValidationError(1001, 400, "New password must be at least 8 characters long");
  }

  await changePassword(req.user.id, currentPassword, newPassword);
  res.status(200).json({ message: "Password changed successfully" });
}

export default authenticateJWT(handler);