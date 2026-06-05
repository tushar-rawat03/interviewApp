import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { BsCoin } from "react-icons/bs";
import { FaUserAstronaut } from "react-icons/fa";
import { HiOutlineLogout } from "react-icons/hi";
import { MdHistory } from "react-icons/md";
import axios from "axios";
import { setUserData } from "../redux/userSlice.js"; // adjust path as needed
import { ServerUrl } from "../App"; // adjust path as needed

function Navbar() {
  const { userData } = useSelector((state) => state.user);
  const [showCreditPopup, setShowCreditPopup] = useState(false);
  const [showUserPopup, setShowUserPopup] = useState(false);
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
    setShowCreditPopup((prev) => !prev);
    setShowUserPopup(false);
  };

  const toggleUser = () => {
    setShowUserPopup((prev) => !prev);
    setShowCreditPopup(false);
  };

  return (
    <div className="bg-[#0f0f11] flex justify-center px-4 pt-6 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full max-w-5xl h-fit"
      >
        {/* Navbar */}
        <div className="bg-white/[0.06] border border-white/[0.12] backdrop-blur-md rounded-[20px] px-6 py-3.5 flex justify-between items-center relative">
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center flex-shrink-0">
              <svg className="w-[18px] h-[18px] fill-white" viewBox="0 0 24 24">
                <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2zM9 14a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm6 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" />
              </svg>
            </div>
            <h1 className="font-semibold text-white hidden md:block text-[15px] tracking-tight">
              Interview<span className="text-amber-400">IQ</span>.AI
            </h1>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2.5">
            {/* Credits */}
            <div className="relative">
              <button
                onClick={toggleCredit}
                className="flex items-center gap-2 bg-amber-400/10 border border-amber-400/30 hover:bg-amber-400/20 hover:border-amber-400/50 transition-all duration-200 text-amber-400 text-[13px] font-medium px-3 py-1.5 rounded-[10px]"
              >
                <BsCoin size={15} />
                <span>{userData?.credits ?? 0}</span>
              </button>

              <AnimatePresence>
                {showCreditPopup && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-3 w-[210px] bg-[#1e1e26] border border-white/10 rounded-[14px] p-4 z-50 shadow-[0_16px_40px_rgba(0,0,0,0.5)]"
                  >
                    <p className="text-[12.5px] text-white/50 leading-relaxed mb-3">
                      Running low? Upgrade to keep acing your interviews.
                    </p>
                    <button
                      onClick={() => navigate("/pricing")}
                      className="w-full bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 font-semibold text-[13px] py-2 rounded-[10px] hover:from-amber-300 hover:to-amber-400 transition-all"
                    >
                      Buy more credits →
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Avatar */}
            <div className="relative">
              <button
                onClick={toggleUser}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 border border-white/20 hover:bg-white/[0.18] hover:border-white/35 transition-all duration-200 text-white font-semibold text-sm"
              >
                {userData ? (
                  userData.name.slice(0, 1).toUpperCase()
                ) : (
                  <FaUserAstronaut size={16} />
                )}
              </button>

              <AnimatePresence>
                {showUserPopup && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-3 w-[185px] bg-[#1e1e26] border border-white/10 rounded-[14px] overflow-hidden z-50 shadow-[0_16px_40px_rgba(0,0,0,0.5)]"
                  >
                    <div className="px-4 py-3 border-b border-white/[0.08]">
                      <p className="text-[13.5px] text-blue-400 font-semibold leading-tight">
                        {userData?.name}
                      </p>
                      <p className="text-[11.5px] text-white/35 mt-0.5">
                        {userData?.email}
                      </p>
                    </div>

                    <button
                      onClick={() => navigate("/history")}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-white/70 hover:text-white hover:bg-white/[0.06] transition-all text-left"
                    >
                      <MdHistory size={15} />
                      Interview History
                    </button>

                    <div className="h-px bg-white/[0.08]" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-red-400 hover:text-red-300 hover:bg-red-400/[0.08] transition-all text-left"
                    >
                      <HiOutlineLogout size={15} />
                      Log out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Navbar;
