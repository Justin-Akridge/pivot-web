import React, { useState } from 'react';
import { Button } from './ui/button';
import { Job } from './Jobs';
// import { useAuth } from '@/context/AuthContext';

interface CreateJobProps { 
  toggleJobModal : React.Dispatch<React.SetStateAction<boolean>>;
  setJobs: React.Dispatch<React.SetStateAction<Job[]>>;
}

export const formatDateDescription = () => {
  const timestamp = Date.now();
  const date = new Date(timestamp);

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const dayOfWeek = daysOfWeek[date.getDay()];
  const month = months[date.getMonth()];
  const dayOfMonth = date.getDate();
  const year = date.getFullYear();

  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? 0 + minutes : minutes;

  const formattedDescription = `${dayOfWeek}, ${month} ${dayOfMonth}, ${year} at ${hours}:${minutes} ${ampm}`;
  return formattedDescription;
};

//set jobs is a useState component
export function CreateJobForm({toggleJobModal, setJobs}: CreateJobProps) {
  const [jobName, setJobName] = useState<string>("");
  const [client, setClient] = useState<string>("");

  const resetFormFields = () => {
    setJobName('');
    setClient('');
  }

  const handleCreateJob = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    resetFormFields();
    fetch(`${import.meta.env.VITE_BASE_URL}/api/job`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jobName: jobName,
        companyName: client,
      })
    }).then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    }).then(data => {
      setJobs((prevJobs) => [...prevJobs, data]);
    }).catch(e => {
      console.error(e);
    })

    toggleJobModal(false);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-background border p-12 rounded-lg shadow-lg h-[500px] max-w-lg w-full flex flex-col justify-between">
        <div className='text-2xl mb-10'>New job</div>
        <form onSubmit={handleCreateJob} className="flex flex-col h-full">
          <div className="flex flex-col flex-1 justify-between">
            <div className="flex flex-col gap-6">
              <label htmlFor="jobName" className="font-semibold">Job Name</label>
              <input
                type="text"
                id="jobName"
                value={jobName}
                onChange={(e) => setJobName(e.target.value)}
                className="border bg-card rounded-lg px-3 py-2"
                required
              />
              <label htmlFor="company" className="font-semibold">Company</label>
              <input
                type="text"
                id="company"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                className="border bg-card rounded-lg px-3 py-2"
                required
              />
            </div>
            <div className="flex justify-between mt-8">
              <Button onClick={() => toggleJobModal(false)} type="button" className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400">
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-primary px-4 py-2 rounded-lg hover:bg-secondary hover:text-primary"
              >
                Create Job
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};