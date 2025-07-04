import { ReactNode } from 'react';

// This layout is now simplified because the main layout shell (Header, Footer) 
// and providers are handled in the root layout via AppShell.
export default function PagesLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
