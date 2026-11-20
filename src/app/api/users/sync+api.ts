import { getVerifiedClerkId } from '@/server/auth';
import { prisma } from '@/server/db';

// Creates the User row on first sign-in. The ID comes only from the verified token.
export async function POST(request: Request) {
  const clerkId = await getVerifiedClerkId(request);
  if (!clerkId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const user = await prisma.user.upsert({
      where: { clerkId },
      update: {},
      create: { clerkId },
      select: { id: true },
    });
    return Response.json({ id: user.id });
  } catch {
    return Response.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
