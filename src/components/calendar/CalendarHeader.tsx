import { ChevronLeft, ChevronRight, Settings, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme";
import { getMonthNames } from "@/lib";

type CalendarHeaderProps = {
    month: number;
    year: number;
    onNextMonth: () => void;
    onPreviousMonth: () => void;
    onTodayClick: () => void;
};

function CalendarHeader({
    month,
    year,
    onNextMonth,
    onPreviousMonth,
    onTodayClick,
}: CalendarHeaderProps) {
    const monthNames = getMonthNames();

    return (
        <div className="flex justify-between gap-3 items-center">
            <div className="flex items-center gap-3">
                <Button variant="outline" onClick={onTodayClick}>
                    Dnes
                </Button>
                <div>
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={onPreviousMonth}
                    >
                        <ChevronLeft className="text-zinc-950 size-[1.2rem] dark:text-zinc-200" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={onNextMonth}>
                        <ChevronRight className="text-zinc-950 size-[1.2rem] dark:text-zinc-200" />
                    </Button>
                </div>
            </div>
            <h1 className="text-2xl text-center font-bold text-zinc-950 dark:text-zinc-100">
                {monthNames[month]} {year}
            </h1>
            <div className="flex items-center gap-3">
                <Button size="icon" variant="ghost">
                    <Settings className="text-zinc-950 size-[1.2rem] dark:text-zinc-200" />
                </Button>
                <ThemeToggle />
                <Button size="icon" variant="ghost">
                    <Hash className="text-zinc-950 size-[1.2rem] dark:text-zinc-200" />
                </Button>
            </div>
        </div>
    );
}

export { CalendarHeader };
