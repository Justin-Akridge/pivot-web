import { useLocation } from 'react-router-dom';
import React, { useEffect, createContext, useState, useContext, ReactNode } from 'react';
import { Job } from '@/components/Jobs';
import * as XLSX from 'xlsx'; // Import xlsx library

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
  exportToExcel: () => void;
  measurements: any[]
  setMeasurements: (measure: any) => void;

  setMidspanMeasurements: (measure: any) => void;
  midspanMeasurements: any[]
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [poles, setPoles] = useState<Position[]>([]);
  const [midspans, setMidspans] = useState<unknown[]>([]);
  const [activeTool, setActiveTool] = useState<string>('selection');
  const [selectedMarker, setSelectedMarker] = useState<Position | null>(null);
  const [activeMeasurement, setActiveMeasurement] = useState<any | null>(null);
  const [viewer, setViewer] = useState();

  const [measurements, setMeasurements] = useState([]); // Initial state is empty
  const [midspanMeasurements, setMidspanMeasurements] = useState([]); // Initial state is empty
  useEffect(() => {
    // Update measurements based on the current length of poles
    setMidspanMeasurements(Array.from({ length: midspans.length }, () => ({
      primaries: [],
      neutrals: [],
      secondaries: [],
      comms: [],
    })))
  }, [midspans]);

  useEffect(() => {
    // Update measurements based on the current length of poles
    setMeasurements(Array.from({ length: poles.length }, () => ({
      primaries: [],
      neutrals: [],
      secondaries: [],
      transformers: [],
      driploops: [],
      risers: [],
      comms: [],
    })))
  }, [poles]);


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

  const exportToExcel = () => {
    const combinedData = poles.map((pole, index) => {
      // Create a new object for each pole
      const measurement = measurements[index] || {}; // Get the corresponding measurement or an empty object
      return {
        id: pole.id, // Assuming pole has an 'id' property
        lat: pole.lat, // Assuming pole has 'lat' and 'lng' properties
        lng: pole.lng,
        // Add measurements for this pole
        neutrals: measurement.neutrals ? measurement.neutrals.join(', ') : '',
        primaries: measurement.primaries ? measurement.primaries.join(', ') : '',
        secondaries: measurement.secondaries ? measurement.secondaries.join(', ') : '',
        transformers: measurement.transformers ? measurement.transformers.join(', ') : '',
        driploops: measurement.driploops ? measurement.driploops.join(', ') : '',
        risers: measurement.risers ? measurement.risers.join(', ') : '',
        comms: measurement.comms ? measurement.comms.join(', ') : '',
      };
    });
  
    // Convert combined data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(combinedData);
  
    // Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Poles and Measurements');
  
    // Generate a file and prompt the user to download it
    XLSX.writeFile(workbook, 'poles_and_measurements.xlsx');
  };

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
      viewer, setViewer, exportToExcel,
      measurements, setMeasurements, setMidspanMeasurements, midspanMeasurements
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