import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import { motion } from "motion/react";
import {
  BsRobot,
  BsMic,
  BsClock,
  BsBarChart,
  BsFileEarmarkText,
  BsPersonCheck,
  BsCreditCard2Front,
} from "react-icons/bs";
import { HiSparkles } from "react-icons/hi";
import AuthModel from "../components/AuthModel";
import { useNavigate } from "react-router-dom";
import hrImg from "../assets/HR.png";
import techImg from "../assets/tech.png";
import confidenceImg from "../assets/confi.png";
import creditImg from "../assets/credit.png";
import Footer from "../components/Footer";

function home() {
  const { userData } = useSelector((state) => state.user);
  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "#07090f",
        fontFamily: "'Clash Display', 'Syne', sans-serif",
        color: "#e8eaf0",
        overflowX: "hidden",
      }}
    >
      {/* ── Fonts + Global Styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Lato:ital,wght@0,300;0,400;1,300&display=swap');

        :root {
          --accent: #c8f135;
          --accent-dim: rgba(200,241,53,0.12);
          --accent-border: rgba(200,241,53,0.25);
          --card-bg: rgba(255,255,255,0.03);
          --card-border: rgba(255,255,255,0.07);
          --text-muted: #5a5f72;
        }

        * { box-sizing: border-box; }
        body { background: #07090f; }

        @keyframes floatY {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-12px); }
        }
        @keyframes gridPan {
          0%   { background-position: 0 0; }
          100% { background-position: 40px 40px; }
        }
        @keyframes pulseGlow {
          0%,100% { opacity: .14; }
          50%      { opacity: .3; }
        }
        @keyframes shimmer {
          0%   { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(250%) skewX(-15deg); }
        }

        .hero-grid-bg {
          background-image:
            linear-gradient(rgba(200,241,53,.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(200,241,53,.04) 1px, transparent 1px);
          background-size: 40px 40px;
          animation: gridPan 8s linear infinite;
        }

        .accent-blob {
          position: fixed;
          border-radius: 50%;
          filter: blur(90px);
          pointer-events: none;
          animation: pulseGlow 6s ease-in-out infinite;
        }

        .shimmer-card {
          position: relative;
          overflow: hidden;
        }
        .shimmer-card::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(105deg, transparent 40%, rgba(200,241,53,.06) 50%, transparent 60%);
          animation: shimmer 3.5s ease-in-out infinite;
          pointer-events: none;
        }

        .step-tilt-0 { transform: rotate(-3deg); }
        .step-tilt-1 { transform: rotate(2deg) translateY(-12px); }
        .step-tilt-2 { transform: rotate(-2deg); }
        .step-card:hover {
          transform: rotate(0deg) translateY(-8px) scale(1.03) !important;
          border-color: var(--accent-border) !important;
          box-shadow: 0 24px 60px rgba(200,241,53,.12) !important;
        }

        .mode-card:hover {
          border-color: var(--accent-border) !important;
          box-shadow: 0 0 50px rgba(200,241,53,.08) !important;
          transform: translateY(-5px);
        }

        .pill-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--accent-dim);
          border: 1px solid var(--accent-border);
          color: var(--accent);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .1em;
          text-transform: uppercase;
          padding: 5px 14px;
          border-radius: 999px;
        }

        .cta-btn {
          background: var(--accent);
          color: #07090f;
          border: none;
          padding: 15px 38px;
          border-radius: 999px;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: .95rem;
          letter-spacing: .02em;
          cursor: pointer;
          transition: transform .2s, box-shadow .2s;
        }
        .cta-btn:hover {
          transform: scale(1.04);
          box-shadow: 0 0 30px rgba(200,241,53,.35);
        }

        .ghost-btn {
          background: transparent;
          color: #e8eaf0;
          border: 1px solid #252830;
          padding: 15px 38px;
          border-radius: 999px;
          font-family: 'Syne', sans-serif;
          font-weight: 600;
          font-size: .95rem;
          cursor: pointer;
          transition: border-color .25s, color .25s;
        }
        .ghost-btn:hover { border-color: var(--accent); color: var(--accent); }
      `}</style>

      {/* Background layers — fixed so they don't affect layout */}
      <div
        className="hero-grid-bg"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      <div
        className="accent-blob"
        style={{
          width: 500,
          height: 500,
          background: "var(--accent)",
          top: "-10%",
          left: "-8%",
          opacity: 0.12,
          zIndex: 0,
        }}
      />
      <div
        className="accent-blob"
        style={{
          width: 300,
          height: 300,
          background: "var(--accent)",
          bottom: "10%",
          right: "5%",
          opacity: 0.08,
          animationDelay: "2s",
          zIndex: 0,
        }}
      />

      {/* ── NAVBAR ── */}
      <Navbar />

      {/* ── MAIN CONTENT ── */}
      <div
        className="flex-1 px-6 py-20"
        style={{ position: "relative", zIndex: 1 }}
      >
        <div className="max-w-6xl mx-auto">
          {/* badge */}
          <div className="flex justify-center mb-7">
            <span className="pill-tag">
              <HiSparkles size={13} />
              AI Powered Smart Interview Platform
            </span>
          </div>

          {/* headline */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(2.6rem, 6.5vw, 5.2rem)",
              lineHeight: 1.07,
              letterSpacing: "-.03em",
              textAlign: "center",
              maxWidth: 820,
              margin: "0 auto 22px",
            }}
          >
            Practice Interviews with{" "}
            <span
              style={{
                background: "linear-gradient(120deg, #c8f135, #78a80d)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              AI Intelligence
            </span>
          </motion.h1>

          {/* sub */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.25 }}
            style={{
              fontFamily: "'Lato', sans-serif",
              color: "var(--text-muted)",
              fontSize: "1.1rem",
              maxWidth: 500,
              margin: "0 auto 48px",
              textAlign: "center",
              lineHeight: 1.75,
              fontWeight: 300,
            }}
          >
            Role-based mock interviews with smart follow-ups, adaptive
            difficulty and real-time performance evaluation.
          </motion.p>

          {/* CTA row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-wrap justify-center gap-4 mb-20"
          >
            <button
              className="cta-btn"
              onClick={() => {
                if (!userData) {
                  setShowAuth(true);
                  return;
                }
                navigate("/interview");
              }}
            >
              Start Interview →
            </button>
            <button
              className="ghost-btn"
              onClick={() => {
                if (!userData) {
                  setShowAuth(true);
                  return;
                }
                navigate("/history");
              }}
            >
              View History
            </button>
          </motion.div>

          {/* ══ STEP CARDS ══ */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-28">
            {[
              {
                icon: <BsRobot size={22} />,
                step: "STEP 1",
                title: "Role & Experience Selection",
                desc: "AI adjusts difficulty based on selected job role.",
              },
              {
                icon: <BsMic size={22} />,
                step: "STEP 2",
                title: "Smart Voice Interview",
                desc: "Dynamic follow-up questions based on your answers.",
              },
              {
                icon: <BsClock size={22} />,
                step: "STEP 3",
                title: "Timer Based Simulation",
                desc: "Real interview pressure with time tracking.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55 + index * 0.15 }}
                className={`shimmer-card step-card step-tilt-${index}`}
                style={{
                  background:
                    "linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
                  border: "1px solid var(--card-border)",
                  borderRadius: 28,
                  padding: "44px 32px 36px",
                  width: 290,
                  maxWidth: "90vw",
                  transition:
                    "transform .4s cubic-bezier(.23,1,.32,1), border-color .3s, box-shadow .3s",
                  cursor: "default",
                  backdropFilter: "blur(12px)",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 20,
                    right: 24,
                    fontSize: "3.5rem",
                    fontWeight: 800,
                    color: "rgba(255,255,255,.04)",
                    lineHeight: 1,
                    userSelect: "none",
                  }}
                >
                  {index + 1}
                </div>
                <div
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 16,
                    background: "var(--accent-dim)",
                    border: "1px solid var(--accent-border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--accent)",
                    marginBottom: 28,
                  }}
                >
                  {item.icon}
                </div>
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: ".14em",
                    color: "var(--accent)",
                    textTransform: "uppercase",
                    marginBottom: 10,
                  }}
                >
                  {item.step}
                </div>
                <h3
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 700,
                    fontSize: "1.05rem",
                    marginBottom: 12,
                    color: "#e8eaf0",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    fontFamily: "'Lato', sans-serif",
                    color: "var(--text-muted)",
                    fontSize: ".88rem",
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* ══ MODES ══ */}
          <div className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{ textAlign: "center", marginBottom: 56 }}
            >
              <p
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: ".14em",
                  color: "var(--accent)",
                  textTransform: "uppercase",
                  marginBottom: 12,
                }}
              >
                What We Offer
              </p>
              <h2
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(1.9rem, 4vw, 3rem)",
                  letterSpacing: "-.025em",
                  margin: 0,
                }}
              >
                Multiple Interview{" "}
                <span style={{ color: "var(--accent)" }}>Modes</span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  image: hrImg,
                  icon: <BsPersonCheck size={18} />,
                  title: "HR Interview Mode",
                  desc: "Behavioral and communication based evaluation.",
                },
                {
                  image: techImg,
                  icon: <BsBarChart size={18} />,
                  title: "Technical Mode",
                  desc: "Deep technical questioning based on selected role.",
                },
                {
                  image: confidenceImg,
                  icon: <BsMic size={18} />,
                  title: "Confidence Detection",
                  desc: "Basic tone and voice analysis insights.",
                },
                {
                  image: creditImg,
                  icon: <BsCreditCard2Front size={18} />,
                  title: "Credits System",
                  desc: "Unlock premium interview sessions easily.",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="shimmer-card mode-card"
                  style={{
                    background:
                      "linear-gradient(145deg, rgba(255,255,255,0.035), rgba(255,255,255,0.015))",
                    border: "1px solid var(--card-border)",
                    borderRadius: 28,
                    padding: "32px",
                    display: "flex",
                    alignItems: "center",
                    gap: 28,
                    backdropFilter: "blur(10px)",
                    transition:
                      "border-color .3s, box-shadow .3s, transform .35s",
                    cursor: "default",
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      width: 120,
                      height: 120,
                      flexShrink: 0,
                      borderRadius: 20,
                      background: "var(--accent-dim)",
                      border: "1px solid var(--accent-border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      animation: `floatY 4.5s ease-in-out ${index * 0.7}s infinite`,
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      style={{
                        width: "85%",
                        height: "85%",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 150 }}>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 7,
                        background: "var(--accent-dim)",
                        border: "1px solid var(--accent-border)",
                        color: "var(--accent)",
                        borderRadius: 999,
                        padding: "4px 13px",
                        fontSize: "11px",
                        fontWeight: 700,
                        letterSpacing: ".06em",
                        marginBottom: 14,
                      }}
                    >
                      {item.icon} {item.title}
                    </div>
                    <p
                      style={{
                        fontFamily: "'Lato', sans-serif",
                        color: "var(--text-muted)",
                        fontSize: ".9rem",
                        lineHeight: 1.7,
                        margin: 0,
                      }}
                    >
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── FOOTER — outside flex-1, at the bottom of the flex column ── */}
      <Footer />

      {/* ── AUTH MODAL ── */}
      {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}
    </div>
  );
}

export default home;
