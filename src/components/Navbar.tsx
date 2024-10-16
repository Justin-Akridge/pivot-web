import { Link } from "react-router-dom";
import {
  CircleHelp,
  Facebook,
  Settings,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipProvider,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ThemeChanger } from "./Theme";
import { useJobContext } from "@/context/JobContext";

export function Navbar() {
  const { saveMidspansToFile} = useJobContext();
  return (
    <div className="h-12 flex w-full items-center bg-primary-foreground">
      <div className="flex items-center px-3 gap-8">
        <Link
          to="/"
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 text-lg font-semibold text-primary md:h-8 md:w-8 md:text-base"
        >
          <Facebook className="h-6 w-6 transition-all group-hover:scale-110" />
          <span className="sr-only">Pivot Inc</span>
        </Link>
        <div className="text-sm cursor-pointer">
          File
        </div>
        <div className="text-sm cursor-pointer">
          Environments
        </div>
        <div className="text-sm cursor-pointer">
          Views
        </div>
        <div className="text-sm cursor-pointer">
          Export
        </div>
        <div onClick={() => saveMidspansToFile()}>save</div>
      </div>
      <div className="ml-auto flex mr-4 items-center gap-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8 cursor-pointer"
              >
                <ThemeChanger />
                <span className="sr-only">Theme</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">Theme</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/support"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <CircleHelp className="h-5 w-5"/>
                <span className="sr-only">Support</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Support</TooltipContent>
          </Tooltip>
          <Tooltip>
          <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <TooltipTrigger asChild>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8">
                <Settings className="h-5 w-5" />
              </div>
            </TooltipTrigger>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link to="/settings">
              <DropdownMenuItem>Settings</DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <TooltipContent side="right">Settings</TooltipContent>
      </Tooltip>
      </TooltipProvider>
      </div>
    </div>
  )
}