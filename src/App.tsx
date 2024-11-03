import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { EventsProvider } from "@/providers/EventsProvider";
import { SettingsProvider } from "@/providers/SettingsProvider";
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
