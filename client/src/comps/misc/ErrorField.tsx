import { cn } from "@/lib/utils"

import {
    FieldError,
} from "@/components/ui/field"

type ErrorDivProps = {
    message?: string;
    className?: string;
};

export default function ErrorDiv({ message, className = "" }: ErrorDivProps) {
    const isVisible = Boolean(message);

    return (
        <FieldError
            className={cn(
                "overflow-hidden transition-all duration-300 ease-in-out",
                isVisible
                    ? "max-h-8 opacity-100"
                    : "max-h-0 opacity-0",
                className
            )}
        >
            <p>{message}</p>
        </FieldError>
    );
}