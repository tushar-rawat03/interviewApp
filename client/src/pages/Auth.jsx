import { BsRobot } from "react-icons/bs";
import { IoSparkles } from "react-icons/io5";
import { motion } from "motion/react";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { ServerUrl } from "../App";

function Auth({ isModel = false }) {
  const dispatch = useDispatch();

  const handleGoogleAuth = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      let User = response.user;
      let name = User.displayName;
      let email = User.email;
      const result = await axios.post(
        ServerUrl + "/api/auth/google",
        { name, email },
        { withCredentials: true },
      );
      dispatch(setUserData(result.data));
    } catch (error) {
      console.log(error);
      dispatch(setUserData(null));
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Lato:wght@300;400&display=swap');

        @keyframes authFloat {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-6px); }
        }
        @keyframes authPulse {
          0%,100% { opacity: .15; transform: scale(1); }
          50%      { opacity: .28; transform: scale(1.1); }
        }
        @keyframes authShimmer {
          0%   { transform: translateX(-120%) skewX(-12deg); }
          100% { transform: translateX(280%) skewX(-12deg); }
        }
        @keyframes authSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        .auth-card {
          position: relative;
          overflow: hidden;
          background: linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02));
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 28px;
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          box-shadow:
            0 32px 80px rgba(0,0,0,0.6),
            inset 0 1px 0 rgba(255,255,255,0.07),
            0 0 0 1px rgba(200,241,53,0.06);
        }

        .auth-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(105deg, transparent 38%, rgba(200,241,53,.04) 50%, transparent 62%);
          animation: authShimmer 5s ease-in-out infinite;
          pointer-events: none;
        }

        .auth-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(70px);
          pointer-events: none;
          animation: authPulse 6s ease-in-out infinite;
        }

        .auth-logo-ring {
          position: relative;
          width: 52px; height: 52px;
        }
        .auth-logo-ring::before {
          content: '';
          position: absolute; inset: -3px;
          border-radius: 50%;
          border: 1.5px solid transparent;
          border-top-color: #c8f135;
          border-right-color: rgba(200,241,53,.3);
          animation: authSpin 3s linear infinite;
        }
        .auth-logo-inner {
          width: 52px; height: 52px;
          border-radius: 16px;
          background: linear-gradient(135deg, #c8f135, #78a80d);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 20px rgba(200,241,53,.4);
          animation: authFloat 4s ease-in-out infinite;
        }

        .auth-highlight {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(200,241,53,0.1);
          border: 1px solid rgba(200,241,53,0.25);
          color: #c8f135;
          padding: 6px 18px 6px 12px;
          border-radius: 999px;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          white-space: nowrap;
        }

        .google-btn {
          width: 100%;
          display: flex; align-items: center; justify-content: center; gap: 12px;
          padding: 15px;
          background: #e8eaf0;
          color: #07090f;
          border: none; border-radius: 999px;
          font-family: 'Syne', sans-serif;
          font-weight: 700; font-size: .95rem;
          cursor: pointer;
          transition: transform .2s, box-shadow .2s, background .2s;
          position: relative; overflow: hidden;
        }
        .google-btn:hover {
          background: #fff;
          transform: scale(1.025);
          box-shadow: 0 8px 30px rgba(200,241,53,.2);
        }
        .google-btn:active { transform: scale(.98); }

        .auth-divider {
          display: flex; align-items: center; gap: 12px;
          margin: 24px 0;
        }
        .auth-divider span {
          font-family: 'Lato', sans-serif;
          font-size: 11px; color: #3a3f52;
          text-transform: uppercase; letter-spacing: .08em;
          white-space: nowrap;
        }
        .auth-divider::before, .auth-divider::after {
          content: ''; flex: 1;
          height: 1px; background: rgba(255,255,255,0.06);
        }
      `}</style>

      <div
        className={`w-full ${
          isModel
            ? "py-2"
            : "min-h-screen flex items-center justify-center px-6 py-20"
        }`}
        style={!isModel ? { background: "#07090f" } : {}}
      >
        <motion.div
          initial={{ opacity: 0, y: -30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
          className="auth-card"
          style={{
            width: "100%",
            maxWidth: isModel ? 420 : 460,
            padding: isModel ? "36px 36px" : "52px 48px",
          }}
        >
          {/* Blobs inside card */}
          <div
            className="auth-blob"
            style={{
              width: 200,
              height: 200,
              background: "#c8f135",
              top: "-60px",
              right: "-60px",
              opacity: 0.1,
            }}
          />
          <div
            className="auth-blob"
            style={{
              width: 140,
              height: 140,
              background: "#c8f135",
              bottom: "-40px",
              left: "-40px",
              opacity: 0.07,
              animationDelay: "2s",
            }}
          />

          <div style={{ position: "relative", zIndex: 1 }}>
            {/* Logo + Brand */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 14,
                marginBottom: 32,
              }}
            >
              <div className="auth-logo-ring">
                <div className="auth-logo-inner">
                  <BsRobot size={22} color="#07090f" />
                </div>
              </div>
              <h2
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: "1rem",
                  color: "#e8eaf0",
                  letterSpacing: "-.01em",
                  margin: 0,
                }}
              >
                Interview<span style={{ color: "#c8f135" }}>Forge</span> AI
              </h2>
            </div>

            {/* Heading */}
            <h1
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                fontSize: isModel ? "1.55rem" : "1.9rem",
                lineHeight: 1.2,
                letterSpacing: "-.025em",
                textAlign: "center",
                color: "#e8eaf0",
                marginBottom: 20,
              }}
            >
              Continue with <br />
              <span
                className="auth-highlight"
                style={{ marginTop: 10, display: "inline-flex" }}
              >
                <IoSparkles size={15} />
                Ace Your Next Interview
              </span>
            </h1>

            {/* Subtext */}
            <p
              style={{
                fontFamily: "'Lato', sans-serif",
                color: "#4a4f62",
                textAlign: "center",
                fontSize: ".9rem",
                lineHeight: 1.75,
                fontWeight: 300,
                marginBottom: 32,
              }}
            >
              Sign in to take realistic AI mock interviews, track your growth,
              identify improvement areas, and build confidence for real-world
              interviews.
            </p>

            {/* Divider */}
            <div className="auth-divider">
              <span>sign in with</span>
            </div>

            {/* Google Button */}
            <motion.button
              onClick={handleGoogleAuth}
              whileHover={{ scale: 1.025 }}
              whileTap={{ scale: 0.98 }}
              className="google-btn"
            >
              <FcGoogle size={20} />
              Continue with Google
            </motion.button>

            {/* Footer note */}
            <p
              style={{
                fontFamily: "'Lato', sans-serif",
                fontSize: "11px",
                color: "#2e3244",
                textAlign: "center",
                marginTop: 20,
                lineHeight: 1.6,
              }}
            >
              By continuing, you agree to our Terms of Service &amp; Privacy
              Policy.
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default Auth;
