

"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";

export default function VendorErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="container py-12 flex flex-col items-center justify-center text-center min-h-[calc(100vh-200px)]">
      <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
      <h2 className="text-3xl font-headline font-semibold mb-2">Oops! Something went wrong.</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        We couldn't load the vendor details. This might be a temporary issue with our backend service or an invalid vendor ID.
      </p>
      {error?.message && (
        <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md mb-4 max-w-xl text-left">
            <p className="font-semibold">Error Details:</p>
            <pre className="text-xs whitespace-pre-wrap mt-1 font-mono">{error.message}</pre>
        </div>
      )}
      <div className="flex gap-4">
        <Button onClick={() => reset()} variant="outline">Try Again</Button>
        <Button asChild>
          <Link href="/vendors">Back to All Vendors</Link>
        </Button>
      </div>
    </div>
  );
}
