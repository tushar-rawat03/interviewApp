import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { FaArrowLeft, FaDownload } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function Step3Report({ report }) {
  const navigate = useNavigate();

  if (!report) {
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

  const {
    finalScore = 0,
    confidence = 0,
    communication = 0,
    correctness = 0,
    questionWiseScore = [],
  } = report;

  const questionScoreData = questionWiseScore.map((q, index) => ({
    name: `Q${index + 1}`,
    score: q.score || 0,
  }));

  const skills = [
    { label: "Confidence", value: confidence },
    { label: "Communication", value: communication },
    { label: "Correctness", value: correctness },
  ];

  let performanceText = "";
  let shortTagline = "";
  if (finalScore >= 8) {
    performanceText = "Ready for job opportunities.";
    shortTagline = "Excellent clarity and structured responses.";
  } else if (finalScore > 5) {
    performanceText = "Needs minor improvement before interviews.";
    shortTagline = "Good foundation, refine articulation.";
  } else {
    performanceText = "Significant improvement required.";
    shortTagline = "Work on clarity and confidence.";
  }

  const percentage = (finalScore / 10) * 100;

  const downloadPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    let currentY = 25;

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(34, 197, 94);
    doc.text("AI Interview Performance Report", pageWidth / 2, currentY, {
      align: "center",
    });
    currentY += 5;
    doc.setDrawColor(34, 197, 94);
    doc.line(margin, currentY + 2, pageWidth - margin, currentY + 2);
    currentY += 15;

    // Final score box
    doc.setFillColor(240, 253, 244);
    doc.roundedRect(margin, currentY, contentWidth, 20, 4, 4, "F");
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`Final Score: ${finalScore}/10`, pageWidth / 2, currentY + 12, {
      align: "center",
    });
    currentY += 30;

    // Skills box
    doc.setFillColor(249, 250, 251);
    doc.roundedRect(margin, currentY, contentWidth, 30, 4, 4, "F");
    doc.setFontSize(12);
    doc.text(`Confidence: ${confidence}`, margin + 10, currentY + 10);
    doc.text(`Communication: ${communication}`, margin + 10, currentY + 18);
    doc.text(`Correctness: ${correctness}`, margin + 10, currentY + 26);
    currentY += 45;

    // Advice box
    let advice = "";
    if (finalScore > 8) {
      advice =
        "Excellent performance. Maintain confidence and structure. Continue refining clarity and supporting answers with strong real-world examples.";
    } else if (finalScore >= 5) {
      advice =
        "Good foundation shown. Improve clarity and structure. Practice delivering concise, confident answers with stronger supporting examples.";
    } else {
      advice =
        "Significant improvement required. Focus on structured thinking, clarity, and confident delivery. Practice answering aloud.";
    }

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(220);
    doc.roundedRect(margin, currentY, contentWidth, 35, 4, 4);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Professional Advice", margin + 10, currentY + 10);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const splitAdvice = doc.splitTextToSize(advice, contentWidth - 20);
    doc.text(splitAdvice, margin + 10, currentY + 20);
    currentY += 50;

    // Question table
    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [["#", "Question", "Score", "Feedback"]],
      body: questionWiseScore.map((q, i) => [
        `${i + 1}`,
        q.question || "N/A",
        `${q.score ?? 0}/10`,
        q.feedback || "No feedback",
      ]),
      styles: { fontSize: 9, cellPadding: 5, valign: "top" },
      headStyles: {
        fillColor: [34, 197, 94],
        textColor: 255,
        halign: "center",
      },
      columnStyles: {
        0: { cellWidth: 10, halign: "center" },
        1: { cellWidth: 55 },
        2: { cellWidth: 20, halign: "center" },
        3: { cellWidth: "auto" },
      },
      alternateRowStyles: { fillColor: [249, 250, 251] },
    });

    doc.save("AI_Interview_Report.pdf");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Lato:wght@300;400&display=swap');

        @keyframes s3Pulse {
          0%,100% { opacity: .12; transform: scale(1); }
          50%      { opacity: .22; transform: scale(1.07); }
        }
        @keyframes s3FadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .s3-root {
          min-height: 100vh;
          background: #07090f;
          padding: 40px 16px;
          font-family: 'Syne', sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        .s3-blob {
          position: fixed;
          border-radius: 50%;
          filter: blur(100px);
          pointer-events: none;
          animation: s3Pulse 7s ease-in-out infinite;
        }

        .s3-container {
          max-width: 1100px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .s3-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 36px;
        }

        .s3-back-btn {
          width: 44px; height: 44px;
          border-radius: 14px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: #9ea3b8;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: background .2s, border-color .2s, color .2s;
        }
        .s3-back-btn:hover {
          background: rgba(200,241,53,0.08);
          border-color: rgba(200,241,53,0.25);
          color: #c8f135;
        }

        .s3-title {
          font-weight: 800; font-size: 1.7rem;
          letter-spacing: -.02em; color: #e8eaf0;
          margin: 0 0 6px;
        }
        .s3-subtitle {
          font-family: 'Lato', sans-serif;
          font-size: .88rem; color: #5a5f72;
          margin: 0;
        }

        .s3-download-btn {
          display: flex; align-items: center; gap: 8px;
          background: #c8f135; color: #07090f;
          border: none; border-radius: 14px;
          padding: 12px 22px;
          font-family: 'Syne', sans-serif;
          font-weight: 700; font-size: .88rem;
          cursor: pointer;
          transition: transform .2s, box-shadow .2s;
          white-space: nowrap;
          align-self: center;
        }
        .s3-download-btn:hover {
          transform: scale(1.02);
          box-shadow: 0 0 24px rgba(200,241,53,0.3);
        }

        .s3-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }
        @media (min-width: 1024px) {
          .s3-grid { grid-template-columns: 320px 1fr; }
        }

        .s3-card {
          background: linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015));
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 24px;
          padding: 28px;
          animation: s3FadeUp .4s ease-out;
        }

        .s3-card-title {
          font-weight: 700; font-size: .88rem;
          letter-spacing: .08em; text-transform: uppercase;
          color: #5a5f72;
          margin: 0 0 20px;
        }

        .s3-skill-label {
          font-family: 'Syne', sans-serif;
          font-size: .88rem; color: #9ea3b8;
        }
        .s3-skill-value {
          font-weight: 700; color: #c8f135;
          font-size: .88rem;
        }
        .s3-skill-track {
          background: rgba(255,255,255,0.06);
          border-radius: 999px;
          height: 6px;
          margin-top: 8px;
          margin-bottom: 18px;
          overflow: hidden;
        }
        .s3-skill-fill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, #c8f135, #78a80d);
          transition: width .6s ease;
        }

        .s3-q-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 18px;
          padding: 20px;
          margin-bottom: 16px;
        }
        .s3-q-meta {
          font-size: .72rem; font-weight: 700;
          letter-spacing: .1em; text-transform: uppercase;
          color: #c8f135; margin: 0 0 8px;
        }
        .s3-q-text {
          font-family: 'Lato', sans-serif;
          font-size: .95rem; color: #e8eaf0;
          line-height: 1.6; margin: 0 0 14px;
        }
        .s3-q-score {
          display: inline-block;
          background: rgba(200,241,53,0.1);
          border: 1px solid rgba(200,241,53,0.25);
          color: #c8f135;
          font-weight: 700; font-size: .8rem;
          padding: 4px 12px; border-radius: 999px;
          margin-bottom: 14px;
        }
        .s3-feedback-box {
          background: rgba(200,241,53,0.04);
          border: 1px solid rgba(200,241,53,0.12);
          border-radius: 12px;
          padding: 14px;
        }
        .s3-feedback-label {
          font-size: .7rem; font-weight: 700;
          letter-spacing: .1em; text-transform: uppercase;
          color: #c8f135; margin: 0 0 6px;
        }
        .s3-feedback-text {
          font-family: 'Lato', sans-serif;
          font-size: .88rem; color: #9ea3b8;
          line-height: 1.65; margin: 0;
        }

        .s3-perf-text {
          font-family: 'Syne', sans-serif;
          font-weight: 700; font-size: .95rem;
          color: #e8eaf0; margin: 0 0 6px;
        }
        .s3-perf-sub {
          font-family: 'Lato', sans-serif;
          font-size: .82rem; color: #5a5f72;
          margin: 0;
        }
      `}</style>

      {/* Background blobs */}
      <div
        className="s3-blob"
        style={{
          width: 500,
          height: 500,
          background: "#c8f135",
          top: "-15%",
          left: "-10%",
          opacity: 0.1,
        }}
      />
      <div
        className="s3-blob"
        style={{
          width: 300,
          height: 300,
          background: "#c8f135",
          bottom: "5%",
          right: "0%",
          opacity: 0.07,
          animationDelay: "2s",
        }}
      />

      <div className="s3-root">
        <div className="s3-container">
          {/* Header */}
          <div className="s3-header">
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
              <button
                onClick={() => navigate("/history")}
                className="s3-back-btn"
              >
                <FaArrowLeft size={15} />
              </button>
              <div>
                <h1 className="s3-title">Interview Analytics</h1>
                <p className="s3-subtitle">AI-powered performance insights</p>
              </div>
            </div>
            <button onClick={downloadPDF} className="s3-download-btn">
              <FaDownload size={14} /> Download PDF
            </button>
          </div>

          {/* Grid */}
          <div className="s3-grid">
            {/* LEFT COLUMN */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Overall score */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="s3-card"
                style={{ textAlign: "center" }}
              >
                <p className="s3-card-title">Overall Performance</p>
                <div style={{ width: 120, height: 120, margin: "0 auto 20px" }}>
                  <CircularProgressbar
                    value={percentage}
                    text={`${finalScore}/10`}
                    styles={buildStyles({
                      textSize: "18px",
                      pathColor: "#c8f135",
                      textColor: "#e8eaf0",
                      trailColor: "rgba(255,255,255,0.06)",
                    })}
                  />
                </div>
                <p className="s3-perf-text">{performanceText}</p>
                <p className="s3-perf-sub">{shortTagline}</p>
              </motion.div>

              {/* Skill bars */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="s3-card"
              >
                <p className="s3-card-title">Skill Evaluation</p>
                {skills.map((s, i) => (
                  <div key={i}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 6,
                      }}
                    >
                      <span className="s3-skill-label">{s.label}</span>
                      <span className="s3-skill-value">{s.value}/10</span>
                    </div>
                    <div className="s3-skill-track">
                      <div
                        className="s3-skill-fill"
                        style={{ width: `${(s.value / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* RIGHT COLUMN */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Area chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="s3-card"
              >
                <p className="s3-card-title">Performance Trend</p>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={questionScoreData}>
                    <defs>
                      <linearGradient
                        id="scoreGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#c8f135"
                          stopOpacity={0.25}
                        />
                        <stop
                          offset="95%"
                          stopColor="#c8f135"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.05)"
                    />
                    <XAxis
                      dataKey="name"
                      stroke="#5a5f72"
                      tick={{ fontFamily: "Lato", fontSize: 12 }}
                    />
                    <YAxis
                      domain={[0, 10]}
                      stroke="#5a5f72"
                      tick={{ fontFamily: "Lato", fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#0d0f16",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 12,
                        fontFamily: "Lato",
                      }}
                      labelStyle={{ color: "#c8f135" }}
                      itemStyle={{ color: "#e8eaf0" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="#c8f135"
                      strokeWidth={2.5}
                      fill="url(#scoreGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Question breakdown */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="s3-card"
              >
                <p className="s3-card-title">Question Breakdown</p>
                {questionWiseScore.map((q, i) => (
                  <div key={i} className="s3-q-card">
                    <p className="s3-q-meta">Question {i + 1}</p>
                    <p className="s3-q-text">
                      {q.question || "Question not available"}
                    </p>
                    <span className="s3-q-score">{q.score ?? 0}/10</span>
                    <div className="s3-feedback-box">
                      <p className="s3-feedback-label">AI Feedback</p>
                      <p className="s3-feedback-text">
                        {q.feedback?.trim() ||
                          "No feedback available for this question."}
                      </p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Step3Report;
