import { Card } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

const AttendanceOverview = () => {
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
        {Object.entries(attendanceData).map(([category, data]) => (
          <Card key={category} className="p-6">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-foreground mb-1">
                {category}
              </h3>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-1000"
                  style={{ width: `${data["Total Attendance"]}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Overall Attendance: {data["Total Attendance"]}%
              </p>
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
        ))}
      </div>
    </div>
  );
};

export default AttendanceOverview;
