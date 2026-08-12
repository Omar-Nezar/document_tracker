import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Sun, Moon } from "lucide-react"

export default function ThemeToggle() {
    const [dark, setDark] = useState(() => {
        // initialize from localStorage
        const saved = localStorage.getItem("theme")
        return saved === "dark"
    })

    useEffect(() => {
        const root = document.documentElement

        if (dark) {
            root.classList.add("dark")
            localStorage.setItem("theme", "dark")
        } else {
            root.classList.remove("dark")
            localStorage.setItem("theme", "light")
        }
    }, [dark])

    const toggle = () => {
        setDark(prev => !prev)
    }

    return (
        <Button
            onClick={toggle}
            className="fixed bottom-5 right-5 p-2 rounded-full bg-primary text-primary-foreground shadow-lg"
        >
            {dark ? <Sun /> : <Moon />}
        </Button>
    )
}