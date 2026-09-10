"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Logo from "@/components/Logo";

export default function SignupPage() {
  const { signUp, user, loading } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user && !user.isAnonymous) router.replace("/chat");
  }, [loading, user, router]);

  if (!loading && user && !user.isAnonymous) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("الباسورد لازم يكون 6 حروف على الأقل.");
      return;
    }
    setSubmitting(true);
    try {
      await signUp(name, email, password);
      router.push("/chat");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Sign up failed";
      if (message.includes("email-already-in-use")) {
        setError("فيه حساب بالإيميل ده خلاص — جرب تسجّل دخول بدل كده.");
      } else if (message.includes("weak-password")) {
        setError("الباسورد ضعيف. استخدم 6 حروف على الأقل.");
      } else if (message.includes("invalid-email")) {
        setError("اكتب إيميل صحيح.");
      } else {
        setError("التسجيل مانفعش. جرب تاني.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-[340px]">
        <div className="flex justify-center mb-10">
          <Logo size={30} />
        </div>

        <form onSubmit={handleSubmit}>
          <h1 className="text-center text-lg font-semibold text-foreground mb-6">اعمل حساب جديد</h1>

          {error && <p className="text-sm text-incorrect mb-5">{error}</p>}
          {user?.isAnonymous && (
            <p className="text-xs text-teal bg-teal-soft rounded-md px-3 py-2 mb-5 font-reading">
              محادثات التجربة هتفضل موجودة لما تسجّل حساب.
            </p>
          )}

          <div>
            <label htmlFor="name" className="block text-xs font-medium text-muted mb-1.5">
              الاسم
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder-muted-light focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal transition-colors"
              placeholder="اسمك"
            />
          </div>

          <div className="mt-5">
            <label htmlFor="email" className="block text-xs font-medium text-muted mb-1.5">
              الإيميل
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder-muted-light focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal transition-colors"
              placeholder="you@university.edu"
            />
          </div>

          <div className="mt-5">
            <label htmlFor="password" className="block text-xs font-medium text-muted mb-1.5">
              الباسورد
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder-muted-light focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal transition-colors"
              placeholder="6 حروف على الأقل"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-8 py-2 rounded-md bg-teal text-white text-sm font-medium hover:bg-teal-hover disabled:opacity-50 transition-colors cursor-pointer"
          >
            {submitting ? "جاري إنشاء الحساب..." : "اعمل الحساب"}
          </button>
        </form>

        <p className="text-center text-xs text-muted mt-6">
          عندك حساب خلاص؟{" "}
          <Link href="/login" className="text-teal font-medium hover:underline">
            سجّل دخول
          </Link>
        </p>
      </div>
    </div>
  );
}
