import { useState } from "react";
import axios from "axios";
import { FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "motion/react";
import { ServerUrl } from "../App";
import { setUserData } from "../redux/userSlice";

function Pricing() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const [selectedPlan, setSelectedPlan] = useState("free");
  const [loadingPlan, setLoadingPlan] = useState(null);

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "₹0",
      credits: 100,
      description: "Perfect for beginners starting interview preparation.",
      features: [
        "100 AI Interview Credits",
        "Basic Performance Report",
        "Voice Interview Access",
        "Limited History Tracking",
      ],
      default: true,
    },
    {
      id: "basic",
      name: "Starter Pack",
      price: "₹100",
      credits: 150,
      description: "Great for focused practice and skill improvement.",
      features: [
        "150 AI Interview Credits",
        "Detailed Feedback",
        "Performance Analytics",
        "Full Interview History",
      ],
    },
    {
      id: "pro",
      name: "Pro Pack",
      price: "₹500",
      credits: 650,
      description: "Best value for serious job preparation.",
      features: [
        "650 AI Interview Credits",
        "Advanced AI Feedback",
        "Skill Trend Analysis",
        "Priority AI Processing",
      ],
      badge: "Best Value",
    },
  ];

  const handlePayment = async (plan) => {
    try {
      setLoadingPlan(plan.id);

      const amount = plan.id === "basic" ? 100 : plan.id === "pro" ? 500 : 0;

      const result = await axios.post(
        ServerUrl + "/api/payment/order",
        { planId: plan.id, amount, credits: plan.credits },
        { withCredentials: true },
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: result.data.amount,
        currency: "INR",
        name: "InterviewIQ.AI",
        description: `${plan.name} - ${plan.credits} Credits`,
        order_id: result.data.id,
        handler: async (response) => {
          try {
            const verifypay = await axios.post(
              ServerUrl + "/api/payment/verify",
              response,
              { withCredentials: true },
            );
            dispatch(
              setUserData({ ...userData, credits: verifypay.data.credits }),
            );
            alert("Payment Successful! Credits Added.");
            navigate("/");
          } catch (err) {
            console.error("Verification failed:", err);
            alert("Payment verification failed. Please contact support.");
          }
        },
        theme: { color: "#c8f135" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Lato:wght@300;400&display=swap');

        @keyframes pricingPulse {
          0%,100% { opacity: .12; transform: scale(1); }
          50%      { opacity: .22; transform: scale(1.07); }
        }

        .pricing-root {
          min-height: 100vh;
          background: #07090f;
          padding: 48px 16px;
          font-family: 'Syne', sans-serif;
          position: relative;
          overflow: hidden;
        }

        .pricing-blob {
          position: fixed;
          border-radius: 50%;
          filter: blur(100px);
          pointer-events: none;
          animation: pricingPulse 7s ease-in-out infinite;
        }

        .pricing-container {
          max-width: 1100px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .pricing-back-btn {
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
        .pricing-back-btn:hover {
          background: rgba(200,241,53,0.08);
          border-color: rgba(200,241,53,0.25);
          color: #c8f135;
        }

        .pricing-title {
          font-weight: 800; font-size: 2rem;
          letter-spacing: -.025em; color: #e8eaf0;
          margin: 0 0 8px; text-align: center;
        }
        .pricing-subtitle {
          font-family: 'Lato', sans-serif;
          font-size: .95rem; color: #5a5f72;
          margin: 0; text-align: center;
        }

        .pricing-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
          margin-top: 48px;
        }
        @media (min-width: 768px) {
          .pricing-grid { grid-template-columns: repeat(3, 1fr); }
        }

        .pricing-card {
          position: relative;
          background: linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015));
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 24px;
          padding: 32px;
          transition: border-color .25s, box-shadow .25s, transform .25s;
        }
        .pricing-card.selected {
          border-color: rgba(200,241,53,0.4);
          box-shadow: 0 0 40px rgba(200,241,53,0.1);
        }
        .pricing-card.clickable { cursor: pointer; }
        .pricing-card.clickable:hover {
          border-color: rgba(200,241,53,0.2);
          transform: translateY(-4px);
        }

        .pricing-badge {
          position: absolute;
          top: 20px; right: 20px;
          background: #c8f135; color: #07090f;
          font-family: 'Syne', sans-serif;
          font-size: .7rem; font-weight: 700;
          letter-spacing: .08em; text-transform: uppercase;
          padding: 4px 12px; border-radius: 999px;
        }
        .pricing-default-tag {
          position: absolute;
          top: 20px; right: 20px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          color: #5a5f72;
          font-family: 'Syne', sans-serif;
          font-size: .7rem; font-weight: 700;
          letter-spacing: .06em; text-transform: uppercase;
          padding: 4px 12px; border-radius: 999px;
        }

        .pricing-plan-name {
          font-weight: 700; font-size: 1.05rem;
          color: #e8eaf0; margin: 0 0 16px;
        }
        .pricing-price {
          font-weight: 800; font-size: 2rem;
          color: #c8f135; margin: 0;
          letter-spacing: -.02em;
        }
        .pricing-credits {
          font-family: 'Lato', sans-serif;
          font-size: .85rem; color: #5a5f72;
          margin: 4px 0 0;
        }
        .pricing-desc {
          font-family: 'Lato', sans-serif;
          font-size: .85rem; color: #4a4f62;
          line-height: 1.65; margin: 16px 0 0;
        }

        .pricing-features {
          margin-top: 24px;
          display: flex; flex-direction: column; gap: 12px;
        }
        .pricing-feature {
          display: flex; align-items: center; gap: 10px;
          font-family: 'Lato', sans-serif;
          font-size: .88rem; color: #9ea3b8;
        }
        .pricing-feature-icon { color: #c8f135; flex-shrink: 0; }

        .pricing-btn {
          width: 100%;
          margin-top: 28px;
          padding: 14px;
          border-radius: 14px;
          font-family: 'Syne', sans-serif;
          font-weight: 700; font-size: .9rem;
          cursor: pointer; border: none;
          transition: transform .2s, box-shadow .2s, opacity .2s;
        }
        .pricing-btn.selected-btn {
          background: #c8f135; color: #07090f;
        }
        .pricing-btn.selected-btn:hover:not(:disabled) {
          transform: scale(1.01);
          box-shadow: 0 0 24px rgba(200,241,53,0.3);
        }
        .pricing-btn.unselected-btn {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          color: #9ea3b8;
        }
        .pricing-btn.unselected-btn:hover {
          background: rgba(200,241,53,0.08);
          border-color: rgba(200,241,53,0.2);
          color: #c8f135;
        }
        .pricing-btn:disabled {
          opacity: .5; cursor: not-allowed; transform: none;
        }
      `}</style>

      {/* Background blobs */}
      <div
        className="pricing-blob"
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
        className="pricing-blob"
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

      <div className="pricing-root">
        <div className="pricing-container">
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 16,
              marginBottom: 8,
            }}
          >
            <button onClick={() => navigate("/")} className="pricing-back-btn">
              <FaArrowLeft size={15} />
            </button>
            <div style={{ flex: 1 }}>
              <h1 className="pricing-title">Choose Your Plan</h1>
              <p className="pricing-subtitle">
                Flexible pricing to match your interview preparation goals.
              </p>
            </div>
          </div>

          {/* Plans grid */}
          <div className="pricing-grid">
            {plans.map((plan) => {
              const isSelected = selectedPlan === plan.id;

              return (
                <motion.div
                  key={plan.id}
                  whileHover={!plan.default ? { scale: 1.02 } : {}}
                  onClick={() => !plan.default && setSelectedPlan(plan.id)}
                  className={`pricing-card ${isSelected ? "selected" : ""} ${
                    !plan.default ? "clickable" : ""
                  }`}
                >
                  {plan.badge && (
                    <div className="pricing-badge">{plan.badge}</div>
                  )}

                  {plan.default && (
                    <div className="pricing-default-tag">Default</div>
                  )}

                  <h3 className="pricing-plan-name">{plan.name}</h3>
                  <p className="pricing-price">{plan.price}</p>
                  <p className="pricing-credits">{plan.credits} Credits</p>
                  <p className="pricing-desc">{plan.description}</p>

                  <div className="pricing-features">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="pricing-feature">
                        <FaCheckCircle
                          size={13}
                          className="pricing-feature-icon"
                        />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {!plan.default && (
                    <button
                      disabled={loadingPlan === plan.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isSelected) {
                          setSelectedPlan(plan.id);
                        } else {
                          handlePayment(plan);
                        }
                      }}
                      className={`pricing-btn ${
                        isSelected ? "selected-btn" : "unselected-btn"
                      }`}
                    >
                      {loadingPlan === plan.id
                        ? "Processing..."
                        : isSelected
                          ? "Proceed to Pay"
                          : "Select Plan"}
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default Pricing;
