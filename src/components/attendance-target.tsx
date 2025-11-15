import React, { useState } from "react";

interface AttendanceTargetCardProps {
  label: string;
  data: any;
}

const AttendanceTargetCard: React.FC<AttendanceTargetCardProps> = ({ label, data }) => {
  const [target, setTarget] = useState<number | "">("");

  const totalClasses = Number(data?.["Total Classes"] || 0);
  const presentees = Number(data?.["Presentees"] || 0);
  const extra = Number(data?.["Extra Classes"] || 0);
  const attended = presentees + extra;

  const currentPercent = totalClasses > 0 ? (attended / totalClasses) * 100 : 0;

  const computeResult = () => {
    if (target === "" || !totalClasses) return null;
    const t = Number(target);
    const current = currentPercent;

    if (current >= t) {
      const canBunk = Math.floor((100 * attended) / t - totalClasses);
      return { mode: "bunk", count: canBunk >= 0 ? canBunk : 0 };
    }

    const ratio = t / 100;
    const rawNeed = ((ratio * totalClasses) - attended) / (1 - ratio);
    const needAttend = Math.ceil(rawNeed);
    const capTotal = String(label).toLowerCase().includes("eca") ? 16 : 400;
    const maxRemaining = capTotal - totalClasses;

    if (!isFinite(rawNeed)) return { mode: "unreachable", count: needAttend, maxRemaining };
    if (needAttend > maxRemaining) return { mode: "unreachable", count: needAttend, maxRemaining };

    return { mode: "attend", count: needAttend >= 0 ? needAttend : 0 };
  };

  const result = computeResult();

  return (
    <div className="bg-card border border-border rounded-md p-5 shadow-sm hover:shadow-md transition-all duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-base font-semibold text-foreground">{label}</h4>
        <span className="text-xs font-medium text-muted-foreground">
          {attended} / {totalClasses} Attended
        </span>
      </div>

      {/* Attendance Percentage */}
      <p className="text-sm text-muted-foreground mb-3">
        Current Attendance:{" "}
        <span
          className={`font-semibold ${
            currentPercent >= 85
              ? "text-emerald-600"
              : currentPercent >= 75
              ? "text-amber-600"
              : "text-rose-600"
          }`}
        >
          {currentPercent.toFixed(2)}%
        </span>
      </p>

      {/* Input Field */}
      <div className="flex items-center gap-3 mb-4">
        <input
          type="number"
          min={0}
          max={100}
          step={1}
          placeholder="Target %"
          value={target as any}
          onChange={(e) => {
            const v = e.target.value;
            if (v === "") {
              setTarget("");
              return;
            }
            const n = Number(v);
            if (Number.isNaN(n)) return;
            const clamped = Math.max(0, Math.min(100, Math.round(n)));
            setTarget(clamped);
          }}
          className="w-28 text-sm rounded-md border border-border px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
          title="Enter a percentage between 0 and 100"
        />
        <button
          onClick={() => setTarget("")}
          className="text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Result Message */}
      {result ? (
        result.mode === "bunk" ? (
          <div className="text-emerald-600 font-medium text-sm">
            ✅ You can bunk up to{" "}
            <span className="font-bold">{result.count}</span> class(es) and still stay above{" "}
            <span className="font-bold">{target}%</span>.
          </div>
        ) : result.mode === "unreachable" ? (
          <div className="text-rose-600 font-medium text-sm">
            ⚠️ Target not reachable — need{" "}
            <span className="font-bold">{result.count ?? "too many"}</span> more class(es),
            exceeding remaining sessions.
          </div>
        ) : result.count === Infinity ? (
          <div className="text-rose-600 font-medium text-sm">
            ⚠️ Target unattainable (100%).
          </div>
        ) : (
          <div className="text-blue-700 font-medium text-sm">
            📈 Attend{" "}
            <span className="font-bold text-blue-900">{result.count}</span> more class(es) to
            reach <span className="font-bold">{target}%</span>.
          </div>
        )
      ) : (
        <div className="text-sm text-muted-foreground">
          Enter a target percentage to calculate your plan.
        </div>
      )}
    </div>
  );
};

export default AttendanceTargetCard;
