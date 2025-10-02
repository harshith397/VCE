import { Card } from "@/components/ui/card";
import studentIllustration from "@/assets/student_photo.jpg";

const StudentInfoCard = () => {
  const studentInfo = {
    Name: "MEDICHELME HARSHITH",
    "Hall Ticket No.": "1602-24-733-014",
    "Father Name": "MEDICHELME RAJASHEKAR",
    "Date of Birth": "24-Jul-2006",
    Branch: "BE - Computer Science and Engineering",
    Year: "2",
    Semester: "3",
    Section: "A",
    "Admission Date": "09-Sep-2024",
    "Current Status": "Studying",
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <img
            src={studentIllustration}
            className="h-auto w-auto text-primary rounded-full"
            alt="User"
          />
        </div>
        <div>
          {/* 👇 Use the Name field here */}
          <h2 className="text-2xl font-bold text-foreground">
            {studentInfo.Name}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(studentInfo)
          // 👇 filter out Name so it doesn’t repeat in the grid
          .filter(([key]) => key !== "Name")
          .map(([key, value]) => (
            <div key={key} className="flex flex-col space-y-1">
              <span className="text-sm font-medium text-muted-foreground">
                {key}
              </span>
              <span className="text-base font-semibold text-foreground">
                {value}
              </span>
            </div>
          ))}
      </div>
    </Card>
  );
};

export default StudentInfoCard;