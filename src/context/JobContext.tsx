import { useLocation } from 'react-router-dom';
import React, { useEffect, createContext, useState, useContext, ReactNode } from 'react';
import { Job } from '@/components/Jobs';

export interface Position {
  lat: number;
  lng: number;
  x: number;
  y: number;
  z: number
}

interface JobContextType {
  selectedJob: Job | null;
  setSelectedJob: (job: Job) => void;
  poles: Position[];
  setPoles: (pole: Position[]) => void;
  midspans: unknown[];
  setMidspans: (midspan: unknown[]) => void;
  activeTool: string;
  setActiveTool: (tool: string) => void;
  selectedMarker: Position | null;
  setSelectedMarker: (marker: Position | null) => void;
  activeMeasurement: any | null;
  setActiveMeasurement: (measurement: any | null) => void;
  viewer: any | null;
  setViewer: (viewer: any | null) => void;
  saveMidspansToFile: () => void;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [poles, setPoles] = useState<Position[]>([]);
  const [midspans, setMidspans] = useState<unknown[]>([]);
  const [activeTool, setActiveTool] = useState<string>('selection');
  const [selectedMarker, setSelectedMarker] = useState<Position | null>(null);
  const [activeMeasurement, setActiveMeasurement] = useState<any | null>(null);
  const [viewer, setViewer] = useState();

  useEffect(() => {
    fetch("/poles.json")
    .then(reponse => {
      if (!reponse.ok) {
        throw new Error("Reponse was not okay fetching poles")
      }
      return reponse.json();
    }).then(data => {
      setPoles(data);

      console.log(poles)
    }).catch(e => {
      console.error(e);
    })
  },[])

  useEffect(() => {
    fetch("/midspans.json")
    .then(reponse => {
      if (!reponse.ok) {
        throw new Error("Reponse was not okay fetching midspans")
      }
      return reponse.json();
    }).then(data => {
      setMidspans(data);

      console.log(poles)
    }).catch(e => {
      console.error(e);
    })
  },[])

  const saveMidspansToFile = () => {
    const dataStr = JSON.stringify(midspans, null, 2); // Convert midspans to JSON string
    const blob = new Blob([dataStr], { type: 'application/json' }); // Create a blob
    const url = URL.createObjectURL(blob); // Create a URL for the blob
  
    // Create a link to trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'midspans.json'; // Set the desired file name
    document.body.appendChild(a);
    a.click(); // Programmatically click the link to trigger the download
    document.body.removeChild(a); // Clean up
    URL.revokeObjectURL(url); // Release the URL
  };

  const [selectedJob, setSelectedJob] = useState<Job | null>(() => {
    const job = localStorage.getItem('selectedJob');
    if (job) {
      try {
        return JSON.parse(job) as Job;
      } catch (error) {
        console.error("Failed to parse job from localStorage:", error);
        return null;
      }
    }
    return null;
  });

  const location = useLocation();

  useEffect(() => {
    localStorage.setItem('job', JSON.stringify(selectedJob));
  }, [selectedJob])

  useEffect(() => {
    console.log(selectedJob?.id)
    if (location.pathname !== `/${selectedJob?.id}`) {
      setSelectedJob(null);
    }
  },[location, selectedJob])


  return (
    <JobContext.Provider value={{ 
      selectedJob, setSelectedJob,
      poles, setPoles,
      midspans, setMidspans,
      activeTool, setActiveTool,
      selectedMarker, setSelectedMarker,
      activeMeasurement, setActiveMeasurement,
      viewer, setViewer, saveMidspansToFile
    }}>
      {children}
    </JobContext.Provider>
  );
};

export const useJobContext = () => {
  const context = useContext(JobContext);
  if (context === undefined) {
    throw new Error('useJobContext must be used within a JobProvider');
  }
  return context;
};