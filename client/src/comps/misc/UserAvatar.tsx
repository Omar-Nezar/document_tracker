import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

type UserAvatarProps = {
  src?: string;
  alt?: string;
  fallback?: React.ReactNode;
  className?: string;
};

export default function UserAvatar({
  src,
  alt = "User",
  fallback,
  className,
}: UserAvatarProps) {
  return (
    <Avatar className={cn("h-8 w-8 rounded-lg", className)}>
      <AvatarImage src={src || "avatar"} alt={alt} />

      <AvatarFallback className="rounded-lg">
        {fallback ? fallback : <User className="h-4 w-4" />}
      </AvatarFallback>
    </Avatar>
  );
}