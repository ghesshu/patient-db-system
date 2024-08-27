"use client";
import { motion } from "framer-motion";
import { AreaGraph } from "@/components/charts/area-graph";
import { BarGraph } from "@/components/charts/bar-graph";
import { PieGraph } from "@/components/charts/pie-graph";
// import { CalendarDateRangePicker } from "@/components/date-range-picker";
import PageContainer from "@/components/layout/page-container";
import { RecentPatients } from "@/components/recent-patient";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSSE } from "@/contexts/SSEContext";

export default function Page() {
  const { data, error } = useSSE();

  const defaultData = {
    todayCount: 0,
    monthCount: 0,
    yearCount: 0,
    monthlyPatientCounts: [
      { month: "January", totalPatients: 0 },
      { month: "February", totalPatients: 0 },
      { month: "March", totalPatients: 0 },
      { month: "April", totalPatients: 0 },
      { month: "May", totalPatients: 0 },
      { month: "June", totalPatients: 0 },
      { month: "July", totalPatients: 0 },
      { month: "August", totalPatients: 0 },
      { month: "September", totalPatients: 0 },
      { month: "October", totalPatients: 0 },
      { month: "November", totalPatients: 0 },
      { month: "December", totalPatients: 0 },
    ],
    recentPatients: [
      { _id: "", fullname: "", email: "" },
      { _id: "", fullname: "", email: "" },
      { _id: "", fullname: "", email: "" },
    ],
    currentMonthPatients: [],
  };

  const currentData = data || defaultData;

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-2">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Hi, Welcome back 👋
          </h2>
          <div className="hidden items-center space-x-2 md:flex">
            {/* <CalendarDateRangePicker /> */}
            {/* <Button>Download</Button> */}
          </div>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            {/* <TabsTrigger value="analytics" disabled>
              Analytics
            </TabsTrigger> */}
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Today Patients
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <motion.div
                    className="text-2xl font-bold"
                    key={currentData.todayCount}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    +{currentData.todayCount}
                  </motion.div>
                  <p className="text-xs text-muted-foreground pt-2">
                    Total Patients Today &rarr;{" "}
                    <span className="text-primary">
                      {currentData.todayCount}
                    </span>
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Monthly Patients
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <motion.div
                    className="text-2xl font-bold"
                    key={currentData.monthCount}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    +{currentData.monthCount}
                  </motion.div>
                  <p className="text-xs text-muted-foreground pt-2">
                    Total Patients This Month &rarr;{" "}
                    <span className="text-primary">
                      {currentData.monthCount}
                    </span>
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Yearly Patients
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <path d="M2 10h20" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <motion.div
                    className="text-2xl font-bold"
                    key={currentData.yearCount}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    +{currentData.yearCount}
                  </motion.div>
                  <p className="text-xs text-muted-foreground pt-2">
                    Total Patients This Year &rarr;{" "}
                    <span className="text-primary">
                      {currentData.yearCount}
                    </span>
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
              <div className="col-span-4">
                <BarGraph data={currentData?.currentMonthPatients} />
              </div>
              <Card className="col-span-4 md:col-span-3">
                <CardHeader>
                  <CardTitle>Recent Patients </CardTitle>
                </CardHeader>
                <CardContent>
                  <RecentPatients data={currentData?.recentPatients} />
                </CardContent>
              </Card>
              <div className="col-span-4">
                <AreaGraph data={currentData?.monthlyPatientCounts} />
              </div>
              <div className="col-span-4 md:col-span-3">
                <PieGraph data={currentData?.monthlyPatientCounts} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
