"use client";

import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (!currentUser && pathname !== "/login") {
        router.replace("/login");
      }
    });

    return () => unsubscribe();
  }, [pathname, router]);

  // Login page is publicly accessible
  if (pathname === "/login") {
    return <>{children}</>;
  }

  // Firebase is checking the current session
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050706] text-[#f4f7f4]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-[#7dff9a]/20 border-t-[#7dff9a]" />

          <p className="text-sm text-[#667269]">
            Checking authentication...
          </p>
        </div>
      </main>
    );
  }

  // Not logged in
  if (!user) {
    return null;
  }

  // Logged in
  return <>{children}</>;
}