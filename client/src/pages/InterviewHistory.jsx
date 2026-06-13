import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import axios from "axios";
import { ServerUrl } from "../App";
import { FaArrowLeft } from "react-icons/fa";

function InterviewHistory() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getMyInterviews = async () => {
      try {
        const result = await axios.get(
          ServerUrl + "/api/interview/get-interview",
          { withCredentials: true },
        );
        setInterviews(Array.isArray(result.data) ? result.data : []);
      } catch (error) {
        console.error("Error fetching interviews:", error);
      } finally {
        setLoading(false);
      }
    };

    getMyInterviews();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Lato:wght@300;400&display=swap');

        @keyframes ihPulse {
          0%,100% { opacity: .12; transform: scale(1); }
          50%      { opacity: .22; transform: scale(1.07); }
        }
        @keyframes ihFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .ih-root {
          min-height: 100vh;
          background: #07090f;
          padding: 48px 16px;
          font-family: 'Syne', sans-serif;
          position: relative;
          overflow: hidden;
        }

        .ih-blob {
          position: fixed;
          border-radius: 50%;
          filter: blur(100px);
          pointer-events: none;
          animation: ihPulse 7s ease-in-out infinite;
        }

        .ih-container {
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .ih-back-btn {
          width: 44px; height: 44px;
          border-radius: 14px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: #9ea3b8;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: background .2s, border-color .2s, color .2s;
          flex-shrink: 0;
        }
        .ih-back-btn:hover {
          background: rgba(200,241,53,0.08);
          border-color: rgba(200,241,53,0.25);
          color: #c8f135;
        }

        .ih-title {
          font-weight: 800; font-size: 1.8rem;
          letter-spacing: -.02em;
          color: #e8eaf0;
          margin: 0 0 6px;
        }
        .ih-subtitle {
          font-family: 'Lato', sans-serif;
          font-size: .9rem;
          color: #5a5f72;
          margin: 0;
        }

        .ih-empty {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 24px;
          padding: 56px 24px;
          text-align: center;
          margin-top: 32px;
        }
        .ih-empty p {
          font-family: 'Lato', sans-serif;
          color: #5a5f72;
          font-size: .95rem;
          margin: 0;
        }

        .ih-list {
          display: grid;
          gap: 16px;
          margin-top: 32px;
        }

        .ih-card {
          background: linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015));
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 22px 24px;
          cursor: pointer;
          transition: border-color .25s, background .25s, transform .25s, box-shadow .25s;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        @media (min-width: 768px) {
          .ih-card {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
        }

        .ih-card:hover {
          border-color: rgba(200,241,53,0.25);
          background: linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02));
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(200,241,53,0.08);
        }

        .ih-card-role {
          font-weight: 700; font-size: 1.05rem;
          color: #e8eaf0;
          margin: 0;
        }
        .ih-card-meta {
          font-family: 'Lato', sans-serif;
          font-size: .85rem;
          color: #5a5f72;
          margin: 6px 0 0;
        }
        .ih-card-date {
          font-family: 'Lato', sans-serif;
          font-size: .72rem;
          color: #3a3f52;
          margin: 8px 0 0;
        }

        .ih-card-right {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .ih-score {
          text-align: right;
        }
        .ih-score-num {
          font-weight: 800; font-size: 1.4rem;
          color: #c8f135;
          margin: 0;
        }
        .ih-score-label {
          font-family: 'Lato', sans-serif;
          font-size: .7rem;
          color: #3a3f52;
          text-transform: uppercase;
          letter-spacing: .06em;
          margin: 2px 0 0;
        }

        .ih-status {
          font-family: 'Syne', sans-serif;
          font-size: .72rem;
          font-weight: 700;
          letter-spacing: .06em;
          text-transform: uppercase;
          padding: 6px 14px;
          border-radius: 999px;
          white-space: nowrap;
        }
        .ih-status.completed {
          background: rgba(200,241,53,0.1);
          border: 1px solid rgba(200,241,53,0.25);
          color: #c8f135;
        }
        .ih-status.pending {
          background: rgba(255,200,87,0.08);
          border: 1px solid rgba(255,200,87,0.25);
          color: #ffc857;
        }

        .ih-loading {
          color: #5a5f72;
          font-family: 'Lato', sans-serif;
          text-align: center;
          margin-top: 40px;
        }
      `}</style>

      {/* Background blobs */}
      <div
        className="ih-blob"
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
        className="ih-blob"
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

      <div className="ih-root">
        <div className="ih-container">
          <div className="flex items-start gap-4 flex-wrap mb-2">
            <button onClick={() => navigate("/")} className="ih-back-btn">
              <FaArrowLeft size={15} />
            </button>
            <div>
              <h1 className="ih-title">Interview History</h1>
              <p className="ih-subtitle">
                Track your past interviews and performance reports
              </p>
            </div>
          </div>

          {loading ? (
            <p className="ih-loading">Loading your interviews...</p>
          ) : interviews.length === 0 ? (
            <div className="ih-empty">
              <p>No interviews found. Start your first interview.</p>
            </div>
          ) : (
            <div className="ih-list">
              {interviews.map((item, index) => (
                <motion.div
                  key={item._id || index}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  onClick={() => navigate(`/report/${item._id}`)}
                  className="ih-card"
                >
                  <div>
                    <h3 className="ih-card-role">{item.role}</h3>
                    <p className="ih-card-meta">
                      {item.experience} • {item.mode}
                    </p>
                    <p className="ih-card-date">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="ih-card-right">
                    <div className="ih-score">
                      <p className="ih-score-num">{item.finalScore || 0}/10</p>
                      <p className="ih-score-label">Overall Score</p>
                    </div>

                    <span
                      className={`ih-status ${
                        item.status === "completed" ? "completed" : "pending"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default InterviewHistory;
