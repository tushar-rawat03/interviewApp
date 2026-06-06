import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { BsCoin } from "react-icons/bs";
import { FaUserAstronaut } from "react-icons/fa";
import { HiOutlineLogout } from "react-icons/hi";
import { MdHistory } from "react-icons/md";
import axios from "axios";
import { setUserData } from "../redux/userSlice.js";
import { ServerUrl } from "../App";
import AuthModel from "./AuthModel.jsx";

function Navbar() {
  const { userData } = useSelector((state) => state.user);
  const [showCreditPopup, setShowCreditPopup] = useState(false);
  const [showUserPopup, setShowUserPopup] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await axios.get(ServerUrl + "/api/auth/logout", {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      setShowCreditPopup(false);
      setShowUserPopup(false);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const toggleCredit = () => {
    if (!userData) {
      setShowAuth(true);
      return;
    }
    setShowCreditPopup((prev) => !prev);
    setShowUserPopup(false);
  };

  const toggleUser = () => {
    if (!userData) {
      setShowAuth(true);
      return;
    }
    setShowUserPopup((prev) => !prev);
    setShowCreditPopup(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Lato:wght@300;400&display=swap');

        .nav-root {
          position: sticky;
          top: 0;
          z-index: 100;
          display: flex;
          justify-content: center;
          padding: 18px 20px 0;
          background: transparent;
        }

        .nav-bar {
          width: 100%;
          max-width: 900px;
          background: rgba(15, 17, 23, 0.75);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 12px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06);
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          text-decoration: none;
        }
        .nav-logo-icon {
          width: 36px; height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #c8f135, #78a80d);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 0 18px rgba(200,241,53,0.35);
        }
        .nav-logo-text {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 15px;
          letter-spacing: -.02em;
          color: #e8eaf0;
        }
        .nav-logo-text span { color: #c8f135; }

        .nav-right { display: flex; align-items: center; gap: 10px; }

        /* Credit button */
        .credit-btn {
          display: flex; align-items: center; gap: 7px;
          background: rgba(200,241,53,0.08);
          border: 1px solid rgba(200,241,53,0.2);
          color: #c8f135;
          font-family: 'Syne', sans-serif;
          font-size: 13px; font-weight: 600;
          padding: 7px 14px;
          border-radius: 10px;
          cursor: pointer;
          transition: background .2s, border-color .2s, box-shadow .2s;
        }
        .credit-btn:hover {
          background: rgba(200,241,53,0.14);
          border-color: rgba(200,241,53,0.4);
          box-shadow: 0 0 14px rgba(200,241,53,0.15);
        }

        /* Avatar button */
        .avatar-btn {
          width: 36px; height: 36px;
          border-radius: 50%;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          color: #e8eaf0;
          font-family: 'Syne', sans-serif;
          font-weight: 700; font-size: 13px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: background .2s, border-color .2s;
        }
        .avatar-btn:hover {
          background: rgba(200,241,53,0.1);
          border-color: rgba(200,241,53,0.3);
          color: #c8f135;
        }

        /* Dropdown shared */
        .nav-dropdown {
          position: absolute;
          right: 0;
          top: calc(100% + 10px);
          background: rgba(13,15,20,0.96);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          z-index: 200;
          box-shadow: 0 20px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05);
          overflow: hidden;
          backdrop-filter: blur(20px);
        }

        /* Credit dropdown */
        .credit-dropdown { width: 220px; padding: 18px; }
        .credit-dropdown p {
          font-family: 'Lato', sans-serif;
          font-size: 12.5px; color: #5a5f72;
          line-height: 1.6; margin: 0 0 14px;
        }
        .credit-dropdown button {
          width: 100%;
          background: #c8f135; color: #07090f;
          border: none; border-radius: 10px;
          padding: 9px; font-family: 'Syne', sans-serif;
          font-weight: 700; font-size: 13px;
          cursor: pointer; transition: opacity .2s, box-shadow .2s;
        }
        .credit-dropdown button:hover {
          opacity: .9;
          box-shadow: 0 0 18px rgba(200,241,53,0.35);
        }

        /* User dropdown */
        .user-dropdown { width: 195px; }
        .user-dropdown-header {
          padding: 14px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .user-dropdown-header .uname {
          font-family: 'Syne', sans-serif;
          font-size: 13.5px; font-weight: 700;
          color: #c8f135; line-height: 1.2;
        }
        .user-dropdown-header .uemail {
          font-family: 'Lato', sans-serif;
          font-size: 11px; color: #3a3f52; margin-top: 3px;
        }
        .dropdown-row {
          width: 100%; display: flex; align-items: center; gap: 10px;
          padding: 10px 16px;
          font-family: 'Lato', sans-serif; font-size: 13px;
          background: transparent; border: none; cursor: pointer;
          text-align: left; transition: background .15s, color .15s;
          color: #8a8fa8;
        }
        .dropdown-row:hover { background: rgba(255,255,255,0.04); color: #e8eaf0; }
        .dropdown-row.danger { color: #f87171; }
        .dropdown-row.danger:hover { background: rgba(248,113,113,0.07); color: #fca5a5; }
        .dropdown-divider { height: 1px; background: rgba(255,255,255,0.05); }
      `}</style>

      <div className="nav-root">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          style={{ width: "100%", maxWidth: 900 }}
        >
          <div className="nav-bar">
            {/* ── Logo ── */}
            <div className="nav-logo" onClick={() => navigate("/")}>
              <div className="nav-logo-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#07090f">
                  <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2zM9 14a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm6 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" />
                </svg>
              </div>
              <span className="nav-logo-text hidden md:block">
                Interview<span>IQ</span>.AI
              </span>
            </div>

            {/* ── Right controls ── */}
            <div className="nav-right">
              {/* Credits */}
              <div style={{ position: "relative" }}>
                <button className="credit-btn" onClick={toggleCredit}>
                  <BsCoin size={14} />
                  <span>{userData?.credits ?? 0}</span>
                </button>

                <AnimatePresence>
                  {showCreditPopup && (
                    <motion.div
                      className="nav-dropdown credit-dropdown"
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                    >
                      <p>Running low? Upgrade to keep acing your interviews.</p>
                      <button onClick={() => navigate("/pricing")}>
                        Buy more credits →
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Avatar */}
              <div style={{ position: "relative" }}>
                <button className="avatar-btn" onClick={toggleUser}>
                  {userData ? (
                    userData.name.slice(0, 1).toUpperCase()
                  ) : (
                    <FaUserAstronaut size={15} />
                  )}
                </button>

                <AnimatePresence>
                  {showUserPopup && (
                    <motion.div
                      className="nav-dropdown user-dropdown"
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                    >
                      <div className="user-dropdown-header">
                        <div className="uname">{userData?.name}</div>
                        <div className="uemail">{userData?.email}</div>
                      </div>

                      <button
                        className="dropdown-row"
                        onClick={() => navigate("/history")}
                      >
                        <MdHistory size={15} /> Interview History
                      </button>

                      <div className="dropdown-divider" />

                      <button
                        className="dropdown-row danger"
                        onClick={handleLogout}
                      >
                        <HiOutlineLogout size={15} /> Log out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}
    </>
  );
}

export default Navbar;
