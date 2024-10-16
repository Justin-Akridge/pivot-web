import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { Settings } from "./components/Settings";
import { Support } from "./components/Support";
import { Signup } from "./components/Signup";
import { Login } from "./components/Login";
import { Viewer } from "./components/Viewer";
import { JobProvider } from "./context/JobContext";
export default function App() {
  // set default theme upon loading
  useEffect(() => {
    const storedLightMode = localStorage.getItem('lightMode');
    console.log(storedLightMode)
    if (storedLightMode) {
      const theme = JSON.parse(storedLightMode);
      if (theme) {
        document.documentElement.classList.remove("dark");
        document.documentElement.classList.add("light");
      } else {
        document.documentElement.classList.remove("light");
        document.documentElement.classList.add("dark");
      }
    }
  }, [])

  return (
    <Router>
    <JobProvider>
        <Routes>
          <Route path="/" element={<Viewer />} />
          <Route path="/:id" element={<Viewer />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/support" element={<Support />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
    </JobProvider>
    </Router>
  )
}