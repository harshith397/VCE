import React, { useEffect, useState } from "react";
import { API_URL } from "@/config/api";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";


// =================== UTILITIES ===================

const getKeyInsensitive = (obj: any, key: string) => {
  if (!obj) return undefined;
  const foundKey = Object.keys(obj).find(
    (k) => k.toLowerCase() === key.toLowerCase()
  );
  return foundKey ? obj[foundKey] : undefined;
};

const normalizeData = (data: any) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (data.subjects && typeof data.subjects === "object")
    return Object.values(data.subjects);
  if (Array.isArray(data.data)) return data.data;
  if (typeof data === "object") return [data];
  return [];
};

const prettifyKey = (key: string): string => {
  if (!key) return "";
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
};

const getMaxMarks = (component: any): string | number | "-" => {
  if (!component || typeof component !== "object") return "-";
  const key = Object.keys(component).find((k) =>
    k.toLowerCase().includes("max_marks")
  );
  return key ? component[key] : "-";
};

const getComponentType = (component: any): string => {
  if (!component || typeof component !== "object") return "Component";
  const key = Object.keys(component).find((k) =>
    k.toLowerCase().includes("type")
  );
  return key ? component[key] : "Component";
};

// =================== RENDER HELPERS ===================

const renderTopics = (topics: string[] = []) => {
  if (!topics.length)
    return (
      <div className="text-sm text-muted-foreground">No topics listed.</div>
    );
  return (
    <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
      {topics.map((t, i) => (
        <li key={i}>{t}</li>
      ))}
    </ul>
  );
};

