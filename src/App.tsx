import { Toaster } from "@/components/ui/sonner";
import { SettingsProvider } from "@/context/settings-provider";
import { ThemeProvider } from "@/features/theme";
import { Calendar } from "@/features/calendar";

export default function App() {
    return (
        <SettingsProvider>
            <ThemeProvider>
                <div className="h-screen min-h-[30rem]">
                    <div className="bg-white dark:bg-zinc-950 h-full p-8">
                        <Calendar />
                    </div>
                </div>
                <Toaster position="top-right" />
            </ThemeProvider>
        </SettingsProvider>
    );
}
