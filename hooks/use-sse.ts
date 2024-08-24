// hooks/useSSE.ts
import { useEffect, useState } from "react";

type SSEData = {
  todayCount: number;
  monthCount: number;
  yearCount: number;
  monthlyPatientCounts: { month: string; totalPatients: number }[];
  recentPatients: { _id: string; fullname: string; email: string }[];
  currentMonthPatients: { _id: string; fullname: string; createdAt: string }[];
  treatment: { _id: string; name: string }[];
  medicine: { _id: string; name: string }[];
};

const defaultData: SSEData = {
  todayCount: 0,
  monthCount: 0,
  yearCount: 0,
  monthlyPatientCounts: Array.from({ length: 12 }, (_, i) => ({
    month: new Date(0, i).toLocaleString("default", { month: "long" }),
    totalPatients: 0,
  })),
  recentPatients: [],
  currentMonthPatients: [],
  treatment: [],
  medicine: [],
};

const useSSE = (url: string) => {
  const [data, setData] = useState<SSEData>(defaultData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      try {
        const parsedData: SSEData = JSON.parse(event.data);
        setData(parsedData);
      } catch (e) {
        setError("Error parsing server response.");
      }
    };

    eventSource.onerror = () => {
      setError("An error occurred with the event source.");
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [url]);

  return { data, error };
};

export default useSSE;
