import { ChevronLeft, ChevronRight, Settings, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/features/theme";
import { capitalize, formatDate } from "@/lib";

type CalendarHeaderProps = {
    date: Date;
    onNextMonthClick: () => void;
    onPreviousMonthClick: () => void;
    onTodayClick: () => void;
};

function CalendarHeader({
    date,
    onNextMonthClick,
    onPreviousMonthClick,
    onTodayClick,
}: CalendarHeaderProps) {
    return (
        <div className="flex justify-between gap-3 items-center">
            <div className="flex items-center gap-3">
                <Button
                    variant="outline"
                    onClick={onTodayClick}
                    data-testid="today-button"
                >
                    Dnes
                </Button>
                <div>
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={onPreviousMonthClick}
                        data-testid="previous-month-button"
                    >
                        <ChevronLeft className="text-zinc-950 size-[1.2rem] dark:text-zinc-200" />
                    </Button>
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={onNextMonthClick}
                        data-testid="next-month-button"
                    >
                        <ChevronRight className="text-zinc-950 size-[1.2rem] dark:text-zinc-200" />
                    </Button>
                </div>
            </div>
            <h1 className="text-2xl text-center font-bold text-zinc-950 dark:text-zinc-100">
                {capitalize(
                    formatDate(date, {
                        month: "long",
                        year: "numeric",
                    })
                )}
            </h1>
            <div className="flex items-center gap-3">
                {/* Todo */}
                <Button size="icon" variant="ghost">
                    <Settings className="text-zinc-950 size-[1.2rem] dark:text-zinc-200" />
                </Button>
                <ThemeToggle />
                {/* Todo */}
                <Button size="icon" variant="ghost">
                    <Hash className="text-zinc-950 size-[1.2rem] dark:text-zinc-200" />
                </Button>
            </div>
        </div>
    );
}

export { CalendarHeader };
