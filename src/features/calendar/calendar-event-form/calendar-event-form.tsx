import { useMemo, useEffect, useRef } from "react";
import { addHours } from "date-fns";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { cs } from "date-fns/locale";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem } from "@/components/ui/select";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { EVENT_COLORS } from "@/providers/events-provider";
import { useSettings } from "@/hooks/use-settings";
import { formatLongDate, formatTime, areValuesDefined } from "@/lib";
import {
    parseTimeString,
    generateTimeSlots,
    generateTimeSlotsFrom,
} from "@/features/calendar/utils";

const eventFormSchema = z.object({
    title: z.string().min(1).max(80),
    description: z.string().max(500),
    fullDay: z.boolean(),
    color: z.enum(EVENT_COLORS),
    date: z.date(),
    dateRange: z.object({
        from: z.date(),
        to: z.date(),
    }),
    startTime: z.string(),
    endTime: z.string(),
});

type CalendarEventFormProps = {
    defaultFormValues: Partial<z.infer<typeof eventFormSchema>>;
    onSubmit: (values: z.infer<typeof eventFormSchema>) => void;
    onWatch?: (values: z.infer<typeof eventFormSchema>) => void;
};

function CalendarEventForm({
    defaultFormValues,
    onSubmit,
    onWatch,
}: CalendarEventFormProps) {
    const { weekStartDay } = useSettings();
    const titleInputRef = useRef<HTMLInputElement>(null);

    const form = useForm<z.infer<typeof eventFormSchema>>({
        resolver: zodResolver(eventFormSchema),
        defaultValues: defaultFormValues,
    });

    const watchStartTime = useWatch({
        control: form.control,
        name: "startTime",
    });

    const startTimeSlots = useMemo(() => generateTimeSlots(), []);
    const endTimeSlots = useMemo(() => {
        const startTime = parseTimeString(watchStartTime);

        return generateTimeSlotsFrom(startTime);
    }, [watchStartTime]);

    useEffect(() => {
        if (titleInputRef.current) {
            titleInputRef.current.focus();
        }
    }, []);

    useEffect(() => {
        if (!watchStartTime) {
            return;
        }
        const startTime = parseTimeString(watchStartTime);

        if (startTime.getHours() >= 23) {
            form.setValue(
                "endTime",
                formatTime(new Date(startTime.setHours(23, 45, 0, 0)))
            );
        } else {
            form.setValue("endTime", formatTime(addHours(startTime, 1)));
        }
    }, [watchStartTime, form]);

    useEffect(() => {
        onWatch?.(form.getValues());
    }, [form.getValues]);

    useEffect(() => {
        if (!onWatch) {
            return;
        }

        const subscription = form.watch(values => {
            if (!areValuesDefined(values)) {
                return;
            }

            onWatch({
                ...values,
                dateRange: {
                    from: values.dateRange.from ?? values.date,
                    to: values.dateRange.to ?? values.date,
                },
            });
        });

        return () => subscription.unsubscribe();
    }, [form.watch]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                    name="title"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    placeholder="Název události"
                                    data-testid="titleInput"
                                    {...field}
                                    ref={titleInputRef}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    name="fullDay"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem className="flex items-center space-x-3">
                            <FormControl>
                                <Switch
                                    id="full-day"
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    data-testid="fullDaySwitch"
                                />
                            </FormControl>
                            <FormLabel htmlFor="full-day" className="!mt-0">
                                Celý den
                            </FormLabel>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex flex-wrap gap-3">
                    {!form.watch("fullDay") && (
                        <FormField
                            name="date"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    className="font-normal"
                                                    data-testid="dateButton"
                                                >
                                                    {formatLongDate(
                                                        field.value
                                                    )}
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                weekStartsOn={weekStartDay}
                                                locale={cs}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

                    {form.watch("fullDay") && (
                        <FormField
                            name="dateRange"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    className="font-normal"
                                                    data-testid="dateRangeButton"
                                                >
                                                    <span className="sr-only">
                                                        vybrete datum
                                                    </span>
                                                    {formatLongDate(
                                                        field.value.from
                                                    )}{" "}
                                                    -{" "}
                                                    {formatLongDate(
                                                        field.value.to
                                                    )}
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="range"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                weekStartsOn={weekStartDay}
                                                numberOfMonths={2}
                                                locale={cs}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

                    {!form.watch("fullDay") && (
                        <FormField
                            name="startTime"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectPrimitive.Trigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="font-normal"
                                                    data-testid="startTimeButton"
                                                >
                                                    <span className="sr-only">
                                                        Vyberte počáteční čas
                                                    </span>
                                                    {field.value}
                                                </Button>
                                            </SelectPrimitive.Trigger>
                                        </FormControl>
                                        <SelectContent className="min-w-min">
                                            {startTimeSlots.map(timeSlot => (
                                                <SelectItem
                                                    key={timeSlot}
                                                    value={timeSlot}
                                                >
                                                    {timeSlot}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

                    {!form.watch("fullDay") && (
                        <FormField
                            name="endTime"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectPrimitive.Trigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="font-normal"
                                                    data-testid="endTimeButton"
                                                >
                                                    <span className="sr-only">
                                                        Vyberte konečný čas
                                                    </span>
                                                    {field.value}
                                                </Button>
                                            </SelectPrimitive.Trigger>
                                        </FormControl>
                                        <SelectContent className="min-w-min">
                                            {endTimeSlots.map(
                                                ({ timeSlot, duration }) => (
                                                    <SelectItem
                                                        key={timeSlot}
                                                        value={timeSlot}
                                                    >
                                                        {timeSlot} - {duration}
                                                    </SelectItem>
                                                )
                                            )}
                                        </SelectContent>
                                    </Select>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}
                </div>

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Textarea
                                    placeholder="Popis události"
                                    className="max-h-52 h-16"
                                    data-testid="descriptionInput"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <RadioGroup
                                    defaultValue={field.value}
                                    onValueChange={field.onChange}
                                    className="flex flex-wrap gap-2.5"
                                >
                                    {EVENT_COLORS.map(color => (
                                        <div key={color}>
                                            <RadioGroupItem
                                                value={color}
                                                id={`${color}-label`}
                                                className="peer sr-only"
                                                data-testid="colorRadio"
                                            />
                                            <Label
                                                htmlFor={`${color}-label`}
                                                variant="circle"
                                                circleColor={color}
                                            >
                                                <span className="sr-only">
                                                    {color} barva události
                                                </span>
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="space-x-3">
                    <Button data-testid="saveFormButton">Uložit</Button>
                </div>
            </form>
        </Form>
    );
}

export { CalendarEventForm, eventFormSchema };
