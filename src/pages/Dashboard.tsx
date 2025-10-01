import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GraduationCap, LogOut } from "lucide-react";
import StudentInfoCard from "@/components/StudentInfoCard";
import AttendanceOverview from "@/components/AttendanceOverview";
import SubjectAttendance from "@/components/SubjectAttendance";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Vasavi College of Engineering
              </h1>
              <p className="text-sm text-muted-foreground">Student Portal</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Student Information */}
        <StudentInfoCard />

        {/* Attendance Overview */}
        <AttendanceOverview />

        {/* Subject-wise Attendance */}
        <SubjectAttendance />
      </main>
    </div>
  );
};

export default Dashboard;
