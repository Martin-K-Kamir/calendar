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
                    <div className="min-h-screen bg-white dark:bg-zinc-950 p-8 grid">
                        <Calendar />
                    </div>
                    <Toaster />
                </EventsProvider>
            </ThemeProvider>
        </SettingsProvider>
    );
}
