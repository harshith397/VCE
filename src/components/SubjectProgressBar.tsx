import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { API_URL } from "@/config/api";

interface SubjectProgressBarProps {
  subject: string;
  presentees: number;
  held: number;
  percentage: number;
  isLoading: boolean;
  semester?: number | string;
}

const SubjectProgressBar = ({
  subject,
  presentees,
  held,
  percentage,
  isLoading,
  semester,
}: SubjectProgressBarProps) => {
  const [animatedWidth, setAnimatedWidth] = useState(0);
  const [syllabusData, setSyllabusData] = useState<any | null>(null);
  const [syllabusLoading, setSyllabusLoading] = useState(false);
  const [syllabusError, setSyllabusError] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => setAnimatedWidth(percentage), 200);
      return () => clearTimeout(timer);
    }
  }, [isLoading, percentage]);

  const getGradient = (percent: number) => {
    if (percent > 85)
      return "from-emerald-400 via-green-500 to-emerald-600";
    if (percent >= 75)
      return "from-amber-400 via-yellow-500 to-orange-500";
    return "from-rose-500 via-red-500 to-pink-600";
  };

  const getTextColorClass = (percent: number) => {
    if (percent > 85) return "text-emerald-500";
    if (percent >= 75) return "text-amber-500";
    return "text-rose-500";
  };

  return (
    <div className="w-full py-4 border-b border-border last:border-b-0">
      {/* Main row: Responsive layout */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
        {/* Subject name */}
        <div className="font-semibold text-foreground text-base sm:text-sm sm:min-w-[140px]">
          {subject}:
        </div>

        {/* Percentage, Progress bar, and Button container */}
        <div className="flex items-center gap-2 sm:gap-3 flex-1">
          {/* Percentage */}
          <span className={`font-bold text-base sm:text-sm ${getTextColorClass(percentage)} w-16 sm:w-[65px] text-right flex-shrink-0`}>
            {percentage.toFixed(2)}%
          </span>

          {/* Progress bar - responsive width */}
          <div className="relative h-3 sm:h-2.5 bg-muted/40 rounded-full overflow-hidden flex-1 min-w-0">
            {isLoading ? (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-[shimmer_1.5s_ease-in-out_infinite]" />
            ) : (
              <div
                className={`h-full bg-gradient-to-r ${getGradient(
                  percentage
                )} transition-all duration-1000 ease-out rounded-full`}
                style={{ width: `${animatedWidth}%` }}
              />
            )}
          </div>

          {/* Syllabus button */}
          <button
            type="button"
            className="px-3 py-1.5 sm:py-1 text-sm rounded border border-primary text-primary hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors whitespace-nowrap flex-shrink-0"
            onClick={async () => {
              let semesterVal: number | null = null;
              if (semester !== undefined && semester !== null) {
                semesterVal = typeof semester === "number" ? semester : parseInt(String(semester), 10) || null;
              }
              if (semesterVal === null) {
                let semesterStr = null;
                try {
                  semesterStr = localStorage.getItem("semester") ?? localStorage.getItem("currentSemester") ?? localStorage.getItem("current_semester");
                } catch (e) {
                  // ignore
                }
                semesterVal = semesterStr ? parseInt(semesterStr, 10) || null : null;
              }
              const semesterToUse = semesterVal ?? 1;

              setSyllabusLoading(true);
              setSyllabusError(null);
              setSyllabusData(null);
              try {
                  // Try to extract department (dept) from in-memory/React Query cache first (same key used in Dashboard)
                  // Fallback to localStorage parsing if cache is not available.
                  let deptVal: string | null = null;
                  try {
                    const sessionId = localStorage.getItem("session_id");
                    const cached = sessionId
                      ? queryClient.getQueryData(["dashboard", sessionId])
                      : queryClient.getQueryData(["dashboard"] as any);
                    if (cached) {
                      deptVal = (cached as any)?.["DashBoard"]?.["Branch"] ?? (cached as any)?.DashBoard?.Branch ?? null;
                    }
                  } catch (e) {
                    // ignore
                  }

                  // If not in cache, try stored dashboard JSON in localStorage (older code paths)
                  if (!deptVal) {
                    try {
                      const dashStr =
                        localStorage.getItem("dashboardData") ??
                        localStorage.getItem("dashboard_data") ??
                        localStorage.getItem("dashboard");
                      if (dashStr) {
                        const parsed = JSON.parse(dashStr);
                        deptVal = parsed?.DashBoard?.Branch ?? parsed?.dashBoard?.Branch ?? null;
                      }
                    } catch (e) {
                      // ignore JSON parse errors / access errors
                    }
                  }

                  // fallback to direct keys if present
                  if (!deptVal) {
                    try {
                      deptVal = localStorage.getItem("Branch") ?? localStorage.getItem("branch") ?? null;
                    } catch (e) {
                      // ignore
                    }
                  }

                  const deptToUse = deptVal ?? "";

                  const params = new URLSearchParams();
                  params.append("semester", String(semesterToUse));
                  params.append("subject_code", subject);
                  // Only append dept when we actually have a non-empty value.
                  if (deptToUse && String(deptToUse).trim() !== "") {
                    params.append("dept", String(deptToUse));
                  }

                  const url = `${API_URL}/get_syllabus?${params.toString()}`;
                  // Better logging: use console.log so it's visible even if debug is filtered
                  console.log("[SubjectProgressBar] fetching syllabus URL:", url);
                  // Save to window for quick inspection in devtools
                  try {
                    (window as any).__lastSyllabusRequest = { url, time: new Date().toISOString() };
                  } catch (e) {
                    // ignore in non-browser or restricted environments
                  }
                  // Fetch and robustly parse possible double-encoded JSON responses.
                  const res = await fetch(url);
                  const raw = await res.text();
                  let parsed: any = null;
                  try {
                    parsed = JSON.parse(raw);
                  } catch (e) {
                    // not JSON, leave as raw
                    parsed = raw;
                  }
                  // If parsing produced a string (double-encoded JSON), try parse again
                  if (typeof parsed === "string") {
                    try {
                      parsed = JSON.parse(parsed);
                    } catch (e) {
                      // leave parsed as string
                    }
                  }

                  console.log("[SubjectProgressBar] fetch status:", res.status, "parsed:", parsed);
                  // Save raw and parsed to window for debugging
                  try {
                    (window as any).__lastSyllabusRequest = { url, time: new Date().toISOString(), status: res.status, raw, parsed };
                  } catch (e) {}

                  if (!res.ok) throw new Error(`Server responded ${res.status}`);
                  setSyllabusData(parsed);
                  // Navigate to the dedicated syllabus viewer and pass the parsed data via location state
                  try {
                    navigate('/syllabus/view', { state: { syllabus: parsed } });
                  } catch (e) {
                    console.error('Navigation to syllabus viewer failed', e);
                  }
              } catch (err: any) {
                setSyllabusError(err?.message ?? String(err));
              } finally {
                setSyllabusLoading(false);
              }
            }}
            aria-label={`Fetch syllabus for ${subject}`}
          >
            {syllabusLoading ? "Loading..." : "Syllabus"}
          </button>
        </div>
      </div>

      {/* Second row: Present and Total counts */}
      <div className="text-xs text-muted-foreground pl-0 sm:pl-1">
        Present: <span className="font-semibold text-foreground">{presentees}</span>
        <span className="ml-4">Total: <span className="font-semibold text-foreground">{held}</span></span>
      </div>

      {/* Error and data display */}
      {syllabusError && (
        <div className="mt-2 text-sm text-rose-400">Error: {syllabusError}</div>
      )}
      {syllabusData && (
        <pre className="mt-2 p-2 rounded bg-muted/60 text-xs overflow-x-auto max-h-40">
          {JSON.stringify(syllabusData, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default SubjectProgressBar;