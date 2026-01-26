import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getFullUserByEmail, updateUserProfile, checkUsernameAvailability, isValidUsername } from '@/lib/db/users';
import { successResponse, errorResponse, unauthorizedResponse, badRequestResponse } from '@/lib/utils/apiResponse';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return unauthorizedResponse();
    }

    const user = await getFullUserByEmail(session.user.email);
    if (!user) {
      return errorResponse('User not found', 404);
    }

    return successResponse(user);
  } catch (err) {
    console.error('Get profile error:', err);
    return errorResponse('Server error');
  }
}

export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return unauthorizedResponse();
    }

    const { username, name, bio } = await req.json();

    // Validate username if provided
    if (username !== undefined) {
      if (!isValidUsername(username)) {
        return badRequestResponse('Username must be 3-30 characters, alphanumeric and underscores only');
      }

      // Check if username is available (excluding current user)
      const currentUser = await getFullUserByEmail(session.user.email);
      if (currentUser?.username !== username.toLowerCase()) {
        const isAvailable = await checkUsernameAvailability(username);
        if (!isAvailable) {
          return badRequestResponse('Username is already taken');
        }
      }
    }

    // Validate name if provided
    if (name !== undefined && name.length > 100) {
      return badRequestResponse('Name must be 100 characters or less');
    }

    // Validate bio if provided
    if (bio !== undefined && bio.length > 500) {
      return badRequestResponse('Bio must be 500 characters or less');
    }

    const result = await updateUserProfile(session.user.email, { username, name, bio });

    if (result.matchedCount === 0) {
      return errorResponse('User not found', 404);
    }

    return successResponse({ success: true });
  } catch (err) {
    console.error('Update profile error:', err);
    return errorResponse('Server error');
  }
}
