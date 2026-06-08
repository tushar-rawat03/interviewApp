import React, { useState } from "react";
import { motion } from "motion/react";
import {
  FaUserTie,
  FaBriefcase,
  FaFileUpload,
  FaMicrophoneAlt,
  FaChartLine,
} from "react-icons/fa";
import axios from "axios";
import { ServerUrl } from "../App";

function Step1SetUp({ onStart }) {
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [mode, setMode] = useState("Technical");
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [resumeText, setResumeText] = useState("");
  const [analysisDone, setAnalysisDone] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const handleUploadResume = async () => {
    if (!resumeFile || analyzing) return;
    setAnalyzing(true);
    const formdata = new FormData();
    formdata.append("resume", resumeFile);
    try {
      const result = await axios.post(
        ServerUrl + "/api/interview/resume",
        formdata,
        { withCredentials: true },
      );
      setRole(result.data.role || "");
      setExperience(result.data.experience || "");
      setProjects(result.data.projects || []);
      setSkills(result.data.skills || []);
      setResumeText(result.data.resumeText || "");
      setAnalysisDone(true);
    } catch (error) {
      console.log(error);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Lato:wght@300;400&display=swap');

        .s1-root {
          min-height: 100vh;
          background: #07090f;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 16px;
          font-family: 'Syne', sans-serif;
          position: relative;
          overflow: hidden;
        }

        @keyframes s1Pulse {
          0%,100% { opacity: .12; transform: scale(1); }
          50%      { opacity: .22; transform: scale(1.07); }
        }
        @keyframes s1Shimmer {
          0%   { transform: translateX(-120%) skewX(-12deg); }
          100% { transform: translateX(280%) skewX(-12deg); }
        }

        .s1-blob {
          position: fixed; border-radius: 50%;
          filter: blur(100px); pointer-events: none;
          animation: s1Pulse 7s ease-in-out infinite;
        }

        .s1-card {
          width: 100%; max-width: 1000px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          border-radius: 28px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.07);
          box-shadow: 0 40px 100px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06);
          position: relative; z-index: 1;
        }

        @media (max-width: 768px) {
          .s1-card { grid-template-columns: 1fr; }
          .s1-left { display: none; }
        }

        /* LEFT PANEL */
        .s1-left {
          background: linear-gradient(145deg, rgba(200,241,53,0.07), rgba(200,241,53,0.03));
          border-right: 1px solid rgba(200,241,53,0.1);
          padding: 52px 44px;
          display: flex; flex-direction: column; justify-content: center;
          position: relative; overflow: hidden;
        }
        .s1-left::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(105deg, transparent 38%, rgba(200,241,53,.04) 50%, transparent 62%);
          animation: s1Shimmer 5s ease-in-out infinite;
          pointer-events: none;
        }
        .s1-left-title {
          font-weight: 800; font-size: 2.2rem;
          line-height: 1.1; letter-spacing: -.03em;
          color: #e8eaf0; margin: 0 0 16px;
        }
        .s1-left-title span { color: #c8f135; }
        .s1-left-desc {
          font-family: 'Lato', sans-serif;
          color: #4a4f62; font-size: .92rem;
          line-height: 1.75; font-weight: 300;
          margin: 0 0 36px;
        }
        .s1-feature {
          display: flex; align-items: center; gap: 14px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 14px; padding: 14px 18px;
          margin-bottom: 12px;
          transition: border-color .25s, background .25s;
          cursor: default;
        }
        .s1-feature:hover {
          border-color: rgba(200,241,53,0.25);
          background: rgba(200,241,53,0.05);
        }
        .s1-feature-icon {
          width: 38px; height: 38px; flex-shrink: 0;
          border-radius: 10px;
          background: rgba(200,241,53,0.1);
          border: 1px solid rgba(200,241,53,0.2);
          display: flex; align-items: center; justify-content: center;
          color: #c8f135;
        }
        .s1-feature-text {
          font-family: 'Syne', sans-serif;
          font-weight: 600; font-size: .88rem;
          color: #9ea3b8;
        }

        /* RIGHT PANEL */
        .s1-right {
          background: #0d0f16;
          padding: 52px 44px;
          overflow-y: auto;
        }
        .s1-right-title {
          font-weight: 800; font-size: 1.7rem;
          letter-spacing: -.025em; color: #e8eaf0;
          margin: 0 0 32px;
        }

        /* Input group */
        .s1-input-wrap {
          position: relative; margin-bottom: 16px;
        }
        .s1-input-icon {
          position: absolute; top: 50%; left: 14px;
          transform: translateY(-50%);
          color: #3a3f52; pointer-events: none;
          font-size: 15px;
        }
        .s1-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          padding: 13px 16px 13px 42px;
          font-family: 'Lato', sans-serif;
          font-size: .92rem; color: #e8eaf0;
          outline: none;
          transition: border-color .2s, box-shadow .2s;
        }
        .s1-input::placeholder { color: #3a3f52; }
        .s1-input:focus {
          border-color: rgba(200,241,53,0.4);
          box-shadow: 0 0 0 3px rgba(200,241,53,0.07);
        }

        .s1-select {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          padding: 13px 16px;
          font-family: 'Lato', sans-serif;
          font-size: .92rem; color: #e8eaf0;
          outline: none; cursor: pointer;
          margin-bottom: 16px;
          transition: border-color .2s;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%234a4f62' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 16px center;
        }
        .s1-select:focus { border-color: rgba(200,241,53,0.4); }
        .s1-select option { background: #0d0f16; color: #e8eaf0; }

        /* Upload zone */
        .s1-upload-zone {
          border: 2px dashed rgba(255,255,255,0.1);
          border-radius: 16px;
          padding: 32px 24px;
          text-align: center;
          cursor: pointer;
          transition: border-color .25s, background .25s;
          margin-bottom: 16px;
        }
        .s1-upload-zone:hover {
          border-color: rgba(200,241,53,0.4);
          background: rgba(200,241,53,0.04);
        }
        .s1-upload-icon {
          font-size: 2rem; color: #c8f135;
          margin: 0 auto 10px;
          display: block;
        }
        .s1-upload-text {
          font-family: 'Lato', sans-serif;
          font-size: .88rem; color: #4a4f62;
        }
        .s1-upload-text span { color: #9ea3b8; }

        .s1-analyze-btn {
          margin-top: 14px;
          background: rgba(200,241,53,0.1);
          border: 1px solid rgba(200,241,53,0.3);
          color: #c8f135;
          font-family: 'Syne', sans-serif;
          font-weight: 700; font-size: .85rem;
          padding: 9px 22px; border-radius: 999px;
          cursor: pointer;
          transition: background .2s, box-shadow .2s;
        }
        .s1-analyze-btn:hover {
          background: rgba(200,241,53,0.16);
          box-shadow: 0 0 16px rgba(200,241,53,0.2);
        }

        /* Analysis result */
        .s1-analysis {
          background: rgba(200,241,53,0.04);
          border: 1px solid rgba(200,241,53,0.15);
          border-radius: 16px;
          padding: 20px; margin-bottom: 16px;
        }
        .s1-analysis-title {
          font-weight: 700; font-size: .95rem;
          color: #c8f135; margin: 0 0 14px;
        }
        .s1-analysis-label {
          font-weight: 700; font-size: .8rem;
          color: #9ea3b8; letter-spacing: .06em;
          text-transform: uppercase; margin: 0 0 8px;
          font-family: 'Syne', sans-serif;
        }
        .s1-analysis-list {
          list-style: none; padding: 0; margin: 0 0 14px;
          display: flex; flex-wrap: wrap; gap: 8px;
        }
        .s1-analysis-list li {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 999px;
          padding: 4px 12px;
          font-family: 'Lato', sans-serif;
          font-size: .82rem; color: #9ea3b8;
        }

        /* Start button */
        .s1-start-btn {
          width: 100%;
          background: #c8f135; color: #07090f;
          border: none; border-radius: 14px;
          padding: 15px;
          font-family: 'Syne', sans-serif;
          font-weight: 800; font-size: 1rem;
          letter-spacing: .02em; cursor: pointer;
          transition: transform .2s, box-shadow .2s;
          margin-top: 8px;
        }
        .s1-start-btn:hover {
          transform: scale(1.02);
          box-shadow: 0 0 30px rgba(200,241,53,0.35);
        }
        .s1-start-btn:disabled {
          opacity: .4; cursor: not-allowed; transform: none;
        }
      `}</style>

      {/* Background blobs */}
      <div
        className="s1-blob"
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
        className="s1-blob"
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

      <div className="s1-root">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="s1-card"
        >
          {/* ── LEFT PANEL ── */}
          <motion.div
            initial={{ x: -60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="s1-left"
          >
            <h2 className="s1-left-title">
              Start Your <span>AI</span> Interview
            </h2>
            <p className="s1-left-desc">
              Practice real interview scenarios powered by AI. Improve
              communication, technical skills, and confidence.
            </p>

            {[
              {
                icon: <FaUserTie size={16} />,
                text: "Choose Role & Experience",
              },
              {
                icon: <FaMicrophoneAlt size={16} />,
                text: "Smart Voice Interview",
              },
              {
                icon: <FaChartLine size={16} />,
                text: "Performance Analytics",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.15 }}
                whileHover={{ scale: 1.02 }}
                className="s1-feature"
              >
                <div className="s1-feature-icon">{item.icon}</div>
                <span className="s1-feature-text">{item.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* ── RIGHT PANEL ── */}
          <motion.div
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="s1-right"
          >
            <h2 className="s1-right-title">Interview Setup</h2>

            {/* Role input */}
            <div className="s1-input-wrap">
              <FaUserTie className="s1-input-icon" />
              <input
                type="text"
                placeholder="Enter job role (e.g. Frontend Developer)"
                className="s1-input"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>

            {/* Experience input */}
            <div className="s1-input-wrap">
              <FaBriefcase className="s1-input-icon" />
              <input
                type="text"
                placeholder="Experience (e.g. 2 years)"
                className="s1-input"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              />
            </div>

            {/* Mode select */}
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="s1-select"
            >
              <option value="Technical">Technical Interview</option>
              <option value="HR">HR Interview</option>
            </select>

            {/* Resume upload */}
            {!analysisDone && (
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="s1-upload-zone"
                onClick={() => document.getElementById("resumeUpload").click()}
              >
                <FaFileUpload className="s1-upload-icon" />
                <input
                  type="file"
                  accept="application/pdf"
                  id="resumeUpload"
                  className="hidden"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                />
                <p className="s1-upload-text">
                  {resumeFile ? (
                    <span style={{ color: "#c8f135" }}>{resumeFile.name}</span>
                  ) : (
                    <>
                      <span>Click to upload resume</span> (Optional)
                    </>
                  )}
                </p>
                {resumeFile && (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUploadResume();
                    }}
                    className="s1-analyze-btn"
                  >
                    {analyzing ? "Analyzing..." : "Analyze Resume →"}
                  </motion.button>
                )}
              </motion.div>
            )}

            {/* Analysis result */}
            {analysisDone && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="s1-analysis"
              >
                <p className="s1-analysis-title">✓ Resume Analyzed</p>

                {projects.length > 0 && (
                  <>
                    <p className="s1-analysis-label">Projects</p>
                    <ul className="s1-analysis-list">
                      {projects.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </>
                )}

                {skills.length > 0 && (
                  <>
                    <p className="s1-analysis-label">Skills</p>
                    <ul className="s1-analysis-list">
                      {skills.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </>
                )}
              </motion.div>
            )}

            {/* Start button */}
            <button
              className="s1-start-btn"
              disabled={!role || !experience}
              onClick={() =>
                onStart({
                  role,
                  experience,
                  mode,
                  skills,
                  projects,
                  resumeText,
                })
              }
            >
              {loading ? "Starting..." : "Start Interview →"}
            </button>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}

export default Step1SetUp;
