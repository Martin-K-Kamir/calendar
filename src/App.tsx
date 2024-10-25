import { ThemeProvider } from "@/contexts/ThemeContext";
import { Calendar } from "@/components/calendar";

export default function App() {
    return (
        <ThemeProvider>
            <div className="min-h-screen bg-white dark:bg-zinc-950 p-8 grid">
                <Calendar />
            </div>
        </ThemeProvider>
    );
}
