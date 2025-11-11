import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Card className="p-6 sm:p-8 card-shadow">
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <GraduationCap className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">Welcome</h1>
            </div>

            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
              Choose an option to continue.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <Button
                onClick={() => navigate('/login')}
                className="w-full h-auto py-4 sm:py-5 px-4 text-sm sm:text-base font-medium"
              >
                Attendance Portal
              </Button>

              <Button 
                asChild
                className="w-full h-auto py-4 sm:py-5 px-4 text-sm sm:text-base font-medium"
              >
                <a
                  href="https://erp.vce.ac.in/OnlineEaf/Automation/ExamBranch/ExamBranchProcess/StudentWiseEAFProcessNew/StudentLoginFormForEAFNew.aspx"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Exam Fee Payment
                </a>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;