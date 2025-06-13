"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignIn = async () => {
    try {
      const response = await fetch("/api/users/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ email, password }),
});


      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Login failed");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      console.log("Login Successful")
      router.push("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container flex min-h-[calc(100vh-var(--header-height)-var(--footer-height))] items-center justify-center py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-2xl">Welcome Back!</CardTitle>
          <CardDescription>Sign in to continue to Tiffin Box.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && (
            <p className="text-sm text-red-500 pt-2 text-center">{error}</p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={handleSignIn}
          >
            Sign In
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/signup"
              className="font-medium text-primary hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
