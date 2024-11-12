import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme";
import { EventsProvider } from "@/providers/events-provider";
import { SettingsProvider } from "@/providers/settings-provider";
import { Calendar } from "@/components/calendar";

export default function App() {
    return (
        <SettingsProvider>
            <ThemeProvider>
                <EventsProvider>
                    <div className="h-screen min-h-[30rem]">
                        <div className="bg-white dark:bg-zinc-950 h-full p-8">
                            <Calendar />
                        </div>
                    </div>
                    <Toaster position="top-right" />
                </EventsProvider>
            </ThemeProvider>
        </SettingsProvider>
    );
}
