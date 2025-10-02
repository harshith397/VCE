import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

// ✅ Animated Pie component
const AnimatedPie = ({ percentage, mainColor, absentColor }) => {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1000; // 1s animation
    const step = 10; 
    const increment = percentage / (duration / step);

    const interval = setInterval(() => {
      start += increment;
      if (start >= percentage) {
        start = percentage;
        clearInterval(interval);
      }
      setCurrentValue(start);
    }, step);

    return () => clearInterval(interval);
  }, [percentage]);

  // ✅ If 100%, only show one slice
  const pieData =
  percentage === 100
    ? [{ name: "Present", value: 100 }]
    : [
        { name: "Present", value: currentValue },
        { name: "Absent", value: 100 - currentValue },
      ];

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={pieData}
          dataKey="value"
  cx="50%"
  cy="50%"
  innerRadius={60}
  outerRadius={80}
  startAngle={90}
  endAngle={450}   // ✅ full clockwise circle
  paddingAngle={0} // ✅ no gaps
  isAnimationActive={false}
>

          <Cell fill={mainColor} />
          {percentage < 100 && <Cell fill={absentColor} />}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

// ✅ Main Component
const AttendanceOverview = () => {
  const getColorByPercentage = (percentage: number) => {
    if (percentage > 85) return "hsl(var(--success))";
    if (percentage >= 75) return "hsl(var(--warning))";
    return "hsl(var(--danger))";
  };

  const getAbsentColor = () => "hsl(var(--muted))";

  const attendanceData = {
    ECA: {
      "Total Classes": "4",
      "Presentees": "4",
      "Abscentees": "0",
      "Extra Classes": "0",
      "Total Attendance": "100",
    },
    Regular: {
      "Total Classes": "208",
      "Presentees": "164",
      "Abscentees": "44",
      "Extra Classes": "0",
      "Total Attendance": "78.84",
    },
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <BookOpen className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">
          Attendance Overview
        </h2>
      </div>

      {/* Attendance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(attendanceData).map(([category, data]) => {
          const percentage = parseFloat(data["Total Attendance"]);
          const mainColor = getColorByPercentage(percentage);
          const absentColor = getAbsentColor();

          return (
            <Card key={category} className="p-6">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-foreground mb-4">
                  {category}
                </h3>

                {/* Animated Pie */}
                <div className="flex items-center justify-center mb-4">
                  <AnimatedPie
                    percentage={percentage}
                    mainColor={mainColor}
                    absentColor={absentColor}
                  />
                </div>

                {/* Attendance Percentage */}
                <div className="text-center mb-4">
                  <p
                    className="text-3xl font-bold"
                    style={{ color: mainColor }}
                  >
                    {data["Total Attendance"]}%
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Overall Attendance
                  </p>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(data).map(([key, value]) => {
                  if (key === "Total Attendance") return null;
                  return (
                    <div key={key} className="flex flex-col space-y-1">
                      <span className="text-sm font-medium text-muted-foreground">
                        {key}
                      </span>
                      <span className="text-lg font-bold text-foreground">
                        {value}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AttendanceOverview;
