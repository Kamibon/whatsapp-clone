import { useSession } from "next-auth/react";

export const useAuth = () => {
  const session = useSession();

  const userId = session.data?.user.id || null;

  return {session, userId}
};
