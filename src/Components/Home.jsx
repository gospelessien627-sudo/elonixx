import React from 'react'
import "./Home.css"
import {
  FaArrowRight,
  FaClock,
  FaE,
  FaF,
  FaGreaterThan,
  FaShield,
  FaShieldHeart,
  FaStar,
  FaStarAndCrescent,
  FaStarHalfStroke,
  FaStarOfDavid
} from 'react-icons/fa6'
import { useNavigate } from "react-router-dom"

const API_URL = "https://api.elonixx.com";

const Home = () => {

  const navigate = useNavigate();

  const put = () => {
    navigate("/dashboard");
  };

  return (
    <div className='love'>

      <div className="brot">

        <div className="poe">
          <div className="loip">
            <h3><FaE /></h3>
          </div>

          <div className="kill">
            <h3>ElonixWallet</h3>
          </div>
        </div>

        <div className="opo">
          <h5>
            <FaShieldHeart /> Secure Link • Encrypted
          </h5>
        </div>

      </div>

      <div className="gogp">

        <h1>E</h1>

        <div className="flowq">
          <span>
            <FaStarOfDavid />
          </span>
        </div>

        <div className="wel">
          <h3>ElonixWallet</h3>

          <div className="gjh">
            <h5>Secure Wallet & Payments</h5>
          </div>
        </div>

        <div className="pwr">

          <div className="block">
            <h5>BALANCE</h5>
            <span>$ 245k</span>
          </div>

          <div className="mong">
            <h5>PAYOUTS</h5>
            <span>Instant</span>
          </div>

          <div className="oo">
            <h5>SECURE</h5>
            <span>256-bit</span>
          </div>

        </div>

        <div className="ii">

          <div className="off">
            <button onClick={put}>
              Tap to open Dashboard <FaArrowRight />
            </button>
          </div>

          <div className='access'>
            <p>
              <FaClock /> Link expires in 24hr • One-tap access
            </p>
          </div>

        </div>

      </div>

      <div className="iop">
        <button onClick={put}>
          Elonixwallet.link/
          <span>
            Elonixwallet-dashboard <FaGreaterThan />
          </span>
        </button>
      </div>

      <div className="fiver">
        <p>
          Powered by <span>ElonixWallet</span> • Built for business payouts
        </p>
      </div>

    </div>
  )
}

export default Home