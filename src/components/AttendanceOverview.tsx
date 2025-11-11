"use client"

import { useState, useEffect, useMemo } from "react"
import { BookOpen } from "lucide-react"
import {
  PieChart,
  Pie,
  Cell,
  Label,
  ResponsiveContainer,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

// ✅ Animated Donut Pie
const AnimatedPie = ({ percentage, mainColor, absentColor }) => {
  const [currentValue, setCurrentValue] = useState(0)

  useEffect(() => {
    let start = 0
    const duration = 800
    const step = 10
    const increment = percentage / (duration / step)
    const interval = setInterval(() => {
      start += increment
      if (start >= percentage) {
        start = percentage
        clearInterval(interval)
      }
      setCurrentValue(start)
    }, step)
    return () => clearInterval(interval)
  }, [percentage])

  const pieData =
    // Avoid showing a tiny "absent" slice for true 100% values.
    // For percentage >= 100 we present a single slice with value 100.
    // For other values we animate using currentValue so the pie and label stay in sync.
    percentage >= 100
      ? [{ name: "Present", value: 100 }]
      : [
          { name: "Present", value: currentValue },
          { name: "Absent", value: 100 - currentValue },
        ]

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
        <ChartTooltip content={<ChartTooltipContent hideLabel />} cursor={false} />
        <Pie
          data={pieData}
          dataKey="value"
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={78}
          startAngle={90}
          endAngle={-270}
          isAnimationActive={false}
          //cornerRadius={6}
        >
          <Cell fill={mainColor} />
          {percentage < 100 && <Cell fill={absentColor} />}
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
                      className="fill-foreground text-2xl font-bold"
                    >
                      {Math.min(currentValue, 100).toFixed(2)}%
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 18}
                      className="fill-muted-foreground text-sm"
                    >
                      Attendance
                    </tspan>
                  </text>
                )
              }
            }}
          />
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  )
}

// ✅ Main Component
const AttendanceOverview = ({ data }) => {
  if (!data) return null

  const getColorByPercentage = (percentage) => {
    if (percentage > 85) return "hsl(var(--success))"
    if (percentage >= 75) return "hsl(var(--warning))"
    return "hsl(var(--destructive))"
  }
  const getAbsentColor = () => "hsl(var(--muted))"

  const categories = useMemo(
    () => Object.keys(data).filter(k => data[k] && data[k]["Total Attendance"] !== undefined),
    [data]
  )

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">
          Attendance Overview
        </h2>
      </div>

      {/* Attendance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((category) => {
          const percentage = parseFloat(data[category]["Total Attendance"])
          const mainColor = getColorByPercentage(percentage)
          const absentColor = getAbsentColor()

          return (
            <Card
              key={category}
              className="flex flex-col items-center justify-center shadow-lg border rounded-2xl card-shadow"
            >
              <CardHeader className="pb-0 items-center">
                <CardTitle className="text-sm font-semibold">{category}</CardTitle>
                <CardDescription className="text-xs">
                  {percentage >= 90
                    ? "Excellent"
                    : percentage >= 75
                    ? "Moderate"
                    : "Needs Attention"}
                </CardDescription>
              </CardHeader>

              <CardContent className="w-full max-w-[220px] flex justify-center pb-3">
                <ChartContainer
                    config={{
                      attendance: { label: "Attendance %", color: "hsl(var(--primary))" },
                    }}
                  className="aspect-square w-full"
                  >

                  <AnimatedPie
                    percentage={percentage}
                    mainColor={mainColor}
                    absentColor={absentColor}
                  />
                </ChartContainer>
              </CardContent>

              <CardFooter className="flex flex-col text-center gap-1 text-xs pt-2 pb-3">
                <p className="text-muted-foreground">
                  Total Attendance
                </p>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default AttendanceOverview
