import {
    UserShield,
    User, 
    type LucideIcon
} from "lucide-react"

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

type BadgeConfig = {
    variant: BadgeVariant;
    className: string;
};

type UserBadgeConfig = {
    variant: BadgeVariant;
    className: string;
    icon: LucideIcon;
};

export const transactionBadgeMapping: Record<string, BadgeConfig> = {
    SUBMITTED: {
        variant: "default",
        className: "",
    },

    APPROVED: {
        variant: "default",
        className: "bg-green-600 hover:bg-green-600",
    },

    REJECTED: {
        variant: "destructive",
        className: "",
    },

    PENDING: {
        variant: "secondary",
        className: "",
    },

    COMPLETED: {
        variant: "default",
        className: "bg-blue-600 hover:bg-blue-600",
    },

    CANCELLED: {
        variant: "outline",
        className: "",
    },

    DRAFT: {
        variant: "outline",
        className: "bg-yellow-600 hover:bg-yellow-600 border-none",
    },
};

export const userBadgeMapping: Record<string, UserBadgeConfig> = {
    Employee: {
        variant: "default",
        className: "",
        icon: User,
    },

    Admin: {
        variant: "destructive",
        className: "",
        icon: UserShield,
    },
}