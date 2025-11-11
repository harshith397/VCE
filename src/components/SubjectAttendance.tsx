import { Card } from "@/components/ui/card";
import { FileText } from "lucide-react";
import SubjectProgressBar from "./SubjectProgressBar";

interface SubjectAttendanceProps {
  data: {
    Presentees: Record<string, number>;
    "Held Classes": Record<string, number>;
    "Extra Classes": Record<string, number>;
  };
  currentSem?: number | string;
}

const SubjectAttendance = ({ data, currentSem }: SubjectAttendanceProps) => {
  if (!data) return null;

  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <FileText className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">
          Subject-wise Overview (Regular)
        </h2>
      </div>

      <Card className="p-4 sm:p-6 shadow-lg card-shadow">
        <div className="divide-y divide-border">
          {Object.entries(data.Presentees).map(([subject, presentValue]) => {
            const present = Number(presentValue);
            const extra = Number(data["Extra Classes"][subject]) || 0;
            const held = Number(data["Held Classes"][subject]) || 0;
            const percentage = held > 0 ? ((present + extra) / held) * 100 : 0;

            return (
              <SubjectProgressBar
                key={subject}
                subject={subject}
                presentees={present}
                held={held}
                percentage={percentage}
                isLoading={false}
                semester={currentSem}
              />
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default SubjectAttendance;