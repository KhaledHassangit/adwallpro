
import { LangProvider } from "@/providers/lang-provider"
import { ThemeProvider } from "@/components/theme-provider"

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <LangProvider>{children}</LangProvider>
    </ThemeProvider>
  )
}
