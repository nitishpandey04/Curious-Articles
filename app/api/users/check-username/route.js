import { checkUsernameAvailability, isValidUsername } from '@/lib/db/users';
import { successResponse, badRequestResponse, errorResponse } from '@/lib/utils/apiResponse';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');

    if (!username) {
      return badRequestResponse('Username is required');
    }

    if (!isValidUsername(username)) {
      return successResponse({
        available: false,
        reason: 'Username must be 3-30 characters, alphanumeric and underscores only',
      });
    }

    const isAvailable = await checkUsernameAvailability(username);

    return successResponse({
      available: isAvailable,
      reason: isAvailable ? null : 'Username is already taken',
    });
  } catch (err) {
    console.error('Check username error:', err);
    return errorResponse('Server error');
  }
}
