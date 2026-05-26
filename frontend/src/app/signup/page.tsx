"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/components/providers/AuthProvider";

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    setLoading(true);
    try {
      await signup({ name, email, password });
      toast.success("Account created");
      router.push("/");
    } catch (e: any) {
      toast.error(e.message ?? "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-xl font-semibold">Sign up</h1>
      <p className="mt-1 text-sm text-[rgb(var(--muted-foreground))]">
        Build trust by sharing experience-first solutions.
      </p>

      <Card className="mt-5 p-5">
        <div className="space-y-3">
          <div>
            <div className="text-sm font-medium">Name</div>
            <div className="mt-2">
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
            </div>
          </div>
          <div>
            <div className="text-sm font-medium">Email</div>
            <div className="mt-2">
              <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" />
            </div>
          </div>
          <div>
            <div className="text-sm font-medium">Password</div>
            <div className="mt-2">
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 8 characters" />
            </div>
          </div>

          <Button className="w-full" onClick={onSubmit} disabled={loading}>
            {loading ? "Creating…" : "Create account"}
          </Button>

          <div className="text-center text-sm text-[rgb(var(--muted-foreground))]">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-[rgb(var(--primary))] hover:underline">
              Login
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}

