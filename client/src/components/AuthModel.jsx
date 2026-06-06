import { useSelector } from "react-redux";
import { FaTimes } from "react-icons/fa";
import Auth from "../pages/Auth";
import { useEffect } from "react";

function AuthModel({ onClose }) {
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    if (userData) {
      onClose();
    }
  }, [userData, onClose]);

  return (
    <>
      <style>{`
        @keyframes backdropIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(.95) translateY(16px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }

        .auth-modal-backdrop {
          position: fixed; inset: 0; z-index: 999;
          display: flex; align-items: center; justify-content: center;
          padding: 16px;
          background: rgba(0,0,0,0.75);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          animation: backdropIn .2s ease;
        }

        .auth-modal-wrap {
          position: relative;
          width: 100%; max-width: 440px;
          animation: modalIn .35s cubic-bezier(.23,1,.32,1);
        }

        .auth-close-btn {
          position: absolute;
          top: 14px; right: 14px;
          z-index: 10;
          width: 32px; height: 32px;
          border-radius: 10px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.4);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: background .2s, color .2s, border-color .2s;
        }
        .auth-close-btn:hover {
          background: rgba(200,241,53,0.1);
          border-color: rgba(200,241,53,0.25);
          color: #c8f135;
        }
      `}</style>

      <div
        className="auth-modal-backdrop"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="auth-modal-wrap">
          <button className="auth-close-btn" onClick={onClose}>
            <FaTimes size={12} />
          </button>
          <Auth isModel={true} />
        </div>
      </div>
    </>
  );
}

export default AuthModel;
