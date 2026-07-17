import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; checkEmail?: string; reset?: string }>;
}) {
  const params = await searchParams;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Sign in to your AutomateWithJohn account.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {params.checkEmail ? (
          <p className="rounded-md bg-muted p-3 text-sm">
            Check your email to confirm your account before signing in.
          </p>
        ) : null}
        {params.reset ? (
          <p className="rounded-md bg-muted p-3 text-sm">
            Password updated. Sign in with your new password.
          </p>
        ) : null}
        <LoginForm next={params.next} />
      </CardContent>
    </Card>
  );
}
