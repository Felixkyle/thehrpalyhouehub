import LearnGuard from "./LearnGuard";

/**
 * Layout for the protected /learn/* section. Every page under /learn requires
 * an authenticated session — LearnGuard handles the redirect to /login.
 */
export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return <LearnGuard>{children}</LearnGuard>;
}
