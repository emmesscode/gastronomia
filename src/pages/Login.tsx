import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroHeader from "@/components/layout/HeroHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const result = login({ email, password });

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
    const redirectTo = (location.state as { from?: string } | null)?.from || "/";
    navigate(redirectTo);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <HeroHeader
          title="Sign In"
          subtitle="Log in to the admin dashboard."
        />

        <div className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4">
            <Card className="max-w-xl mx-auto">
              <CardHeader>
                <CardTitle>Sign in</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@gastronomia.com"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="demo123"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                    />
                  </div>
                  <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                    <p className="font-medium text-gray-900">Demo credentials</p>
                    <p>Use any email. Emails containing “admin” unlock the admin dashboard.</p>
                    <p>Password must be at least 6 characters.</p>
                  </div>
                  <Button type="submit" className="w-full">
                    Sign in
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Login;
