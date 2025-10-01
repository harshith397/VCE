import { Card } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const AttendanceOverview = () => {
  const getColorByPercentage = (percentage: number) => {
    if (percentage > 85) return "hsl(var(--success))";
    if (percentage >= 75) return "hsl(var(--warning))";
    return "hsl(var(--danger))";
  };

  const getAbsentColor = () => "hsl(var(--muted))";

  const getPieData = (attendance: number) => {
    return [
      { name: "Present", value: attendance },
      { name: "Absent", value: 100 - attendance },
    ];
  };
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
      <div className="flex items-center gap-3 mb-4">
        <BookOpen className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">
          Attendance Overview
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(attendanceData).map(([category, data]) => {
          const percentage = parseFloat(data["Total Attendance"]);
          const pieData = getPieData(percentage);
          const mainColor = getColorByPercentage(percentage);
          const absentColor = getAbsentColor();

          return (
            <Card key={category} className="p-6">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-foreground mb-4">
                  {category}
                </h3>
                
                <div className="flex items-center justify-center mb-4">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        <Cell fill={mainColor} />
                        <Cell fill={absentColor} />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>

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
