import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';

/**
 * Get the current authenticated user with their app profile.
 * Call this from server components and API routes.
 */
export async function auth() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch the app-level user profile
  const profile = await db.user.findUnique({
    where: { id: user.id },
    include: { organization: true },
  });

  return {
    id: user.id,
    email: user.email!,
    name: profile?.name ?? user.user_metadata?.name ?? null,
    role: profile?.role ?? 'member',
    orgId: profile?.orgId ?? null,
    avatarUrl: profile?.avatarUrl ?? null,
    organization: profile?.organization ?? null,
  };
}
