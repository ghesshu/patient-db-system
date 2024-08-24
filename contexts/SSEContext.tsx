// contexts/SSEContext.tsx
"use client";
import React, { createContext, useContext, ReactNode } from "react";
import { useQuery, useQueryClient } from "react-query";

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

type SSEContextType = {
  data: SSEData;
  error: string | null;
};

const SSEContext = createContext<SSEContextType>({
  data: defaultData,
  error: null,
});

interface SSEProviderProps {
  url: string;
  children: ReactNode;
}

export const SSEProvider: React.FC<SSEProviderProps> = ({ url, children }) => {
  const queryClient = useQueryClient();

  const fetchSSEData = async (): Promise<SSEData> => {
    return new Promise((resolve, reject) => {
      const eventSource = new EventSource(url);

      eventSource.onmessage = (event) => {
        try {
          const parsedData: SSEData = JSON.parse(event.data);
          resolve(parsedData);
          eventSource.close();
        } catch (e) {
          reject("Error parsing server response.");
        }
      };

      eventSource.onerror = () => {
        reject("An error occurred with the event source.");
        eventSource.close();
      };
    });
  };

  //   const { data = defaultData, error } = useQuery<SSEData>(
  //     ["sseData", url],
  //     fetchSSEData,
  //     {
  //       refetchOnWindowFocus: false,
  //       refetchInterval: false, // Avoid React Query's refetching since SSE is already real-time
  //       onSuccess: (newData) => {
  //         queryClient.setQueryData(["sseData", url], newData);
  //       },
  //       onError: () => {
  //         // handle error
  //       },
  //       retry: false,
  //     }
  //   );

  //   return (
  //     <SSEContext.Provider value={{ data, error }}>
  //       {children}
  //     </SSEContext.Provider>
  //   );
  const { data = defaultData, error } = useQuery<SSEData>(
    ["sseData", url],
    fetchSSEData,
    {
      refetchOnWindowFocus: false,
      refetchInterval: false,
      onSuccess: (newData) => {
        queryClient.setQueryData(["sseData", url], newData);
      },
      onError: () => {
        // handle error
      },
      retry: false,
    }
  );

  // Explicitly cast the error to a string or null
  return (
    <SSEContext.Provider value={{ data, error: error as string | null }}>
      {children}
    </SSEContext.Provider>
  );
};

export const useSSE = () => {
  const context = useContext(SSEContext);
  if (context === undefined) {
    throw new Error("useSSE must be used within an SSEProvider");
  }
  return context;
};
