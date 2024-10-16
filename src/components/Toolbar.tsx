import {
  MousePointer,
  UtilityPole,
  Ruler,
  Route,
  Magnet,
} from "lucide-react"
import { useJobContext } from "@/context/JobContext"

export function Toolbar() {
  const { activeTool, setActiveTool, setSelectedMarker } = useJobContext();

  const handleToolSelection = (tool: string) => {
    setSelectedMarker(null);
    setActiveTool(tool);
  }

  return (
    <div className="flex flex-col items-center text-primary w-12 h-full shrink-0 bg-primary-foreground border-t border-r">
      <div
        onClick={() => handleToolSelection('selection')}
        className={`${activeTool === 'selection' ? 'text-secondary bg-primary hover:text-secondary' : ''} flex h-12 w-full items-center justify-center text-muted-foreground transition-colors hover:text-foreground cursor-pointerr`}
      >
      <MousePointer />
      </div>
      <div
        onClick={() => handleToolSelection('plotting')}
        className={`${activeTool === 'plotting' ? 'text-secondary bg-primary hover:text-secondary' : ''} flex h-12 w-full items-center justify-center text-muted-foreground transition-colors hover:text-foreground cursor-pointerr`}
      >
      <UtilityPole />
      </div>
      <div
        onClick={() => handleToolSelection('measure')}
        className={`${activeTool === 'measure' ? 'text-secondary bg-primary hover:text-secondary' : ''} flex h-12 w-full items-center justify-center text-muted-foreground transition-colors hover:text-foreground cursor-pointerr`}
      >
      <Ruler />
      </div>
      <div
        onClick={() => handleToolSelection('routing')}
        className={`${activeTool === 'routing' ? 'text-secondary bg-primary hover:text-secondary' : ''} flex h-12 w-full items-center justify-center text-muted-foreground transition-colors hover:text-foreground cursor-pointerr`}
      >
      <Route />
      </div>
      <div
        onClick={() => handleToolSelection('magnet')}
        className={`${activeTool === 'magnet' ? 'text-secondary bg-primary hover:text-secondary' : ''} flex h-12 w-full items-center justify-center text-muted-foreground transition-colors hover:text-foreground cursor-pointerr`}
      >
      <Magnet />
      </div>
    </div>
  )
}