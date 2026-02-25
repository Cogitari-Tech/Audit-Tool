import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function AuthCallbackPage() {
  const { user, initialized } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (initialized) {
      if (user) {
        navigate("/", { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    }
  }, [user, initialized, navigate]);

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center font-sans">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        <p className="text-sm font-bold tracking-widest uppercase text-muted-foreground animate-pulse">
          Autenticando...
        </p>
      </div>
    </div>
  );
}
