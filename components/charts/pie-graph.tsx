"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart, Cell } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const pieChartColors = [
  "#FF5733", // Vibrant Red-Orange
  "#33FF57", // Bright Green
  "#3357FF", // Vivid Blue
  "#FF33A1", // Hot Pink
  "#FFA533", // Bright Orange
  "#33FFF5", // Cyan
  "#F5FF33", // Lemon Yellow
  "#8D33FF", // Electric Purple
  "#FF33C1", // Neon Pink
  "#33FF8D", // Mint Green
  "#FF5733", // Vivid Red
  "#FF33FF", // Magenta
];

const chartConfig = {
  patient: {
    label: "Patient",
  },
  January: {
    label: "January",
    color: pieChartColors[0],
  },
  February: {
    label: "February",
    color: pieChartColors[1],
  },
  March: {
    label: "March",
    color: pieChartColors[2],
  },
  April: {
    label: "April",
    color: pieChartColors[3],
  },
  May: {
    label: "May",
    color: pieChartColors[4],
  },
  June: {
    label: "June",
    color: pieChartColors[5],
  },
  July: {
    label: "July",
    color: pieChartColors[6],
  },
  August: {
    label: "August",
    color: pieChartColors[7],
  },
  September: {
    label: "September",
    color: pieChartColors[8],
  },
  October: {
    label: "October",
    color: pieChartColors[9],
  },
  November: {
    label: "November",
    color: pieChartColors[10],
  },
  December: {
    label: "December",
    color: pieChartColors[11],
  },
} satisfies ChartConfig;

export function PieGraph({ data }: { data: any }) {
  const totalPatients = React.useMemo(() => {
    return data.reduce((acc: any, curr: any) => acc + curr.patient, 0);
  }, [data]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Monthly Patients Distribution</CardTitle>
        <CardDescription>January - December 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[360px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey="patient"
              nameKey="month"
              innerRadius={60}
              strokeWidth={5}
            >
              {data.map((entry: any, index: number) => (
                <Cell
                  key={`cell-${index}`}
                  fill={pieChartColors[index % pieChartColors.length]}
                />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalPatients.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Patients
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total patients for the year 2024
        </div>
      </CardFooter>
    </Card>
  );
}
