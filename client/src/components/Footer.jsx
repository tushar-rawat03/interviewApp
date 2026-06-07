import { BsRobot } from "react-icons/bs";

function Footer() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Lato:wght@300;400&display=swap');

        @keyframes footerShimmer {
          0%   { transform: translateX(-120%) skewX(-12deg); }
          100% { transform: translateX(280%) skewX(-12deg); }
        }
        @keyframes footerPulse {
          0%,100% { opacity: .1; transform: scale(1); }
          50%      { opacity: .18; transform: scale(1.08); }
        }

        .footer-root {
          background: #07090f;
          display: flex;
          justify-content: center;
          padding: 24px 20px 36px;
          position: relative;
          z-index: 1;
        }

        .footer-card {
          width: 100%;
          max-width: 900px;
          position: relative;
          overflow: hidden;
          background: linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015));
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 24px;
          padding: 36px 32px;
          text-align: center;
          box-shadow:
            0 0 0 1px rgba(200,241,53,0.05),
            inset 0 1px 0 rgba(255,255,255,0.06);
          backdrop-filter: blur(12px);
        }

        .footer-card::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(105deg, transparent 38%, rgba(200,241,53,.04) 50%, transparent 62%);
          animation: footerShimmer 6s ease-in-out infinite;
          pointer-events: none;
        }

        .footer-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          pointer-events: none;
          animation: footerPulse 7s ease-in-out infinite;
        }

        .footer-logo-icon {
          width: 40px; height: 40px;
          border-radius: 12px;
          background: linear-gradient(135deg, #c8f135, #78a80d);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 0 16px rgba(200,241,53,0.35);
        }

        .footer-brand {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 15px;
          letter-spacing: -.02em;
          color: #e8eaf0;
          margin: 0;
        }
        .footer-brand span { color: #c8f135; }

        .footer-divider {
          width: 40px; height: 1px;
          background: rgba(200,241,53,0.2);
          margin: 18px auto;
        }

        .footer-desc {
          font-family: 'Lato', sans-serif;
          font-weight: 400;
          font-size: .92rem;
          color: #9ea3b8;        /* ✅ was #3a3f52 — now visible */
          max-width: 460px;
          margin: 0 auto 20px;
          line-height: 1.75;
        }

        .footer-copy {
          font-family: 'Lato', sans-serif;
          font-size: 11px;
          color: #555a6e;        /* ✅ was #252830 — now visible */
          letter-spacing: .04em;
          margin: 0;
        }

        .footer-tags {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }

        .footer-tag {
          font-family: 'Syne', sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .1em;
          text-transform: uppercase;
          color: #7a8099;        /* ✅ was #2e3548 — now visible */
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 4px 12px;
          border-radius: 999px;
          transition: color .2s, border-color .2s;
        }
        .footer-tag:hover {
          color: #c8f135;
          border-color: rgba(200,241,53,0.3);
        }
      `}</style>

      <div className="footer-root">
        <div className="footer-card">
          <div
            className="footer-blob"
            style={{
              width: 180,
              height: 180,
              background: "#c8f135",
              bottom: "-60px",
              left: "-40px",
              opacity: 0.08,
            }}
          />
          <div
            className="footer-blob"
            style={{
              width: 120,
              height: 120,
              background: "#c8f135",
              top: "-30px",
              right: "-20px",
              opacity: 0.06,
              animationDelay: "2.5s",
            }}
          />

          <div style={{ position: "relative", zIndex: 1 }}>
            {/* Logo */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                marginBottom: 6,
              }}
            >
              <div className="footer-logo-icon">
                <BsRobot size={18} color="#07090f" />
              </div>
              <h2 className="footer-brand">
                Interview<span>IQ</span>.AI
              </h2>
            </div>

            <div className="footer-divider" />

            {/* Tags */}
            <div className="footer-tags">
              {[
                "AI Interviews",
                "Voice Analysis",
                "Tech Roles",
                "HR Prep",
                "Credits System",
              ].map((t) => (
                <span key={t} className="footer-tag">
                  {t}
                </span>
              ))}
            </div>

            {/* Description */}
            <p className="footer-desc">
              AI-powered interview preparation platform designed to improve
              communication skills, technical depth and professional confidence.
            </p>

            {/* Copyright */}
            <p className="footer-copy">
              © {new Date().getFullYear()} InterviewIQ.AI — All rights reserved
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Footer;
