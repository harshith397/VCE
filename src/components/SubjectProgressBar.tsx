import { useEffect, useState } from "react";

interface SubjectProgressBarProps {
  subject: string;
  presentees: number;
  held: number;
  percentage: number;
  isLoading: boolean;
}

const SubjectProgressBar = ({
  subject,
  presentees,
  held,
  percentage,
  isLoading,
}: SubjectProgressBarProps) => {
  const [animatedWidth, setAnimatedWidth] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      // Trigger animation after component mounts
      const timer = setTimeout(() => {
        setAnimatedWidth(percentage);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading, percentage]);

  const getColorClass = (percent: number) => {
    if (percent >= 85) return "bg-primary";
    if (percent >= 75) return "bg-primary/80";
    return "bg-primary/60";
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-foreground">{subject}</h4>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-muted-foreground">
            Present: <span className="font-semibold text-foreground">{presentees}</span>
          </span>
          <span className="text-muted-foreground">
            Total: <span className="font-semibold text-foreground">{held}</span>
          </span>
          <span className="font-bold text-primary">{percentage.toFixed(2)}%</span>
        </div>
      </div>

      <div className="relative h-3 bg-muted rounded-full overflow-hidden">
        {isLoading ? (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-[shimmer_1.5s_ease-in-out_infinite]" />
        ) : (
          <div
            className={`h-full ${getColorClass(percentage)} rounded-full transition-all duration-1000 ease-out`}
            style={{ width: `${animatedWidth}%` }}
          />
        )}
      </div>
    </div>
  );
};

export default SubjectProgressBar;
