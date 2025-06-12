"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function VendorErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container py-12 flex flex-col items-center justify-center text-center min-h-[calc(100vh-200px)]">
      <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
      <h2 className="text-3xl font-headline font-semibold mb-2">Oops! Something went wrong.</h2>
      <p className="text-muted-foreground mb-6">
        We couldn't load the vendor details. This might be a temporary issue.
      </p>
      {error?.message && <p className="text-sm text-destructive mb-4">Error: {error.message}</p>}
      <div className="flex gap-4">
        <Button onClick={() => reset()} variant="outline">Try Again</Button>
        <Button asChild>
          <Link href="/">Go to Homepage</Link>
        </Button>
      </div>
    </div>
  );
}
