import * as React from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

type LoadingButtonProps = React.ComponentProps<typeof Button> & {
    loading?: boolean;
    loadingChildren?: React.ReactNode;
};

export default function LoadingButton({
    loading = false,
    children,
    loadingChildren,
    className,
    disabled,
    ...props
}: LoadingButtonProps) {
    return (
        <Button
            className={cn("flex items-center gap-2", className)}
            disabled={loading || disabled}
            {...props}
        >
            {loading && (
                <Spinner className="h-4 w-4" data-icon="inline-start" />
            )}

            <div className={cn("flex items-center", loading && "opacity-90")}>
                {loading ? loadingChildren : children}
            </div>
        </Button>
    );
}