"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { motion } from "framer-motion";

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

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function AreaGraph({ data }: { data: any }) {
  // Determine the current and previous month's data
  const currentMonthName = new Date().toLocaleString("default", {
    month: "long",
  });
  const previousMonthName = new Date(
    new Date().setMonth(new Date().getMonth() - 1)
  ).toLocaleString("default", { month: "long" });
  const currentYear = new Date().getFullYear();

  const currentMonthData = data.find(
    (entry: any) => entry.month === currentMonthName
  );
  const previousMonthData = data.find(
    (entry: any) => entry.month === previousMonthName
  );

  const currentMonthPatientCount = currentMonthData
    ? currentMonthData.patient
    : 0;
  const previousMonthPatientCount = previousMonthData
    ? previousMonthData.patient
    : 0;

  // Calculate percentage change
  const percentageChange = previousMonthPatientCount
    ? ((currentMonthPatientCount - previousMonthPatientCount) /
        previousMonthPatientCount) *
      100
    : currentMonthPatientCount * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Area Chart - Stacked</CardTitle>
        <CardDescription>
          Showing total patients for the last {data ? data.length : 0} months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[310px] w-full"
        >
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={true}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={true}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="patient"
              type="natural"
              fill="var(--color-mobile)"
              fillOpacity={0.2}
              stroke="var(--color-mobile)"
              stackId="a"
            />
            <Area
              dataKey="desktop"
              type="natural"
              fill="var(--color-desktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <motion.div
              className="flex items-center gap-2 font-medium leading-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              Trending {percentageChange >= 0 ? "up" : "down"} by{" "}
              <span className="flex items-center">
                {Math.abs(percentageChange).toFixed(1)}% this month{" "}
                {percentageChange >= 0 ? (
                  <TrendingUp className="h-4 w-4 ml-2 text-green-300 " />
                ) : (
                  <TrendingDown className="h-4 w-4 ml-1 text-red-600" />
                )}
              </span>
            </motion.div>

            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              {currentMonthName} {currentYear}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
