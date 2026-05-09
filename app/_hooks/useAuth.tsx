import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useAuth = () => {
  const session = useSession();

  const router = useRouter();

  const userId = session.data?.user.id || null;

  useEffect(() => {
    if (session.status === "unauthenticated") router.replace("/login");
  }, [session]);

  return { session, userId };
};
