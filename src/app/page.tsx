"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LandingPage from "@/components/LandingPage";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user && !user.isAnonymous) {
      router.replace("/chat");
    }
  }, [user, loading, router]);

  if (loading || (user && !user.isAnonymous)) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-teal border-t-transparent rounded-full" />
      </div>
    );
  }

  return <LandingPage />;
}
