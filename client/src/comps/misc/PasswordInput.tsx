import * as React from "react"
import { Eye, EyeOff } from "lucide-react"

import {
    InputGroup,
    InputGroupInput,
    InputGroupAddon,
    InputGroupButton
} from "@/components/ui/input-group"
import { cn } from "@/lib/utils"

interface PasswordInputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    containerClassName?: string
}

const PasswordInput = React.forwardRef<
    HTMLInputElement,
    PasswordInputProps
>(({ className, containerClassName, disabled, ...props }, ref) => {
    const [show, setShow] = React.useState(false)

    return (
        <InputGroup className={cn("w-full", containerClassName)}>
            <InputGroupInput
                ref={ref}
                type={show ? "text" : "password"}
                className={className}
                disabled={disabled}
                {...props}
            />
            <InputGroupAddon align="inline-end">
                <InputGroupButton
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    disabled={disabled}
                    onClick={() => setShow((prev) => !prev)}
                    className="h-7 w-7"
                    aria-label={show ? "Hide password" : "Show password"}
                >
                    {show ? (
                        <EyeOff className="h-4 w-4" />
                    ) : (
                        <Eye className="h-4 w-4" />
                    )}
                </InputGroupButton>
            </InputGroupAddon>
        </InputGroup>
    )
})

PasswordInput.displayName = "PasswordInput"
export default PasswordInput