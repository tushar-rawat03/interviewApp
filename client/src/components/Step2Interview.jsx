import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion } from "motion/react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { BsArrowRight, BsRobot } from "react-icons/bs";
import maleVideo from "../assets/Videos/Videos/male-ai.mp4";
import femaleVideo from "../assets/Videos/Videos/female-ai.mp4";
import Timer from "./Timer"; // adjust path as needed
import { ServerUrl } from "../App";

function Step2Interview({ interviewData, onFinish }) {
  const interviewId = interviewData?.interviewId;
  const questions = interviewData?.questions || [];
  const userName = interviewData?.userName;

  const [isIntroPhase, setIsIntroPhase] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isAIPlaying, setIsAIPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [timeLeft, setTimeLeft] = useState(questions[0]?.timeLimit || 60);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voiceGender, setVoiceGender] = useState("female");
  const [subtitle, setSubtitle] = useState("");

  const recognitionRef = useRef(null);
  const isListeningRef = useRef(false);
  const videoRef = useRef(null);

  const currentQuestion = questions[currentIndex];
  const videoSource = voiceGender === "male" ? maleVideo : femaleVideo;

  // ---------------- Speech Synthesis ----------------
  const speakText = (text) => {
    return new Promise((resolve) => {
      if (!window.speechSynthesis || !selectedVoice) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();

      const humanText = text.replace(/,/g, "... ").replace(/\./g, "... ");

      const utterance = new SpeechSynthesisUtterance(humanText);
      utterance.voice = selectedVoice;
      utterance.rate = 0.92;
      utterance.pitch = 1.05;
      utterance.volume = 1;

      utterance.onstart = () => {
        setIsAIPlaying(true);
        stopMic();
        videoRef.current?.play();
      };

      utterance.onend = () => {
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
        setIsAIPlaying(false);
        setSubtitle("");
        if (isMicOn) {
          startMic();
        }
        resolve();
      };

      setSubtitle(text);
      window.speechSynthesis.speak(utterance);
    });
  };

  // ---------------- Load available voice ----------------
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return;

      const voice =
        voices.find((v) =>
          voiceGender === "male"
            ? v.name.toLowerCase().includes("male")
            : v.name.toLowerCase().includes("female"),
        ) || voices[0];

      setSelectedVoice(voice);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, [voiceGender]);

  // ---------------- Intro / Question narration ----------------
  useEffect(() => {
    if (!selectedVoice) return;
    if (questions.length === 0) return;

    const runIntro = async () => {
      if (isIntroPhase) {
        await speakText(
          `Hi ${userName}, it's great to meet you today. I hope you're feeling confident and ready.`,
        );
        await speakText(
          "I'll ask you a few questions. Just answer naturally, and take your time. Let's begin.",
        );
        setIsIntroPhase(false);
        return;
      }

      if (!currentQuestion) return;

      await new Promise((r) => setTimeout(r, 800));

      if (currentIndex === questions.length - 1) {
        await speakText("Alright, this one might be a bit more challenging.");
      }

      await speakText(currentQuestion.question);

      setTimeout(() => {
        if (isMicOn) startMic();
      }, 500);
    };

    runIntro();
  }, [selectedVoice, isIntroPhase, currentIndex]);

  // ---------------- Timer countdown ----------------
  useEffect(() => {
    if (isIntroPhase) return;
    if (!currentQuestion) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isIntroPhase, currentIndex]);

  // ---------------- Reset timer on question change ----------------
  useEffect(() => {
    if (!isIntroPhase && currentQuestion) {
      setTimeLeft(currentQuestion.timeLimit || 60);
    }
  }, [currentIndex]);

  // ---------------- Speech recognition setup ----------------
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) return;

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      setAnswer((prev) => prev + " " + transcript);
    };

    recognition.onstart = () => {
      isListeningRef.current = true;
    };

    recognition.onend = () => {
      isListeningRef.current = false;
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      isListeningRef.current = false;
    };

    recognitionRef.current = recognition;
  }, []);

  const startMic = () => {
    if (!recognitionRef.current) return;
    if (isAIPlaying) return;
    if (isListeningRef.current) return;

    try {
      recognitionRef.current.start();
      isListeningRef.current = true;
    } catch (error) {
      if (error.name !== "InvalidStateError") {
        console.error("Error starting recognition:", error);
      }
    }
  };

  const stopMic = () => {
    if (!recognitionRef.current) return;
    if (!isListeningRef.current) return;

    try {
      recognitionRef.current.stop();
    } catch (error) {
      console.error("Error stopping recognition:", error);
    }
  };

  const toggleMic = () => {
    if (isMicOn) {
      stopMic();
    } else {
      startMic();
    }
    setIsMicOn((prev) => !prev);
  };

  // ---------------- Submit answer ----------------
  const submitAnswer = async () => {
    if (isSubmitting) return;

    stopMic();
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        ServerUrl + "/api/interview/submit-answer",
        {
          interviewId,
          questionIndex: currentIndex,
          answer,
          timeTaken: currentQuestion.timeLimit - timeLeft,
        },
        { withCredentials: true },
      );

      setFeedback(response.data.feedback);
      await speakText(response.data.feedback);
    } catch (error) {
      console.error("Error submitting answer:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------------- Auto-submit on timeout ----------------
  useEffect(() => {
    if (isIntroPhase) return;
    if (!currentQuestion) return;
    if (timeLeft === 0 && !isSubmitting && !feedback) {
      submitAnswer();
    }
  }, [isIntroPhase, currentQuestion, timeLeft, isSubmitting, feedback]);

  // ---------------- Move to next question ----------------
  const handleNext = async () => {
    setAnswer("");
    setFeedback("");

    if (currentIndex + 1 >= questions.length) {
      finishInterview();
      return;
    }

    await speakText("Alright, let's move to the next question.");
    setCurrentIndex((prev) => prev + 1);
  };

  // ---------------- Finish interview ----------------
  const finishInterview = async () => {
    stopMic();
    setIsMicOn(false);
    try {
      const result = await axios.post(
        ServerUrl + "/api/interview/finish",
        { interviewId },
        { withCredentials: true },
      );
      onFinish(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  // ---------------- Cleanup ----------------
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current.abort();
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  // ---------------- Render ----------------
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Lato:wght@300;400&display=swap');

        @keyframes s2Pulse {
          0%,100% { opacity: .12; transform: scale(1); }
          50%      { opacity: .22; transform: scale(1.07); }
        }
        @keyframes s2Shimmer {
          0%   { transform: translateX(-120%) skewX(-12deg); }
          100% { transform: translateX(280%) skewX(-12deg); }
        }
        @keyframes s2FadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes s2Dot {
          0%,100% { transform: scale(1); opacity: 1; }
          50%      { transform: scale(1.4); opacity: .5; }
        }

        .s2-root {
          min-height: 100vh;
          background: #07090f;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px 16px;
          font-family: 'Syne', sans-serif;
          position: relative;
          overflow: hidden;
        }

        .s2-blob {
          position: fixed;
          border-radius: 50%;
          filter: blur(100px);
          pointer-events: none;
          animation: s2Pulse 7s ease-in-out infinite;
        }

        .s2-card {
          width: 100%; max-width: 1100px;
          min-height: 80vh;
          display: grid;
          grid-template-columns: 360px 1fr;
          border-radius: 28px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.07);
          box-shadow: 0 40px 100px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06);
          position: relative; z-index: 1;
          background: #0d0f16;
        }

        @media (max-width: 900px) {
          .s2-card { grid-template-columns: 1fr; min-height: auto; }
        }

        .s2-left {
          background: linear-gradient(145deg, rgba(200,241,53,0.07), rgba(200,241,53,0.03));
          border-right: 1px solid rgba(200,241,53,0.1);
          padding: 36px 28px;
          display: flex; flex-direction: column;
          gap: 20px;
          position: relative; overflow: hidden;
        }
        .s2-left::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(105deg, transparent 38%, rgba(200,241,53,.04) 50%, transparent 62%);
          animation: s2Shimmer 5s ease-in-out infinite;
          pointer-events: none;
        }

        @media (max-width: 900px) {
          .s2-left { border-right: none; border-bottom: 1px solid rgba(200,241,53,0.1); }
        }

        .s2-video-wrap {
          position: relative; z-index: 1;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.02);
          aspect-ratio: 1 / 1;
          box-shadow: 0 0 40px rgba(200,241,53,0.08);
        }
        .s2-video-wrap video {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
        }

        .s2-subtitle {
          position: relative; z-index: 1;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 14px 16px;
          animation: s2FadeUp .35s ease-out;
        }
        .s2-subtitle p {
          font-family: 'Lato', sans-serif;
          font-size: .9rem;
          color: #c7cad6;
          line-height: 1.65;
          margin: 0;
          text-align: center;
        }

        .s2-status-card {
          position: relative; z-index: 1;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 22px;
          display: flex; flex-direction: column; gap: 18px;
        }

        .s2-status-row {
          display: flex; justify-content: space-between; align-items: center;
        }
        .s2-status-label {
          font-family: 'Lato', sans-serif;
          font-size: .8rem;
          color: #5a5f72;
        }
        .s2-speaking {
          display: flex; align-items: center; gap: 6px;
          font-family: 'Syne', sans-serif;
          font-weight: 700; font-size: .8rem;
          color: #c8f135;
        }
        .s2-speaking-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #c8f135;
          animation: s2Dot 1.2s infinite ease-in-out;
        }

        .s2-divider { height: 1px; background: rgba(255,255,255,0.06); }

        .s2-stats {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 16px; text-align: center;
        }
        .s2-stat-num {
          font-family: 'Syne', sans-serif;
          font-weight: 800; font-size: 1.7rem;
          color: #c8f135;
          display: block;
        }
        .s2-stat-label {
          font-family: 'Lato', sans-serif;
          font-size: .72rem;
          color: #4a4f62;
          text-transform: uppercase;
          letter-spacing: .08em;
        }

        /* Right panel */
        .s2-right {
          padding: 36px 32px;
          display: flex; flex-direction: column;
          background: #0d0f16;
        }

        .s2-heading {
          display: flex; align-items: center; gap: 12px;
          margin-bottom: 24px;
        }
        .s2-heading-icon {
          width: 38px; height: 38px;
          border-radius: 10px;
          background: linear-gradient(135deg, #c8f135, #78a80d);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 0 16px rgba(200,241,53,0.35);
        }
        .s2-heading h2 {
          font-family: 'Syne', sans-serif;
          font-weight: 800; font-size: 1.4rem;
          letter-spacing: -.02em;
          color: #e8eaf0;
          margin: 0;
        }

        .s2-question-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 22px 24px;
          margin-bottom: 20px;
          animation: s2FadeUp .35s ease-out;
        }
        .s2-question-meta {
          font-family: 'Syne', sans-serif;
          font-size: .72rem; font-weight: 700;
          letter-spacing: .12em; text-transform: uppercase;
          color: #c8f135;
          margin: 0 0 10px;
        }
        .s2-question-text {
          font-family: 'Lato', sans-serif;
          font-size: 1.05rem; font-weight: 400;
          color: #e8eaf0;
          line-height: 1.6;
          margin: 0;
        }

        .s2-textarea {
          flex: 1;
          width: 100%;
          min-height: 160px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 20px;
          font-family: 'Lato', sans-serif;
          font-size: .95rem;
          color: #e8eaf0;
          resize: none; outline: none;
          line-height: 1.7;
          transition: border-color .2s, box-shadow .2s;
        }
        .s2-textarea::placeholder { color: #3a3f52; }
        .s2-textarea:focus {
          border-color: rgba(200,241,53,0.4);
          box-shadow: 0 0 0 3px rgba(200,241,53,0.07);
        }

        .s2-actions {
          display: flex; align-items: center; gap: 14px;
          margin-top: 20px;
        }

        .s2-mic-btn {
          width: 54px; height: 54px;
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          cursor: pointer;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.05);
          color: #e8eaf0;
          transition: background .2s, border-color .2s, color .2s;
        }
        .s2-mic-btn.on {
          background: rgba(200,241,53,0.1);
          border-color: rgba(200,241,53,0.3);
          color: #c8f135;
        }
        .s2-mic-btn.off {
          background: rgba(248,113,113,0.08);
          border-color: rgba(248,113,113,0.25);
          color: #f87171;
        }

        .s2-submit-btn {
          flex: 1;
          background: #c8f135; color: #07090f;
          border: none; border-radius: 16px;
          padding: 17px;
          font-family: 'Syne', sans-serif;
          font-weight: 800; font-size: .95rem;
          letter-spacing: .02em; cursor: pointer;
          transition: transform .2s, box-shadow .2s, opacity .2s;
        }
        .s2-submit-btn:hover:not(:disabled) {
          transform: scale(1.01);
          box-shadow: 0 0 30px rgba(200,241,53,0.3);
        }
        .s2-submit-btn:disabled {
          opacity: .4; cursor: not-allowed; transform: none;
        }

        .s2-feedback-card {
          margin-top: 20px;
          background: rgba(200,241,53,0.05);
          border: 1px solid rgba(200,241,53,0.18);
          border-radius: 20px;
          padding: 22px;
          animation: s2FadeUp .35s ease-out;
        }
        .s2-feedback-label {
          font-family: 'Syne', sans-serif;
          font-size: .72rem; font-weight: 700;
          letter-spacing: .12em; text-transform: uppercase;
          color: #c8f135;
          margin: 0 0 10px;
        }
        .s2-feedback-text {
          font-family: 'Lato', sans-serif;
          font-size: .92rem;
          color: #c7cad6;
          line-height: 1.7;
          margin: 0 0 18px;
        }

        .s2-next-btn {
          width: 100%;
          background: #c8f135; color: #07090f;
          border: none; border-radius: 14px;
          padding: 14px;
          font-family: 'Syne', sans-serif;
          font-weight: 700; font-size: .9rem;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: transform .2s, box-shadow .2s;
        }
        .s2-next-btn:hover {
          transform: scale(1.01);
          box-shadow: 0 0 24px rgba(200,241,53,0.3);
        }

        .s2-loading {
          color: #5a5f72;
          font-family: 'Lato', sans-serif;
          font-size: 1rem;
          text-align: center;
        }
      `}</style>

      {/* Background blobs */}
      <div
        className="s2-blob"
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
        className="s2-blob"
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

      <div className="s2-root">
        {questions.length === 0 ? (
          <p className="s2-loading">Loading interview...</p>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="s2-card"
          >
            {/* LEFT PANEL */}
            <div className="s2-left">
              <div className="s2-video-wrap">
                <video
                  src={videoSource}
                  key={videoSource}
                  ref={videoRef}
                  muted
                  playsInline
                  preload="auto"
                />
              </div>

              {subtitle && (
                <div className="s2-subtitle">
                  <p>{subtitle}</p>
                </div>
              )}

              <div className="s2-status-card">
                <div className="s2-status-row">
                  <span className="s2-status-label">Interview Status</span>
                  {isAIPlaying && (
                    <span className="s2-speaking">
                      <span className="s2-speaking-dot" />
                      AI Speaking
                    </span>
                  )}
                </div>

                <div className="s2-divider" />

                <div className="flex justify-center">
                  <Timer
                    timeLeft={timeLeft}
                    totalTime={currentQuestion?.timeLimit}
                  />
                </div>

                <div className="s2-divider" />

                <div className="s2-stats">
                  <div>
                    <span className="s2-stat-num">{currentIndex + 1}</span>
                    <span className="s2-stat-label">Current</span>
                  </div>
                  <div>
                    <span className="s2-stat-num">{questions.length}</span>
                    <span className="s2-stat-label">Total</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="s2-right">
              <div className="s2-heading">
                <div className="s2-heading-icon">
                  <BsRobot size={18} color="#07090f" />
                </div>
                <h2>AI Smart Interview</h2>
              </div>

              {!isIntroPhase && currentQuestion && (
                <div className="s2-question-card">
                  <p className="s2-question-meta">
                    Question {currentIndex + 1} of {questions.length}
                  </p>
                  <p className="s2-question-text">{currentQuestion.question}</p>
                </div>
              )}

              <textarea
                placeholder="Type your answer here..."
                onChange={(e) => setAnswer(e.target.value)}
                value={answer}
                className="s2-textarea"
              />

              {!feedback ? (
                <div className="s2-actions">
                  <motion.button
                    onClick={toggleMic}
                    whileTap={{ scale: 0.92 }}
                    className={`s2-mic-btn ${isMicOn ? "on" : "off"}`}
                  >
                    {isMicOn ? (
                      <FaMicrophone size={18} />
                    ) : (
                      <FaMicrophoneSlash size={18} />
                    )}
                  </motion.button>

                  <motion.button
                    onClick={submitAnswer}
                    disabled={isSubmitting}
                    whileTap={{ scale: 0.98 }}
                    className="s2-submit-btn"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Answer"}
                  </motion.button>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="s2-feedback-card"
                >
                  <p className="s2-feedback-label">Feedback</p>
                  <p className="s2-feedback-text">{feedback}</p>
                  <button onClick={handleNext} className="s2-next-btn">
                    Next Question <BsArrowRight size={16} />
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
}

export default Step2Interview;
