import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const labelVariants = cva(
    "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
    {
        variants: {
            variant: {
                circle: "outline-transparent outline outline-[1.5px] outline-offset-2 size-3.5 block rounded-full cursor-pointer",
            },
            circleColor: {
                pink: "peer-data-[state=checked]:outline-pink-600 bg-pink-600",
                blue: "peer-data-[state=checked]:outline-blue-600 bg-blue-600",
                green: "peer-data-[state=checked]:outline-green-600 bg-green-600",
                indigo: "peer-data-[state=checked]:outline-indigo-600 bg-indigo-600",
                zinc: "peer-data-[state=checked]:outline-zinc-600 bg-zinc-600",
                red: "peer-data-[state=checked]:outline-red-600 bg-red-600",
            },
        },
    }
);

const Label = React.forwardRef<
    React.ElementRef<typeof LabelPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
        VariantProps<typeof labelVariants>
>(({ className, variant, circleColor, ...props }, ref) => (
    <LabelPrimitive.Root
        ref={ref}
        className={cn(labelVariants({ variant, circleColor }), className)}
        {...props}
    />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
