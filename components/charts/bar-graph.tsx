"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { format, eachDayOfInterval, startOfMonth, endOfMonth } from "date-fns";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface Patient {
  _id: string;
  fullname: string;
  createdAt: string;
}

const getDateRangeForCurrentMonth = () => {
  const today = new Date();
  const startOfThisMonth = startOfMonth(today);
  const endOfThisMonth = endOfMonth(startOfThisMonth);

  return {
    startOfThisMonth,
    endOfThisMonth,
  };
};

const { startOfThisMonth, endOfThisMonth } = getDateRangeForCurrentMonth();

interface ChartData {
  date: string;
  count: number;
}

const aggregatePatientData = (patients: Patient[]): ChartData[] => {
  const patientCounts: Record<string, number> = {};

  // Fill the map with default values for the current month
  eachDayOfInterval({ start: startOfThisMonth, end: endOfThisMonth }).forEach(
    (date) => {
      patientCounts[format(date, "yyyy-MM-dd")] = 0;
    }
  );

  // Count patients per day
  patients.forEach((patient) => {
    const date = format(new Date(patient.createdAt), "yyyy-MM-dd");
    if (patientCounts[date] !== undefined) {
      patientCounts[date] += 1;
    }
  });

  // Convert map to array format compatible with recharts
  return Object.entries(patientCounts).map(([date, count]) => ({
    date,
    count,
  }));
};

const chartConfig: ChartConfig = {
  views: {
    label: "Number of Patients",
  },
  count: {
    label: "Patients",
    color: "hsl(var(--chart-1))",
  },
};

export function BarGraph({ data }: { data: Patient[] }) {
  const chartData = aggregatePatientData(data);

  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("count");

  const total = React.useMemo(
    () => ({
      count: chartData.reduce((acc, curr) => acc + curr.count, 0),
    }),
    [chartData]
  );

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Bar Chart - Current Month</CardTitle>
          <CardDescription>
            Showing total patients for the current month
          </CardDescription>
        </div>
        <div className="flex">
          {["count"].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[280px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="count"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
