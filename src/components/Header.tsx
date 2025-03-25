import { SidebarTrigger } from "./ui/sidebar"
import { Button } from "./ui/button"
import { ModeToggle } from "./ModeToggle"
import { Bell } from "lucide-react"

interface HeaderProps {
  title: string
}

const Header = ({ title }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
      <SidebarTrigger className="h-8 w-8" />
      <div className="flex-1">
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
        <ModeToggle />
      </div>
    </header>
  )
}

export default Header

