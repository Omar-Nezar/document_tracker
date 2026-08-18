import { Link, useNavigate } from "react-router"
import { useState } from "react";
import { type RootState } from "@/src/store/store";
import { useAppDispatch, useAppSelector } from "@/src/store/store";
import { login } from "@/src/slices/auth.slice";

import LoadingButton from "@/src/comps/misc/LoadingButton";
import PasswordInput from "@/src/comps/misc/PasswordInput";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Field,
    FieldLabel,
    FieldGroup,
} from "@/components/ui/field"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/toast"

import { CircleUserRound } from "lucide-react"


export default function Login() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { loading } = useAppSelector(
        (state: RootState) => state.auth
    );

    const [form, setForm] = useState({
        role: "Employee",
        email: "",
        password: "",
    });

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const promise = dispatch(login(form)).unwrap();
        toast.promise(promise, {
            loading: "Logging in...",
            success: "Login successful",
            error: "Login failed",
        });
    };

    return (
        <div className="flex min-h-svh items-center justify-center bg-muted/40 p-4 sm:p-6">
            <Card className="w-full max-w-md shadow-lg border-border/60">
                <CardHeader className="space-y-2 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full">
                        <CircleUserRound className="h-full w-full text-primary" />
                    </div>

                    <CardTitle className="text-2xl font-bold tracking-tight sm:text-3xl">
                        Welcome back
                    </CardTitle>

                    <CardDescription className="text-sm">
                        Sign in to access your dashboard
                    </CardDescription>
                </CardHeader>

                <Separator />

                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="userType">User Type</FieldLabel>
                                <Select
                                    id="userType"
                                    value={form.role}
                                    onValueChange={(value) => {
                                        if (value !== null) {
                                            setForm({ ...form, role: value })
                                        }
                                    }}
                                >
                                    <SelectTrigger className="w-full h-10">
                                        <SelectValue>
                                            {
                                                {
                                                    Employee: "Employee",
                                                    Admin: "Admin",
                                                }[form.role]
                                            }
                                        </SelectValue>
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectItem value="Employee">Employee</SelectItem>
                                        <SelectItem value="Admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={form.email}
                                    onChange={(e) =>
                                        setForm({ ...form, email: e.target.value })
                                    }
                                    className="h-10"
                                    autoComplete="email"
                                />
                            </Field>

                            <Field>
                                <div className="flex items-center justify-between">
                                    <FieldLabel htmlFor="password">Password</FieldLabel>
                                    <Button
                                        variant="link"
                                        size="sm"
                                        className="h-auto p-0 text-xs font-normal text-muted-foreground hover:text-primary"
                                        render={
                                            <Link to="/forgotpassword">Forgot password?</Link>
                                        }
                                    >
                                    </Button>
                                </div>
                                <PasswordInput
                                    id="password"
                                    placeholder="Enter your password"
                                    value={form.password}
                                    onChange={(e) =>
                                        setForm({ ...form, password: e.target.value })
                                    }
                                    className="h-10"
                                    autoComplete="current-password"
                                />
                            </Field>

                            <Separator />

                            <LoadingButton
                                className="w-full h-11 text-sm font-medium"
                                type="submit"
                                loading={loading}
                                loadingChildren="Signing in..."
                            >
                                Sign in
                            </LoadingButton>
                        </FieldGroup>
                    </form>

                    <div className="mt-2 flex items-center gap-3">
                        <Separator className="flex-1" />
                        <span className="text-xs uppercase text-muted-foreground tracking-wider font-medium">
                            Or
                        </span>
                        <Separator className="flex-1" />
                    </div>

                    <div className="text-center text-sm text-muted-foreground">
                        Don't have an account? {" "}
                        <Button
                            variant="link"
                            size="sm"
                            className="p-0 font-semibold h-auto"
                            render={
                                <Link to="/register">Create account</Link>
                            }>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}