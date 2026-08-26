import { toast } from "@/components/ui/toast"

type ToastProps = {
    promise: Promise<any>;
    message: string;
    description?: string;
    duration?: number;
    errMsg?: string;
};

export default function showToast({
    promise,
    message,
    description,
    duration = 3000,
    errMsg = "Something went wrong",
}: ToastProps) {
    const styledMessage = (
        <span className="text-base font-semibold">
            {message}
        </span>
    );

    const styledDescription = (
        <span className="text-xs text-muted-foreground">
            {description}
        </span>
    );

    const dismissAction = (toastId?: string) => ({
        children: "Dismiss",
        className: "h-7 rounded-md px-2 text-xs font-medium shadow-none",
        onClick() {
            if (toastId) {
                toast.close(toastId);
            } else {
                toast.close();
            }
        },
    });

    return toast.promise(promise, {
        loading: "Loading...",
        success: () => ({
            title: styledMessage,
            description: styledDescription,
            timeout: duration,
            actionProps: dismissAction(),
            type: "success",
        }),
        error: (err) => ({
            title: typeof err === "string" ? err : errMsg,
            description: "",
            timeout: duration,
            actionProps: dismissAction(),
            type: "error",
        }),
    });
}