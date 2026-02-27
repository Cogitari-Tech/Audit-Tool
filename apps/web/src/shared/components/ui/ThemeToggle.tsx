import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "./Button";

export const ThemeToggle = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Check local storage or system preference
    const storedTheme = localStorage.getItem("theme");
    if (
      storedTheme === "dark" ||
      (!storedTheme &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <Button
      variant="ghost"
      onClick={toggleTheme}
      className={`relative overflow-hidden rounded-full w-10 h-10 p-0 flex items-center justify-center transition-all duration-300 shadow-sm border
        ${
          theme === "light"
            ? "bg-white border-slate-200 text-amber-500 hover:bg-slate-50 hover:text-amber-600 hover:border-amber-200"
            : "bg-slate-800 border-slate-700 text-brand-400 hover:bg-slate-700 hover:text-brand-300 hover:border-brand-500/50"
        }`}
      title={`Alternar para modo ${theme === "light" ? "escuro" : "claro"}`}
    >
      {theme === "light" ? (
        <Moon className="w-5 h-5 transition-transform hover:-rotate-12" />
      ) : (
        <Sun className="w-5 h-5 transition-transform hover:rotate-90 duration-500" />
      )}
    </Button>
  );
};
