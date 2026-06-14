import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ServerUrl } from "../App";
import Step3Report from "../components/Step3Report";
function InterviewReport() {
  const { id } = useParams();
  const [report, setReport] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get(
          ServerUrl + "/api/interview/report/" + id,
          { withCredentials: true }, // ✅ fix: was "withCredential" (missing 's')
        );
        console.log(response.data);
        setReport(response.data); // ✅ fix: was "result.data" (undefined variable)
      } catch (err) {
        console.log(err);
      }
    };

    fetchReport();
  }, [id]); // ✅ fix: missing dependency array — was re-fetching on every render

  if (!report) {
    // ✅ fix: condition was inverted — showed loading when report existed
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#07090f" }}
      >
        <p style={{ color: "#5a5f72", fontFamily: "'Lato', sans-serif" }}>
          Loading Report...
        </p>
      </div>
    );
  }

  return <Step3Report report={report} />;
}

export default InterviewReport;
