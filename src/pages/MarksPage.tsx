import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const MarksPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const marksData = location.state?.marksData;

  if (!marksData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center text-lg text-muted-foreground space-y-4">
        <p>No marks data available.</p>
        <Button onClick={() => navigate("/dashboard")}>Go Back</Button>
      </div>
    );
  }

  const { subjects, summary } = marksData;

  // Determine all unique component columns across all subjects
  const getUniqueComponents = (type: string) => {
    const components = new Set<string>();
    subjects.forEach((subject: any) => {
      subject.components[type]?.forEach((comp: any) => {
        components.add(comp.name);
      });
    });
    return Array.from(components).sort();
  };

  const internalCols = getUniqueComponents('internal');
  const assignmentCols = getUniqueComponents('assignment');
  const quizCols = getUniqueComponents('quiz');
  const sessionalCols = getUniqueComponents('sessional');

  // Helper to get component value
  const getComponentValue = (subject: any, type: string, name: string) => {
    const comp = subject.components[type]?.find((c: any) => c.name === name);
    return comp ? `${comp.secured}/${comp.max}` : '-';
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Back button (top-left). Full width on small screens, auto on larger screens */}
      <div className="mb-4 flex justify-start">
        <Button
          onClick={() => navigate("/dashboard")}
          variant="outline"
          size="sm"
          className="w-auto px-3"
          aria-label="Dashbard"
        >
          Dashbard
        </Button>
      </div>

      {/* Marks Table */}
      <Card className="overflow-x-auto border shadow-md card-shadow">
  <table className="w-full text-[11px] border-collapse">
          <thead>
            <tr className="bg-primary text-white text-center">
              <th className="border border-gray-300 px-1 py-0.5 font-semibold whitespace-nowrap w-10 sticky left-0 z-30 bg-primary text-white">
                S.No
              </th>
              <th className="border border-gray-300 px-1 py-0.5 font-semibold whitespace-nowrap w-32 sticky left-[40px] z-30 bg-primary text-white text-left">
                Subject
              </th>
              
              {/* Internal columns */}
              {internalCols.map((col) => (
                <th key={col} className="border border-gray-300 px-1 py-0.5 font-semibold whitespace-nowrap">
                  {col}
                </th>
              ))}
              
              {/* Assignment columns */}
              {assignmentCols.map((col) => (
                <th key={col} className="border border-gray-300 px-1 py-0.5 font-semibold whitespace-nowrap">
                  {col}
                </th>
              ))}
              
              {/* Quiz columns */}
              {quizCols.map((col) => (
                <th key={col} className="border border-gray-300 px-1 py-0.5 font-semibold whitespace-nowrap">
                  {col}
                </th>
              ))}
              
              {/* Sessional columns */}
              {sessionalCols.map((col) => (
                <th key={col} className="border border-gray-300 px-1 py-0.5 font-semibold whitespace-nowrap">
                  {col}
                </th>
              ))}
              
              <th className="border border-gray-300 px-1 py-0.5 font-semibold whitespace-nowrap">
                External
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Subject Rows */}
            {subjects &&
              subjects.map((subject: any, idx: number) => (
                <tr
                  key={idx}
                  className={`text-center ${idx % 2 === 0 ? "bg-white" : "bg-muted/30"} hover:bg-muted/50`}
                >
                  <td className="border border-gray-300 px-1 py-0.5 whitespace-nowrap w-10 sticky left-0 z-20 bg-white border-r">
                    {subject.s_no}
                  </td>
                  <td className="border border-gray-300 px-1 py-0.5 font-medium whitespace-nowrap w-32 sticky left-[40px] z-20 bg-white border-r text-left">
                    {subject.name}
                  </td>
                  
                  {/* Internal values */}
                  {internalCols.map((col) => (
                    <td key={col} className="border border-gray-300 px-1 py-0.5 whitespace-nowrap">
                      {getComponentValue(subject, 'internal', col)}
                    </td>
                  ))}
                  
                  {/* Assignment values */}
                  {assignmentCols.map((col) => (
                    <td key={col} className="border border-gray-300 px-1 py-0.5 whitespace-nowrap">
                      {getComponentValue(subject, 'assignment', col)}
                    </td>
                  ))}
                  
                  {/* Quiz values */}
                  {quizCols.map((col) => (
                    <td key={col} className="border border-gray-300 px-1 py-0.5 whitespace-nowrap">
                      {getComponentValue(subject, 'quiz', col)}
                    </td>
                  ))}
                  
                  {/* Sessional values */}
                  {sessionalCols.map((col) => (
                    <td key={col} className="border border-gray-300 px-1 py-0.5 whitespace-nowrap">
                      {getComponentValue(subject, 'sessional', col)}
                    </td>
                  ))}
                  
                  <td className="border border-gray-300 px-1 py-0.5 whitespace-nowrap">
                    {subject.grade !== '-' ? `${subject.grade} (${subject.grade_points})` : '-'}
                  </td>
                </tr>
              ))}
              
            {/* Total Row */}
            <tr className="bg-muted/70 font-semibold text-center">
              <td className="border border-gray-300 px-1 py-0.5 whitespace-nowrap w-10 sticky left-0 z-20 bg-white border-r">&nbsp;</td>
              <td className="border border-gray-300 px-1 py-0.5 whitespace-nowrap w-32 sticky left-[40px] z-20 bg-white border-r text-left">Total</td>
              
              {/* Internal totals */}
              {internalCols.map((col) => {
                const total = summary?.total_marks?.[col.toLowerCase()];
                return (
                  <td key={col} className="border border-gray-300 px-1 py-0.5 whitespace-nowrap">
                    {total ? `${total.secured}/${total.max}` : '-'}
                  </td>
                );
              })}
              
              {/* Assignment totals */}
              {assignmentCols.map((col) => {
                const total = summary?.total_marks?.[col.toLowerCase()];
                return (
                  <td key={col} className="border border-gray-300 px-1 py-0.5 whitespace-nowrap">
                    {total ? `${total.secured}/${total.max}` : '-'}
                  </td>
                );
              })}
              
              {/* Quiz totals */}
              {quizCols.map((col) => {
                const total = summary?.total_marks?.[col.toLowerCase()];
                return (
                  <td key={col} className="border border-gray-300 px-1 py-0.5 whitespace-nowrap">
                    {total ? `${total.secured}/${total.max}` : '-'}
                  </td>
                );
              })}
              
              {/* Sessional totals */}
              {sessionalCols.map((col) => {
                const total = summary?.total_marks?.[col.toLowerCase()];
                return (
                  <td key={col} className="border border-gray-300 px-1 py-0.5 whitespace-nowrap">
                    {total ? `${total.secured}/${total.max}` : '-'}
                  </td>
                );
              })}
              
              <td className="border border-gray-300 px-1 py-0.5 whitespace-nowrap">-</td>
            </tr>
            
            {/* Percentage Row */}
            <tr className="bg-muted font-medium text-center">
              <td className="border border-gray-300 px-1 py-0.5 whitespace-nowrap w-10 sticky left-0 z-20 bg-white border-r">&nbsp;</td>
              <td className="border border-gray-300 px-1 py-0.5 whitespace-nowrap w-32 sticky left-[40px] z-20 bg-white border-r text-left">Percentage</td>
              
              {/* Internal percentages */}
              {internalCols.map((col) => {
                const total = summary?.total_marks?.[col.toLowerCase()];
                return (
                  <td key={col} className="border border-gray-300 px-1 py-0.5 whitespace-nowrap">
                    {total?.percentage !== null && total?.percentage !== undefined
                      ? `${typeof total.percentage === 'number' ? total.percentage.toFixed(2) : total.percentage}%`
                      : '-'}
                  </td>
                );
              })}
              
              {/* Assignment percentages */}
              {assignmentCols.map((col) => {
                const total = summary?.total_marks?.[col.toLowerCase()];
                return (
                  <td key={col} className="border border-gray-300 px-1 py-0.5 whitespace-nowrap">
                    {total?.percentage !== null && total?.percentage !== undefined
                      ? `${typeof total.percentage === 'number' ? total.percentage.toFixed(2) : total.percentage}%`
                      : '-'}
                  </td>
                );
              })}
              
              {/* Quiz percentages */}
              {quizCols.map((col) => {
                const total = summary?.total_marks?.[col.toLowerCase()];
                return (
                  <td key={col} className="border border-gray-300 px-1 py-0.5 whitespace-nowrap">
                    {total?.percentage !== null && total?.percentage !== undefined
                      ? `${typeof total.percentage === 'number' ? total.percentage.toFixed(2) : total.percentage}%`
                      : '-'}
                  </td>
                );
              })}
              
              {/* Sessional percentages */}
              {sessionalCols.map((col) => {
                const total = summary?.total_marks?.[col.toLowerCase()];
                return (
                  <td key={col} className="border border-gray-300 px-1 py-0.5 whitespace-nowrap">
                    {total?.percentage !== null && total?.percentage !== undefined
                      ? `${typeof total.percentage === 'number' ? total.percentage.toFixed(2) : total.percentage}%`
                      : '-'}
                  </td>
                );
              })}
              
              <td className="border border-gray-300 px-1 py-0.5 whitespace-nowrap">
                {summary?.sgpa || '-'}
              </td>
            </tr>
          </tbody>
        </table>
      </Card>

      
    </div>
  );
};

export default MarksPage;