const renderSyllabusUnits = (syllabus: any) => {
  if (!syllabus || typeof syllabus !== "object")
    return (
      <div className="text-sm text-muted-foreground">No syllabus data.</div>
    );
  return (
    <Accordion type="multiple" className="w-full">
      {Object.entries(syllabus).map(([key, value]: [string, any]) => (
        <AccordionItem key={key} value={key}>
          <AccordionTrigger>
            {prettifyKey(key)}: {value?.name || ""}
          </AccordionTrigger>
          <AccordionContent>{renderTopics(value?.topics || [])}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

const renderListSection = (title: string, items: string[] = []) => {
  if (!Array.isArray(items) || items.length === 0) return null;
  return (
    <Card className="p-4 border border-primary/20 shadow-sm">
      <CardTitle className="text-base font-semibold mb-2 text-foreground">
        {prettifyKey(title)}
      </CardTitle>
      <ol className="list-decimal pl-5 text-sm space-y-1">
        {items.map((i, idx) => (
          <li key={idx}>{i}</li>
        ))}
      </ol>
    </Card>
  );
};

// =================== MAIN COMPONENT ===================

const SyllabusViewer: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [data, setData] = useState<any | null>(state?.syllabus ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any | null>(null);

  useEffect(() => {
    const subj = searchParams.get("subject_code");
    const sem = searchParams.get("semester");
    if (!data && subj && sem) {
      (async () => {
        setLoading(true);
        try {
          const params = new URLSearchParams();
          params.append("subject_code", String(subj));
          params.append("semester", String(sem));
          const deptParam = searchParams.get("dept");
          if (deptParam && deptParam.trim() !== "") params.append("dept", deptParam);

          const url = `${API_URL}/get_syllabus?${params.toString()}`;
          console.log("[SyllabusViewer] fetching syllabus URL:", url);
          const start = performance.now();
          let fetchError: any = null;
          let status: number | null = null;
          let rawText: string | null = null;
          let parsed: any = null;
          let parseError: any = null;
          try {
            const res = await fetch(url);
            status = res.status;
            rawText = await res.text();
            // Try parse once
            try {
              parsed = JSON.parse(rawText as string);
            } catch (e) {
              parseError = e;
              // If server returned a JSON string, try parsing that string again
              if (typeof rawText === "string") {
                try {
                  parsed = JSON.parse(rawText);
                } catch (e2) {
                  // still failed, leave parsed null
                  parseError = e2;
                }
              }
            }

            const duration = Math.round(performance.now() - start);
            const info = { url, status, duration, rawText, parsed, parseError };
            setDebugInfo(info);
            console.log("[SyllabusViewer] fetch result:", info);

            if (!res.ok) {
              throw new Error(`Server responded ${res.status}`);
            }

            setData(parsed);
          } catch (err: any) {
            fetchError = err;
            setDebugInfo((prev: any) => ({ ...(prev || {}), fetchError: String(err) }));
            throw err;
          }
        } catch (err: any) {
          setError(err?.message ?? String(err));
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [data, searchParams]);

  const subjects = normalizeData(data);

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <div className="mb-6">
          <Button
  onClick={() => navigate(-1)}
  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded border border-primary text-primary hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors"
>
  <ArrowLeft className="h-4 w-4" />
  Back
</Button>

        </div>

        {loading && (
          <div className="text-sm text-muted-foreground">Loading syllabus...</div>
        )}
        {error && <div className="text-sm text-red-500">Error: {error}</div>}
        {!loading && !subjects.length && (
          <div className="text-sm text-muted-foreground">No syllabus data found.</div>
        )}

        {/* Debug panel: visible when debugInfo exists (temporary) */}
        {debugInfo && (
          <div className="mt-4 p-3 rounded border border-dashed bg-muted/10 text-xs">
            <div className="font-medium mb-2">Fetch debug info</div>
            <div className="mb-1"><strong>URL:</strong> {debugInfo.url}</div>
            <div className="mb-1"><strong>Status:</strong> {String(debugInfo.status)}</div>
            <div className="mb-1"><strong>Duration:</strong> {String(debugInfo.duration)}ms</div>
            <div className="mb-2"><strong>Parsed JSON:</strong></div>
            <pre className="max-h-48 overflow-auto bg-white p-2 rounded text-xs">{JSON.stringify(debugInfo.parsed ?? null, null, 2)}</pre>
            <div className="mt-2"><strong>Raw response (first 2000 chars):</strong></div>
            <pre className="max-h-36 overflow-auto bg-white p-2 rounded text-xs">{String(debugInfo.rawText ?? "").slice(0, 2000)}</pre>
            {debugInfo.parseError && (
              <div className="mt-2 text-rose-500">Parse error: {String(debugInfo.parseError)}</div>
            )}
            {debugInfo.fetchError && (
              <div className="mt-2 text-rose-500">Fetch error: {String(debugInfo.fetchError)}</div>
            )}
          </div>
        )}

        {subjects.map((subject: any, idx) => {
          const name =
            subject.subject_name || subject.SubjectName || subject.name;
          const code =
            subject.subject_code || subject.SubjectCode || subject.code;
          const dept =
            subject.department || subject.Department || "Unknown Department";
          const sem = subject.semester || subject.Semester || "-";
          const category =
            subject.category || subject.Category || "Unspecified";
          const details = getKeyInsensitive(subject, "details") || subject;
          const credits = details.credits ?? details.Credits ?? "-";
          const hours = details.instruction_hours || {};

          return (
            <Card
              key={idx}
              className="mb-8 border border-blue-100 shadow-md shadow-blue-100/30 card-shadow"
            >
              <CardHeader className="pb-2 bg-blue-50 border-b border-blue-100 rounded-t-lg">
                <CardTitle className="text-xl font-semibold text-foreground">
                  {name}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {dept} • Semester {sem} • {prettifyKey(category)}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-4 bg-white rounded-b-lg">
                <div className="flex justify-between items-center flex-wrap gap-2 mb-6">
                  <div className="text-sm">
                    <span className="font-medium text-foreground">Subject Code:</span> {code}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-foreground">Credits:</span> {credits}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-foreground">Lecture:</span> {hours.lecture ?? 0}
                    {" | "}
                    <span className="font-medium text-foreground">Tutorial:</span> {hours.tutorial ?? 0}
                    {" | "}
                    <span className="font-medium text-foreground">Practical:</span> {hours.practical ?? 0}
                  </div>
                </div>

                {/* ------------------ TABS ------------------ */}
                <Tabs defaultValue="syllabus" className="w-full">
                  <TabsList
                    className="grid grid-cols-3 mb-4 rounded-md bg-muted/30 border border-border shadow-sm"
                  >
                    <TabsTrigger
                      value="syllabus"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-100 data-[state=active]:to-blue-200 
                                 data-[state=active]:text-blue-800 data-[state=active]:font-semibold 
                                 hover:bg-blue-50 transition-all duration-200"
                    >
                      Syllabus
                    </TabsTrigger>

                    <TabsTrigger
                      value="assessment"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-100 data-[state=active]:to-blue-200 
                                 data-[state=active]:text-blue-800 data-[state=active]:font-semibold 
                                 hover:bg-blue-50 transition-all duration-200"
                    >
                      Assessment
                    </TabsTrigger>

                    <TabsTrigger
                      value="resources"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-100 data-[state=active]:to-blue-200 
                                 data-[state=active]:text-blue-800 data-[state=active]:font-semibold 
                                 hover:bg-blue-50 transition-all duration-200"
                    >
                      Resources
                    </TabsTrigger>
                  </TabsList>

                  {/* --- SYLLABUS --- */}
                  <TabsContent value="syllabus">
                    {renderSyllabusUnits(
                      getKeyInsensitive(details, "syllabus") ||
                        getKeyInsensitive(details, "units")
                    )}
                  </TabsContent>

                  {/* --- ASSESSMENT --- */}
                  <TabsContent value="assessment">
                    {(() => {
                      const assessment =
                        getKeyInsensitive(details, "assessment");
                      if (!assessment)
                        return (
                          <div className="text-sm text-muted-foreground">
                            No assessment details.
                          </div>
                        );

                      const see =
                        getKeyInsensitive(
                          assessment,
                          "semester_end_examination"
                        ) || {};
                      const cie =
                        getKeyInsensitive(
                          assessment,
                          "continuous_internal_evaluation"
                        ) || {};

                      return (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Card className="p-4 border border-blue-100 shadow-sm">
                            <CardTitle className="text-base font-semibold mb-2 text-foreground">
                              {prettifyKey("semester_end_examination")}
                            </CardTitle>
                            <p className="text-sm">Duration: {see.duration ?? "-"}</p>
                            <p className="text-sm">Max Marks: {see.max_see_marks ?? "-"}</p>
                          </Card>

                          <Card className="p-4 border border-blue-100 shadow-sm">
                            <CardTitle className="text-base font-semibold mb-2 text-foreground">
                              {prettifyKey("continuous_internal_evaluation")}
                            </CardTitle>
                            {Array.isArray(cie.components) ? (
                              <table className="w-full text-sm">
                                <thead className="text-left border-b">
                                  <tr>
                                    <th>Type</th>
                                    <th>Count</th>
                                    <th>Max Marks</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {cie.components.map((c: any, i: number) => (
                                    <tr key={i} className="border-b">
                                      <td>{prettifyKey(getComponentType(c))}</td>
                                      <td>{c.count ?? "-"}</td>
                                      <td>{getMaxMarks(c)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            ) : (
                              <p className="text-sm text-muted-foreground">
                                No internal components listed.
                              </p>
                            )}
                          </Card>
                        </div>
                      );
                    })()}
                  </TabsContent>

                  {/* --- RESOURCES --- */}
                  <TabsContent value="resources">
                    {(() => {
                      const lr =
                        getKeyInsensitive(details, "learning_resources") ||
                        getKeyInsensitive(details, "resources");
                      if (!lr)
                        return (
                          <div className="text-sm text-muted-foreground">
                            No resources available.
                          </div>
                        );
                      if (Array.isArray(lr))
                        return renderListSection("General", lr);
                      return (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {Object.entries(lr).map(([k, v]) =>
                            renderListSection(k, v as string[])
                          )}
                        </div>
                      );
                    })()}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default SyllabusViewer;
