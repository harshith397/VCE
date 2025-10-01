import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { FileText } from "lucide-react";
import SubjectProgressBar from "./SubjectProgressBar";

const SubjectAttendance = () => {
  const [isLoading, setIsLoading] = useState(true);

  const subjectData = {
    "CA": { presentees: 24, held: 33, percentage: 72.73 },
    "CT": { presentees: 14, held: 17, percentage: 82.35 },
    "DS": { presentees: 25, held: 33, percentage: 75.76 },
    "DSL": { presentees: 14, held: 16, percentage: 87.5 },
    "ECA-TTC": { presentees: 4, held: 4, percentage: 100.0 },
    "HVPE-II": { presentees: 5, held: 7, percentage: 71.43 },
    "OE-NCES(OE)": { presentees: 9, held: 11, percentage: 81.82 },
    "OOPJ": { presentees: 30, held: 32, percentage: 93.75 },
    "OOPJL": { presentees: 14, held: 18, percentage: 77.78 },
    "SDC-I:CS-I": { presentees: 10, held: 14, percentage: 71.43 },
    "TTPS": { presentees: 19, held: 27, percentage: 70.37 },
  };

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <FileText className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">
          Subject-wise Attendance (Regular)
        </h2>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          {Object.entries(subjectData).map(([subject, data]) => (
            <SubjectProgressBar
              key={subject}
              subject={subject}
              presentees={data.presentees}
              held={data.held}
              percentage={data.percentage}
              isLoading={isLoading}
            />
          ))}
        </div>
      </Card>
    </div>
  );
};

export default SubjectAttendance;
