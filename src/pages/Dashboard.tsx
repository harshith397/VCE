import { GraduationCap, LogOut, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import SubjectAttendance from "@/components/SubjectAttendance";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { API_URL } from "@/config/api";
import defaultImage_male from "@/assets/Mahesh-Babu.jpg";
import defaultImage_female from "@/assets/Mrunal-Thakur.jpg"
import AttendanceOverviewCarousel from "@/components/AttendanceOverviewCarousel";

const fetchDashboard = async (sessionId: string) => {
  const res = await fetch(`${API_URL}/dashboard`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: sessionId }),
  });

  const data = await res.json();
  if (!res.ok || !data.dashboardData) {
    throw new Error(data.message || "Failed to load dashboard");
  }
  return data.dashboardData;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const sessionId = localStorage.getItem("session_id");

  if (!sessionId) {
    navigate("/");
  }

  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ["dashboard", sessionId],
    queryFn: () => fetchDashboard(sessionId!),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    if (dashboardData && sessionId) {
      queryClient.setQueryData(["dashboard", sessionId], dashboardData);
    }
  }, [dashboardData, sessionId, queryClient]);


  const { toast } = useToast();
  const [loggingOut, setLoggingOut] = useState(false);
  const asideRef = useRef<HTMLElement | null>(null);
  const [mobileDetailsOpen, setMobileDetailsOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  const studentImage = dashboardData?.["Student Image"];
  const hasValidImage = studentImage && studentImage.trim() !== "" && !imgError;
  // Choose default image based on reported gender in dashboard data.
  const genderStr = String(dashboardData?.["DashBoard"]?.Gender || "").trim().toLowerCase();
  const defaultImageChosen =
    genderStr === "f" || genderStr.includes("female") ? defaultImage_female : defaultImage_male;

  // Scroll behavior for sidebar
  useEffect(() => {
    const el = asideRef.current;
    if (!el) return;
    let timer: number | undefined;
    const onScroll = () => {
      el.classList.add("scrolling");
      if (timer) window.clearTimeout(timer);
      timer = window.setTimeout(() => el.classList.remove("scrolling"), 800);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      if (timer) window.clearTimeout(timer);
    };
  }, [asideRef.current]);

  const handleLogout = async () => {
    const sessionId = localStorage.getItem("session_id");

    if (!sessionId) {
      navigate("/");
      return;
    }

    if (loggingOut) return;
    setLoggingOut(true);

    try {
  const res = await fetch(`${API_URL}/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId }),
      });

      let payload: any = null;
      try {
        payload = await res.json();
      } catch {
        // ignore
      }

      const message = payload?.message || (res.ok ? "Logged out" : "Logout failed");
      const success = payload?.success ?? res.ok;

      toast({
        title: success ? "Logged out" : "Logout",
        description: message,
        variant: success ? undefined : "destructive",
      });
    } catch (err) {
      console.error("Logout request failed:", err);
      toast({
        title: "Logout error",
        description: String(err),
        variant: "destructive",
      });
    } finally {
      localStorage.removeItem("session_id");
      setLoggingOut(false);
      navigate("/");
    }
  };

  const handleOpenMarksPage = () => {
    if (!dashboardData?.["Marks Data"]) return;
    navigate("/marks", { state: { marksData: dashboardData["Marks Data"] } });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center space-y-4 animate-fade-in">
          <GraduationCap className="h-10 w-10 mx-auto text-primary animate-bounce" />
          <p className="text-lg font-medium text-foreground animate-pulse">
            Fetching your dashboard...
          </p>
          <div className="flex justify-center">
            <div className="h-4 w-4 bg-primary rounded-full animate-ping"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-red-500">Failed to load dashboard. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden pt-16 lg:pt-20">
      {/* ===== Navbar ===== */}
      <header className="fixed top-0 left-0 right-0 w-full bg-card border-b border-border z-20 shadow-md">
        <div className="container mx-auto px-3 py-1.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            <h1 className="text-xs sm:text-sm font-semibold text-foreground">
              Student Portal
            </h1>
          </div>

          <div className="flex items-center gap-1">
            {/* Pay Fee */}
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-7 px-2 sm:px-2.5 text-xs rounded-sm border border-primary text-primary hover:bg-primary/10 transition-colors"
              title="Exam Fee Payment"
            >
              <a
                href="https://erp.vce.ac.in/OnlineEaf/Automation/ExamBranch/ExamBranchProcess/StudentWiseEAFProcessNew/StudentLoginFormForEAFNew.aspx"
                target="_blank"
                rel="noopener noreferrer"
              >
                Pay Fee
              </a>
            </Button>

            {/* Marks */}
            {dashboardData?.["Marks Data"] ? (
              <Button
                onClick={handleOpenMarksPage}
                variant="outline"
                size="sm"
                className="h-7 px-2 sm:px-2.5 text-xs rounded-sm border border-primary text-primary hover:bg-primary/10 transition-colors"
                title="View detailed marks report"
              >
                Marks
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                disabled
                className="h-7 px-2 sm:px-2.5 text-xs rounded-sm opacity-60"
                title="Marks not available"
              >
                Marks
              </Button>
            )}

            {/* Logout */}
            <Button
              onClick={handleLogout}
              disabled={loggingOut}
              size="sm"
              className="h-7 px-2 sm:px-2.5 text-xs rounded-sm border border-primary text-primary hover:bg-primary/10 transition-colors"
            >
              {loggingOut ? (
                <span className="flex items-center gap-1.5">
                  <Spinner size="sm" />
                  Logging out...
                </span>
              ) : (
                "Logout"
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* ===== Sidebar (Profile) ===== */}
      {dashboardData && (
        <>
          <aside
            ref={asideRef}
            className="hidden lg:block fixed left-4 top-16 w-64 bottom-6 profile-scroll"
          >
            <div className="bg-card border border-border rounded-xl p-4 shadow-md">
              <div className="flex flex-col items-center">
                <div className="rounded-full p-1 ring-2 ring-primary/70 ring-offset-white inline-block">
                  <div className="w-20 h-20 rounded-full overflow-hidden">
                    <img
                      src={hasValidImage ? studentImage : defaultImageChosen}
                      alt={dashboardData["DashBoard"]?.Name || "Student"}
                      className="w-20 h-20 object-cover"
                      onError={() => setImgError(true)}
                    />
                  </div>
                </div>
                <div className="mt-3 text-center">
                  <p className="text-sm text-muted-foreground">Welcome back,</p>
                  <h2 className="text-base font-bold text-foreground">
                    {dashboardData["DashBoard"]?.Name}
                  </h2>
                </div>

                <div className="mt-4 w-full text-sm text-left text-muted-foreground">
                  {Object.entries(dashboardData["DashBoard"] || {})
                    .filter(([k]) => k !== "Name")
                    .map(([k, v]) => (
                      <div key={k} className="py-1">
                        <div className="text-xs font-medium text-muted-foreground">
                          {k}
                        </div>
                        <div className="text-sm font-semibold text-foreground">
                          {String(v)}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </aside>

          {/* ===== Mobile Profile Card ===== */}
          <div className="lg:hidden container mx-auto px-4 py-4 mt-6">
            <div className="bg-card border border-border rounded-xl p-4 shadow-md">
              <div className="flex items-center gap-4">
                <div className="rounded-full p-1 ring-2 ring-primary/70 inline-block">
                  <div className="w-14 h-14 rounded-full overflow-hidden">
                    <img
                      src={hasValidImage ? studentImage : defaultImageChosen}
                      alt={dashboardData["DashBoard"]?.Name || "Student"}
                      className="w-14 h-14 object-cover"
                      onError={() => setImgError(true)}
                    />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Welcome back,</p>
                  <h2 className="text-base font-bold text-foreground">
                    {dashboardData["DashBoard"]?.Name}
                  </h2>
                </div>
              </div>

              <div className="mt-3">
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => setMobileDetailsOpen((s) => !s)}
                    aria-expanded={mobileDetailsOpen}
                    className="inline-flex items-center gap-2 px-3 py-1 text-sm rounded-sm border border-primary text-primary hover:bg-primary/10 transition-colors"
                  >
                    {mobileDetailsOpen ? "Hide details" : "Show details"}
                  </button>
                </div>

                <div
                  className={`${
                    mobileDetailsOpen ? "block" : "hidden"
                  } mt-3 grid grid-cols-1 gap-2 text-sm text-muted-foreground`}
                >
                  {Object.entries(dashboardData["DashBoard"] || {})
                    .filter(([k]) => k !== "Name")
                    .map(([k, v]) => (
                      <div key={k} className="flex justify-between">
                        <span className="font-medium text-xs">{k}</span>
                        <span className="font-semibold text-foreground ml-4">
                          {String(v)}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ===== Main Content ===== */}
      <main className="container mx-auto px-4 py-6 space-y-6 lg:pl-72">
  <AttendanceOverviewCarousel data={dashboardData["Total Attendance Data"]} />

  <SubjectAttendance
    data={dashboardData["Subjects Attendance Data"]}
    currentSem={dashboardData["Current Sem"]?.["Sem."]}
  />
</main>
    </div>
  );
};

export default Dashboard;
