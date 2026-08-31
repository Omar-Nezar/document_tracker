import { useAppDispatch } from "@/src/store/store";
import { logOut } from "@/src/slices/auth.slice";
import showToast from "@/src/comps/misc/showToast";
import { useNavigate } from "react-router";

export const useHandleLogout = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = async (useCase?: string) => {
        const promise = dispatch(logOut()).unwrap();
        if (useCase === "chgPwd") {
            showToast({
                promise,
                message: "Password changed",
                description:
                    "Your password has been changed successfully. You have been automatically logged out.",
            });
        } else {
            showToast({
                promise,
                message: "Logged out",
                description: "You have been logged out successfully.",
            });
        }

        try {
            await promise;

            localStorage.removeItem("authToken");
            navigate("/login");
        } catch (err) {
            console.error(err);
        }
    };

    return handleLogout;
};