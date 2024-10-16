import { useEffect, useState } from "react";
import {
  Sun,
  Moon,
} from "lucide-react"

export function ThemeChanger() {
  const [lightMode, setLightMode] = useState<boolean>(true);

  useEffect(() => {
    const storedLightMode = localStorage.getItem('lightMode');
    if (storedLightMode) {
      setLightMode(JSON.parse(storedLightMode));
    }
  }, [])

  const handleSetLightMode = () => {
    setLightMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem('lightMode', JSON.stringify(newMode));
      return newMode;
    });
  };

  useEffect(() => {
    if (lightMode) {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
    }
  }, [lightMode])

  return (
    <>
      { lightMode 
        ? <Moon className="cursor-pointer h-5"  onClick={handleSetLightMode}/>
        : <Sun className="cursor-pointer h-5" onClick={handleSetLightMode} />
      }
    </>
  )
}