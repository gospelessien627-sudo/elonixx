import React from "react";
import { useState, useRef } from "react";
import "./Dashboard.css";

import {
  FaArrowDown,
  FaArrowLeft,
  FaArrowRight,
  FaArrowUp,
  FaBell,
  FaBuilding,
  FaBuildingColumns,
  FaCalendar,
  FaCircleCheck,
  FaCircleInfo,
  FaClock,
  FaCoins,
  FaCreditCard,
  FaEllipsis,
  FaFileLines,
  FaGreaterThan,
  FaHeadset,
  FaLaptop,
  FaNewspaper,
  FaPaypal,
  FaPlus,
  FaRegCircle,
  FaShield,
  FaShieldHalved,
  FaShieldHeart,
  FaUser,
  FaWallet,
  FaXmark,
  FaArrowTrendUp,
  FaE,
} from "react-icons/fa6";

const Dashboard = () => {
  /* =========================================
     POPUP STATES
  ========================================= */

  const [cart, setCart] = useState(false);
  const [pay, setPay] = useState(false);
  const [tro, setTro] = useState(false);
  const [rit, setRit] = useState(false);
  const [vert, setVert] = useState(false);

  /* =========================================
     ACCOUNT STATES
  ========================================= */

  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [tacCode, setTacCode] = useState("");

  /* =========================================
     TRANSACTION DATA
  ========================================= */

  const [transactionData, setTransactionData] = useState({
    transactionId: "",
    requestedOn: "",
    paymentMethod: "",
    accountNumber: "",
    accountName: "",
  });

  /* =========================================
     WITHDRAWAL STATES
  ========================================= */

  const [withdrawalAmount, setWithdrawalAmount] =
    useState("");

  const [selectedBank, setSelectedBank] =
    useState("");

  /* =========================================
     LOADING STATE
  ========================================= */

  const [loadingButton, setLoadingButton] =
    useState("");

  /* =========================================
     BANK DETAILS
  ========================================= */

  const bankDetails = {
    Paypal: {
      accountTitle: "Paypal Account",
      accountHolder: "FinWallet Ltd - Paypal",
    },

    Cashapp: {
      accountTitle: "Cashapp Account",
      accountHolder: "FinWallet Ltd - Cashapp",
    },

    Barclays: {
      accountTitle: "Barclays Account",
      accountHolder: "FinWallet Ltd - Barclays",
    },

    Citibank: {
      accountTitle: "Citibank Account",
      accountHolder: "FinWallet Ltd - Citibank",
    },
  };

  const selectedAccount =
    bankDetails[selectedBank];

  /* =========================================
     CURRENT USER
  ========================================= */

  const [currentUser] = useState(() => {
    const savedUser =
      localStorage.getItem(
        "finwalletCurrentUser"
      );

    return savedUser
      ? JSON.parse(savedUser)
      : null;
  });

  /* =========================================
     OTP / TAC STATES
  ========================================= */

  const [otp, setOtp] = useState(
    new Array(4).fill("")
  );

  const inputsRef = useRef([]);

  const [tacError, setTacError] =
    useState("");

  /* =========================================
     SPINNER COMPONENT
  ========================================= */

  const LoadingSpinner = () => (
    <span
      className="dashboard-loading-spinner"
      aria-hidden="true"
    />
  );

  /* =========================================
     GENERATE TRANSACTION ID
  ========================================= */

  const generateTransactionId = () => {
    const now = new Date();

    const year =
      now.getFullYear();

    const month = String(
      now.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      now.getDate()
    ).padStart(2, "0");

    const randomNumber =
      Math.floor(
        100000 +
          Math.random() * 900000
      );

    return `WD${year}${month}${day}${randomNumber}`;
  };

  /* =========================================
     REQUESTED DATE
  ========================================= */

  const getRequestedDate = () => {
    const now = new Date();

    return now.toLocaleString(
      "en-US",
      {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }
    );
  };

  /* =========================================
     MAIN WITHDRAW BUTTON
  ========================================= */

  const handleOpenWithdraw =
    async () => {
      if (loadingButton) return;

      setLoadingButton(
        "withdraw"
      );

      try {
        await new Promise(
          (resolve) =>
            setTimeout(
              resolve,
              800
            )
        );

        setCart(true);
      } finally {
        setLoadingButton("");
      }
    };

  /* =========================================
     CONFIRM WITHDRAWAL
  ========================================= */

  const handleConfirmWithdrawal =
    async () => {
      if (loadingButton) return;

      if (!selectedBank) {
        alert(
          "Please select a withdrawal account"
        );

        return;
      }

      setLoadingButton(
        "confirm-withdrawal"
      );

      try {
        await new Promise(
          (resolve) =>
            setTimeout(
              resolve,
              1000
            )
        );

        setCart(false);
        setPay(true);
      } finally {
        setLoadingButton("");
      }
    };

  /* =========================================
     CONFIRM ACCOUNT DETAILS
  ========================================= */

  const handleConfirm =
    async () => {
      if (loadingButton) return;

      if (!accountNumber.trim()) {
        alert(
          "Please enter the account number"
        );

        return;
      }

      if (!accountName.trim()) {
        alert(
          "Please enter the account name"
        );

        return;
      }

      setLoadingButton(
        "confirm"
      );

      try {
        await new Promise(
          (resolve) =>
            setTimeout(
              resolve,
              1000
            )
        );

        const newTransaction = {
          transactionId:
            generateTransactionId(),

          requestedOn:
            getRequestedDate(),

          paymentMethod:
            "Bank Transfer",

          accountNumber:
            accountNumber.trim(),

          accountName:
            accountName.trim(),
        };

        setTransactionData(
          newTransaction
        );

        setPay(false);
        setTro(true);
      } finally {
        setLoadingButton("");
      }
    };

  /* =========================================
     VIEW WITHDRAWAL STATUS
  ========================================= */

  const handleViewWithdrawalStatus =
    async () => {
      if (loadingButton) return;

      if (
        !withdrawalAmount ||
        Number(withdrawalAmount) <= 0
      ) {
        alert(
          "Please enter an amount to withdraw"
        );

        return;
      }

      setLoadingButton(
        "view-status"
      );

      try {
        await new Promise(
          (resolve) =>
            setTimeout(
              resolve,
              1000
            )
        );

        setTro(false);
        setRit(true);
      } finally {
        setLoadingButton("");
      }
    };

  /* =========================================
     STATUS SCREEN WITHDRAW
  ========================================= */

  const handleStatusWithdraw =
    async () => {
      if (loadingButton) return;

      setLoadingButton(
        "status-withdraw"
      );

      try {
        await new Promise(
          (resolve) =>
            setTimeout(
              resolve,
              1000
            )
        );

        setVert(true);
      } finally {
        setLoadingButton("");
      }
    };

  /* =========================================
     OTP CHANGE
  ========================================= */

  const handleOtpChange = (
    e,
    index
  ) => {
    const value =
      e.target.value;

    if (isNaN(value)) return;

    const newOtp = [...otp];

    newOtp[index] =
      value.substring(
        value.length - 1
      );

    setOtp(newOtp);

    setTacError("");

    setTacCode(
      newOtp.join("")
    );

    if (
      value &&
      index < 3 &&
      inputsRef.current[
        index + 1
      ]
    ) {
      inputsRef.current[
        index + 1
      ].focus();
    }
  };

  /* =========================================
     OTP BACKSPACE
  ========================================= */

  const handleOtpKeyDown = (
    e,
    index
  ) => {
    if (
      e.key ===
        "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      inputsRef.current[
        index - 1
      ].focus();
    }
  };

  /* =========================================
     VERIFY TAC
  ========================================= */

  const handleVerifyTac =
    async () => {
      if (loadingButton) return;

      const enteredCode =
        otp.join("");

      if (!enteredCode) {
        setTacError(
          "Please input your TAC code"
        );

        return;
      }

      if (
        enteredCode.length < 4 ||
        otp.includes("")
      ) {
        setTacError(
          "Please enter complete 4-digit TAC code"
        );

        return;
      }

      setLoadingButton(
        "verify-tac"
      );

      try {
        /*
          Replace this delay with your legitimate
          backend TAC/transaction verification
          request when your API is ready.
        */

        await new Promise(
          (resolve) =>
            setTimeout(
              resolve,
              1200
            )
        );

        console.log(
          "TAC submitted for verification:",
          enteredCode
        );

        setVert(false);

        setOtp(
          new Array(4).fill("")
        );

        setTacCode("");

        setTacError("");
      } finally {
        setLoadingButton("");
      }
    };

  return (
    <div className="love">

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="nn">

        <div className="poe">

          <div className="lope">
            <h3>
              <FaE />
            </h3>
          </div>

          <div className="kill">

            <h3>
              ElonixxWallet
            </h3>

            <p>
              Tap to edit
            </p>

          </div>

        </div>

        <div className="lke">

          <div className="frt">

            <div className="fy">
              <FaBell />
            </div>

            <div className="llq"></div>

          </div>

          <div className="physiu">
            <h5>
              SO
            </h5>
          </div>

        </div>

      </div>

      {/* =====================================
          BALANCE
      ===================================== */}

      <div className="pawap">

        <div className="bob">

          <div className="beli">

            <div className="flioe">

              <span>
                <FaCoins />
              </span>

              <h4>
                {currentUser
                  ? `Hi, ${currentUser.name}`
                  : "welcome"}
              </h4>

            </div>

            <h2>
              $ 000,000.00
            </h2>

            <p>
              <FaArrowTrendUp
                className="hhh"
              />
              +12.5% this month
            </p>

          </div>

          <div>
            <span>
              <FaEllipsis
                className="yy"
              />
            </span>
          </div>

        </div>

        <div className="pw">

          {/* DEPOSIT HAS NO SPINNER */}

          <button
            type="button"
          >
            Deposit
          </button>

          {/* MAIN WITHDRAW */}

          <button
            type="button"
            disabled={
              loadingButton ===
              "withdraw"
            }
            onClick={
              handleOpenWithdraw
            }
          >
            {loadingButton ===
            "withdraw" ? (
              <>
                Opening
                <LoadingSpinner />
              </>
            ) : (
              "Withdraw"
            )}
          </button>

        </div>

        <div className="fgtu">

          <div>
            <FaShieldHeart />
          </div>

          <div>
            <p>
              Funds secured •
              instant settlement •
              256-bit SSL
            </p>
          </div>

        </div>

      </div>

      {/* =====================================
          STATISTICS
      ===================================== */}

      <div className="crut">

        <div className="flrq">

          <span>
            DEPOSITED
          </span>

          <h4>
            $ 415,000.00
          </h4>

          <p className="gi">
            +8.2%
            <FaArrowUp
              className="kew"
            />
          </p>

        </div>

        <div className="flrq">

          <span>
            WITHDRAWN
          </span>

          <h4>
            $ 415,000.00
          </h4>

          <p>
            2 accounts
          </p>

        </div>

        <div className="flrq">

          <span>
            TRANSACTIONS
          </span>

          <h4>
            28
          </h4>

          <p>
            Last 30 days
          </p>

        </div>

      </div>

      {/* =====================================
          RECENT TRANSACTIONS
      ===================================== */}

      <div className="hyq">

        <div className="gq">

          <h2>
            Recent Transactions
          </h2>

          <div className="dd">

            <h4>
              View all
              <FaGreaterThan />
            </h4>

          </div>

        </div>

        <div className="owl"></div>

        <div className="poiw">

          <div className="cvb">

            <div className="frd">
              <FaArrowDown />
            </div>

            <div>
              <h5>
                P...
              </h5>

              <span>
                Today, 9:41 AM
              </span>
            </div>

          </div>

          <div className="vivi">

            <div className="gio">
              <span>
                <FaCircleCheck />
              </span>
            </div>

            <div>
              <h6>
                Success
              </h6>
            </div>

          </div>

          <div className="pore">

            <h3>
              +$50,000.00
            </h3>

            <h5>
              Cashapp
            </h5>

          </div>

        </div>

        <div className="owl"></div>

        <div className="poiw">

          <div className="cvd">

            <div className="frb">
              <FaArrowUp />
            </div>

            <div>
              <h5>
                T...
              </h5>

              <span>
                Yesterday, 4:12 PM
              </span>
            </div>

          </div>

          <div className="vivi">

            <div className="gio">
              <span>
                <FaCircleCheck />
              </span>
            </div>

            <div>
              <h6>
                Success
              </h6>
            </div>

          </div>

          <div className="porr">

            <h3>
              -$20,000.00
            </h3>

            <h5>
              PayPal
            </h5>

          </div>

        </div>

        <div className="owl"></div>

        <div className="poiw">

          <div className="cvb">

            <div className="frd">
              <FaArrowDown />
            </div>

            <div>
              <h5>
                P...
              </h5>

              <span>
                Dec 12, 11:03 AM
              </span>
            </div>

          </div>

          <div className="vivi">

            <div className="gio">
              <span>
                <FaCircleCheck />
              </span>
            </div>

            <div>
              <h6>
                Success
              </h6>
            </div>

          </div>

          <div className="pore">

            <h3>
              +$120,000.00
            </h3>

            <h5>
              Barclays
            </h5>

          </div>

        </div>

        <div className="owl"></div>

        <div className="poiw">

          <div className="cvd">

            <div className="frb">
              <FaArrowUp />
            </div>

            <div>
              <h5>
                To...
              </h5>

              <span>
                Dec 11, 8:20 AM
              </span>
            </div>

          </div>

          <div className="vivim">

            <span>
              Pending
            </span>

          </div>

          <div className="porr">

            <h3>
              -$15,000.00
            </h3>

            <h5>
              Citibank
            </h5>

          </div>

        </div>

      </div>

      {/* =====================================
          WITHDRAWAL ACCOUNTS
      ===================================== */}

      <div className="bne">

        <div className="bnmo">

          <div>

            <h3>
              Withdrawal Accounts
            </h3>

            <span>
              Where to Withdraw •
              Instant Payout
            </span>

          </div>

          <div>
            <FaPlus />
          </div>

        </div>

        <div className="fgx">

          <div className="cc">

            <div className="qlz">

              <span>
                <FaNewspaper />
              </span>

            </div>

            <div className="oot">

              <h4>
                Cashaapp
              </h4>

              <span>
                Business Wallet
              </span>

              <div className="polew">
                <span>
                  Default
                </span>
              </div>

            </div>

          </div>

          <div className="cc">

            <div className="qlze">

              <span>
                <FaFileLines />
              </span>

            </div>

            <div className="oot">

              <h4>
                Paypal
              </h4>

              <span>
                Business Wallet
              </span>

              <div className="polew">
                <span>
                  Default
                </span>
              </div>

            </div>

          </div>

          <div className="cc">

            <div className="qlze">

              <span>
                <FaBuilding />
              </span>

            </div>

            <div className="oot">

              <h4>
                Barclays
              </h4>

              <span>
                Business Wallet
              </span>

              <div className="polew">
                <span>
                  Default
                </span>
              </div>

            </div>

          </div>

          <div className="cc">

            <div className="qlze">

              <span>
                <FaBuildingColumns />
              </span>

            </div>

            <div className="oot">

              <h4>
                Citibank
              </h4>

              <span>
                Business Wallet
              </span>

              <div className="polew">
                <span>
                  Default
                </span>
              </div>

            </div>

          </div>

        </div>

        <div className="ccx">

          <span>
            <FaPlus />
            Add new withdrawal place
          </span>

        </div>

        <div className="lpc">

          <div className="ee">
            <FaBuildingColumns />
          </div>

          <div>

            <h5>
              How withdrawal works
            </h5>

            <p>
              Payouts settle instantly
              to saved
              <br />
              accounts. Fee $50-$100.
              Limits
              <br />
              $100k per transaction
              for new
              <br />
              accounts.
            </p>

          </div>

        </div>

      </div>

      {/* =====================================
          VERIFICATION
      ===================================== */}

      <div className="folk">

        <div className="fgg">

          <div>
            <FaShield />
          </div>

          <div>
            <h4>
              Business Verification
            </h4>
          </div>

          <div className="pwi">

            <span>
              Verified
            </span>

          </div>

        </div>

        <div className="lod">

          <div className="caw">

            <div>
              <FaCircleCheck />
            </div>

            <div>
              <span>
                KYC Completed
              </span>
            </div>

          </div>

          <div className="caw">

            <div>
              <FaCircleCheck />
            </div>

            <div>
              <span>
                BVN Linked
              </span>
            </div>

          </div>

        </div>

        <div className="vwz">

          <h6>
            Account health 92% •
            Ready for higher limits
          </h6>

        </div>

      </div>

      {/* =====================================
          WITHDRAW POPUP
      ===================================== */}

      {cart && (

        <div className="withdraw-overlay">

          <div className="cbhg">

            <div className="vnew">

              <div>
                <h2>
                  Withdraw Funds
                </h2>
              </div>

              <div>

                <button
                  type="button"
                  className="close-withdraw"
                  onClick={() =>
                    setCart(false)
                  }
                >
                  <FaXmark />
                </button>

              </div>

            </div>

            <div className="gejks">

              <h5>
                Amount (NGN)
              </h5>

              <div className="mmmmww">

                <h5>
                  $ 20,000
                </h5>

              </div>

              <h6>
                Available $245,000 •
                fee: $200.00
              </h6>

            </div>

            <div className="carsl">

              <h5>
                Withdrawal place
              </h5>

              <div className="florty">

                {/* PAYPAL */}

                <div
                  className="ooppp"
                  onClick={() =>
                    setSelectedBank(
                      "Paypal"
                    )
                  }
                >

                  <div className="fjjjj">

                    <div className="fltu">
                      <FaNewspaper />
                    </div>

                    <div>

                      <h6>
                        Paypal
                      </h6>

                      <p>
                        Business - Wallet
                      </p>

                    </div>

                  </div>

                  <div>

                    {selectedBank ===
                    "Paypal" ? (
                      <FaCircleCheck
                        className="selected-bank"
                      />
                    ) : (
                      <FaRegCircle />
                    )}

                  </div>

                </div>

                {/* CASHAPP */}

                <div
                  className="ooppp"
                  onClick={() =>
                    setSelectedBank(
                      "Cashapp"
                    )
                  }
                >

                  <div className="fjjjj">

                    <div className="klmnb">
                      <FaFileLines />
                    </div>

                    <div>

                      <h6>
                        Cashapp
                      </h6>

                      <p>
                        Business - Wallet
                      </p>

                    </div>

                  </div>

                  <div>

                    {selectedBank ===
                    "Cashapp" ? (
                      <FaCircleCheck
                        className="selected-bank"
                      />
                    ) : (
                      <FaRegCircle />
                    )}

                  </div>

                </div>

                {/* BARCLAYS */}

                <div
                  className="ooppp"
                  onClick={() =>
                    setSelectedBank(
                      "Barclays"
                    )
                  }
                >

                  <div className="fjjjj">

                    <div className="klmnb">
                      <FaBuilding />
                    </div>

                    <div>

                      <h6>
                        Barclays
                      </h6>

                      <p>
                        Business - Wallet
                      </p>

                    </div>

                  </div>

                  <div>

                    {selectedBank ===
                    "Barclays" ? (
                      <FaCircleCheck
                        className="selected-bank"
                      />
                    ) : (
                      <FaRegCircle />
                    )}

                  </div>

                </div>

                {/* CITIBANK */}

                <div
                  className="ooppp"
                  onClick={() =>
                    setSelectedBank(
                      "Citibank"
                    )
                  }
                >

                  <div className="fjjjj">

                    <div className="klmnb">
                      <FaBuildingColumns />
                    </div>

                    <div>

                      <h6>
                        Citibank
                      </h6>

                      <p>
                        Business - Wallet
                      </p>

                    </div>

                  </div>

                  <div>

                    {selectedBank ===
                    "Citibank" ? (
                      <FaCircleCheck
                        className="selected-bank"
                      />
                    ) : (
                      <FaRegCircle />
                    )}

                  </div>

                </div>

                <div className="lowwww">

                  <div>
                    <h5>
                      You will receive
                    </h5>
                  </div>

                  <div>
                    <h6>
                      $19,800.00
                    </h6>
                  </div>

                </div>

                {/* CONFIRM WITHDRAWAL */}

                <div className="bhhhh">

                  <button
                    type="button"
                    disabled={
                      loadingButton ===
                      "confirm-withdrawal"
                    }
                    onClick={
                      handleConfirmWithdrawal
                    }
                  >

                    {loadingButton ===
                    "confirm-withdrawal" ? (
                      <>
                        Confirming
                        <LoadingSpinner />
                      </>
                    ) : (
                      "Confirm Withdrawal"
                    )}

                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>

      )}

      {/* =====================================
          ACCOUNT DETAILS / VERIFICATION POPUP
      ===================================== */}

      {pay && (

        <div className="ppqqo">

          <div className="footui">

            <div className="mote">

              <div className="wbmk">

                <div className="nvz">

                  {selectedBank ===
                  "Paypal" ? (
                    <FaPaypal />
                  ) : selectedBank ===
                    "Cashapp" ? (
                    <FaFileLines />
                  ) : selectedBank ===
                    "Barclays" ? (
                    <FaBuilding />
                  ) : (
                    <FaBuildingColumns />
                  )}

                </div>

                <h4>
                  Withdrawal Verification
                </h4>

                <h6>
                  Enter the account details
                  where you want to receive
                  your withdrawal. Your
                  withdrawal can then be
                  reviewed securely.
                </h6>

              </div>

              <div className="eokl">

                <div>

                  <div className="ewolo">

                    <div>
                      <FaWallet />
                    </div>

                    <div>
                      <h6>
                        Withdrawal Account
                        Number
                      </h6>
                    </div>

                  </div>

                  <div className="namies">

                    <input
                      type="text"
                      placeholder="Account number"
                      value={
                        accountNumber
                      }
                      onChange={(e) =>
                        setAccountNumber(
                          e.target.value
                        )
                      }
                    />

                  </div>

                </div>

                <div>

                  <div className="ewolo">

                    <div>
                      <FaUser />
                    </div>

                    <div>
                      <h6>
                        Withdrawal Name
                      </h6>
                    </div>

                  </div>

                  <div className="namie">

                    <input
                      type="text"
                      placeholder="Account name"
                      value={
                        accountName
                      }
                      onChange={(e) =>
                        setAccountName(
                          e.target.value
                        )
                      }
                    />

                  </div>

                </div>

              </div>

              <div className="dffs">

                <button
                  type="button"
                  onClick={() =>
                    setPay(false)
                  }
                >
                  <FaXmark />
                </button>

              </div>

            </div>

            <div className="qcb">

              <div>

                {selectedBank ===
                "Paypal" ? (
                  <FaPaypal />
                ) : selectedBank ===
                  "Cashapp" ? (
                  <FaFileLines />
                ) : selectedBank ===
                  "Barclays" ? (
                  <FaBuilding />
                ) : (
                  <FaBuildingColumns />
                )}

                <h6>
                  {selectedBank}
                </h6>

              </div>

              <div>

                <h5>
                  {selectedAccount
                    ?.accountTitle ||
                    "Withdrawal Account"}
                </h5>

                <p>
                  Account Holder:{" "}
                  {selectedAccount
                    ?.accountHolder ||
                    "FinWallet Ltd"}
                </p>

              </div>

            </div>

            <div className="pupl">

              <div className="oewq">

                <div>
                  <FaCircleInfo />
                </div>

                <div>
                  <h4>
                    Important Notice
                  </h4>
                </div>

              </div>

              <div className="lnn">

                <h6>
                  Verify that the account
                  information above is
                  correct before continuing.
                </h6>

                <h6>
                  Your withdrawal request
                  will be reviewed securely.
                </h6>

                <h6>
                  Do not share passwords,
                  PINs, or private security
                  credentials.
                </h6>

              </div>

            </div>

            <div className="plk">

              <div>

                <button
                  type="button"
                  onClick={() =>
                    setPay(false)
                  }
                >
                  Cancel
                </button>

              </div>

              <div>

                {/* CONFIRM BUTTON */}

                <button
                  type="button"
                  disabled={
                    loadingButton ===
                    "confirm"
                  }
                  onClick={
                    handleConfirm
                  }
                >

                  {loadingButton ===
                  "confirm" ? (
                    <>
                      Confirming
                      <LoadingSpinner />
                    </>
                  ) : (
                    <>
                      <FaCircleCheck />
                      Confirm
                    </>
                  )}

                </button>

              </div>

            </div>

          </div>

        </div>

      )}

      {/* =====================================
          REVIEW WITHDRAWAL STATUS
      ===================================== */}

      {tro && (

        <div className="ottp">

          <div className="creatv">

            <div className="berqw">

              <div>

                <div className="bva">
                  <FaCircleCheck />
                </div>

                <h5>
                  Review Withdrawal
                  Status
                </h5>

                <p>
                  Your withdrawal request
                  has been submitted and
                  is being reviewed.
                </p>

              </div>

              <div>

                <button
                  type="button"
                  onClick={() =>
                    setTro(false)
                  }
                >
                  <FaXmark />
                </button>

              </div>

            </div>

            <div>

              <div className="peter">

                <div>

                  <div className="lllooo">

                    <div>
                      <FaShieldHalved />
                    </div>

                    <div>
                      <h6>
                        Verification Status
                      </h6>
                    </div>

                  </div>

                  <div className="fuckin">

                    <div>
                      <FaClock />
                    </div>

                    <div>
                      <h6>
                        Pending
                      </h6>
                    </div>

                  </div>

                </div>

                <div className="equater"></div>

                <div className="voco">

                  <div className="lllooo">

                    <div>
                      <FaHeadset />
                    </div>

                    <div>
                      <h6>
                        Withdrawal Status
                      </h6>
                    </div>

                  </div>

                  <div className="fucking">

                    <div>
                      <FaClock />
                    </div>

                    <div>
                      <h6>
                        Under review
                      </h6>
                    </div>

                  </div>

                </div>

              </div>

            </div>

            <div className="fifws">

              <div>

                <h6>
                  Enter Amount to
                  withdraw
                </h6>

                <input
                  type="number"
                  placeholder="e.g 5000"
                  value={
                    withdrawalAmount
                  }
                  onChange={(e) =>
                    setWithdrawalAmount(
                      e.target.value
                    )
                  }
                />

                <div className="spopi">
                  $
                </div>

              </div>

            </div>

            <div className="ime">

              <div className="divg">

                {/* VIEW WITHDRAWAL STATUS */}

                <button
                  type="button"
                  disabled={
                    loadingButton ===
                    "view-status"
                  }
                  onClick={
                    handleViewWithdrawalStatus
                  }
                >

                  {loadingButton ===
                  "view-status" ? (
                    <>
                      Loading
                      <LoadingSpinner />
                    </>
                  ) : (
                    <>
                      View Withdrawal
                      Status                      
                    </>
                  )}

                </button>

              </div>

              <div className="vwmb">

                <button
                  type="button"
                  onClick={() =>
                    setTro(false)
                  }
                >
                  Close
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

      {/* =====================================
          WITHDRAWAL STATUS
      ===================================== */}

      {rit && (

        <div className="ottpo">

          <div className="creatvy">

            <div className="class">

              <div className="clsa">

                <div>

                  <FaArrowLeft
                    onClick={() =>
                      setRit(false)
                    }
                  />

                </div>

                <div>

                  <h6>
                    Withdrawal Status
                  </h6>

                </div>

              </div>

              <div className="jtr">

                <FaXmark
                  onClick={() =>
                    setRit(false)
                  }
                />

              </div>

            </div>

            <div className="toit">

              <div className="divde">

                <div className="for">

                  <div>
                    <FaWallet />
                  </div>

                  <div>

                    <h6>
                      Withdrawal Amount
                    </h6>

                    <h5>
                      $
                      {Number(
                        withdrawalAmount ||
                          0
                      ).toLocaleString(
                        "en-NG",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}
                    </h5>

                    <h6>
                      Bank Transfer
                    </h6>

                  </div>

                </div>

                <div className="dory">

                  <div>
                    <FaClock />
                  </div>

                  <div>
                    <h6>
                      Processing
                    </h6>
                  </div>

                </div>

              </div>

            </div>

            <div className="covre">

              <div className="fliy">

                <div>

                  <div>
                    <FaFileLines />
                  </div>

                  <div>
                    <h6>
                      Transaction ID
                    </h6>
                  </div>

                </div>

                <div>

                  <h5>
                    {
                      transactionData.transactionId
                    }
                  </h5>

                </div>

              </div>

              <div className="vangard"></div>

              <div className="fliy">

                <div>

                  <div>
                    <FaCalendar />
                  </div>

                  <div>
                    <h6>
                      Requested On
                    </h6>
                  </div>

                </div>

                <div>

                  <h5>
                    {
                      transactionData.requestedOn
                    }
                  </h5>

                </div>

              </div>

              <div className="vangard"></div>

              <div className="fliy">

                <div>

                  <div>
                    <FaBuildingColumns />
                  </div>

                  <div>
                    <h6>
                      Payment Method
                    </h6>
                  </div>

                </div>

                <div>

                  <h5>
                    {
                      transactionData.paymentMethod
                    }
                  </h5>

                </div>

              </div>

              <div className="vangard"></div>

              <div className="fliy">

                <div>

                  <div>
                    <FaCreditCard />
                  </div>

                  <div>
                    <h6>
                      Account Number
                    </h6>
                  </div>

                </div>

                <div>

                  <h5>
                    {
                      transactionData.accountNumber
                    }
                  </h5>

                </div>

              </div>

              <div className="vangard"></div>

              <div className="fliy">

                <div>

                  <div>
                    <FaUser />
                  </div>

                  <div>
                    <h6>
                      Account Name
                    </h6>
                  </div>

                </div>

                <div>

                  <h5>
                    {
                      transactionData.accountName
                    }
                  </h5>

                </div>

              </div>

            </div>

            <div className="desa">

              <div className="frrz">

                <div className="foreq">

                  <div>

                    <div>
                      <FaCircleCheck />
                    </div>

                    <div>
                      <h6>
                        Withdrawal Requested
                      </h6>
                    </div>

                  </div>

                  <div className="opble">

                    <h6>
                      Completed
                    </h6>

                  </div>

                </div>

                <div className="ccaas"></div>

                <div className="foreqs">

                  <div>

                    <div>
                      <FaClock />
                    </div>

                    <div>
                      <h6>
                        Processing
                      </h6>
                    </div>

                  </div>

                  <div className="opblew">

                    <h6>
                      In Progress
                    </h6>

                  </div>

                </div>

              </div>

            </div>

            {/* =================================
                OTHER WITHDRAW BUTTON
            ================================= */}

            <div className="mbkbe">

              <button
                type="button"
                disabled={
                  loadingButton ===
                  "status-withdraw"
                }
                onClick={
                  handleStatusWithdraw
                }
              >

                {loadingButton ===
                "status-withdraw" ? (
                  <>
                    Processing
                    <LoadingSpinner />
                  </>
                ) : (
                  <>
                    Withdraw
                    <FaArrowRight />
                  </>
                )}

              </button>

            </div>

            <div className="mbkbl">

              <button
                type="button"
                onClick={() =>
                  setRit(false)
                }
              >
                Back
              </button>

            </div>

          </div>

        </div>

      )}

      {/* =====================================
          FINAL TAC POPUP
          YOUR ORIGINAL POPUP IS PRESERVED
      ===================================== */}

      {vert && (

        <div className="dchj">

          <div className="vefg">

            <div>

              <div className="wekek">
                <FaLaptop />
              </div>

              <div>

                <h5>
                  TAC Code is required!
                </h5>

                <p>
                  Enter the 4-digit TAC code
                  provided through your
                  authorized verification
                  process to continue.
                </p>

                {/* ===========================
                    TAC INPUT
                =========================== */}

                <div
                  style={{
                    marginTop:
                      "20px",
                  }}
                >

                  <h6
                    style={{
                      marginBottom:
                        "10px",
                      textAlign:
                        "center",
                    }}
                  >
                    Enter 4-Digit TAC Code
                  </h6>

                  <div
                    style={{
                      display:
                        "flex",
                      gap: "12px",
                      justifyContent:
                        "center",
                      background:
                        "#f0f5f5",
                      padding:
                        "18px 24px",
                      borderRadius:
                        "12px",
                      width:
                        "fit-content",
                      margin:
                        "0 auto",
                    }}
                  >

                    {otp.map(
                      (
                        digit,
                        index
                      ) => (

                        <input
                          key={
                            index
                          }
                          type="text"
                          inputMode="numeric"
                          maxLength="1"
                          value={
                            digit
                          }
                          onChange={(
                            e
                          ) =>
                            handleOtpChange(
                              e,
                              index
                            )
                          }
                          onKeyDown={(
                            e
                          ) =>
                            handleOtpKeyDown(
                              e,
                              index
                            )
                          }
                          ref={(
                            el
                          ) =>
                            (inputsRef.current[
                              index
                            ] =
                              el)
                          }
                          style={{
                            width:
                              "48px",
                            height:
                              "48px",
                            borderRadius:
                              "10px",
                            border:
                              tacError
                                ? "2px solid red"
                                : "2px solid #0f2d2d",
                            textAlign:
                              "center",
                            fontSize:
                              "20px",
                            fontWeight:
                              "bold",
                            outline:
                              "none",
                            background:
                              "white",
                          }}
                        />

                      )
                    )}

                  </div>

                  {/* TAC ERROR */}

                  {tacError && (

                    <p
                      style={{
                        color:
                          "red",
                        textAlign:
                          "center",
                        marginTop:
                          "8px",
                        fontSize:
                          "13px",
                        fontWeight:
                          "bold",
                      }}
                    >
                      {tacError}
                    </p>

                  )}

                  {/* TAC BUTTONS */}

                  <div
                    style={{
                      display:
                        "flex",
                      gap: "10px",
                      justifyContent:
                        "center",
                      marginTop:
                        "20px",
                    }}
                  >

                    {/* CANCEL */}

                    <button
                      type="button"
                      onClick={() => {
                        setVert(false);
                        setTacError("");
                      }}
                      style={{
                        padding:
                          "10px 20px",
                        borderRadius:
                          "8px",
                        border:
                          "1px solid #ccc",
                      }}
                    >
                      Cancel
                    </button>

                    {/* VERIFY TAC */}

                    <button
                      type="button"
                      onClick={
                        handleVerifyTac
                      }
                      disabled={
                        loadingButton ===
                        "verify-tac"
                      }
                      style={{
                        padding:
                          "10px 20px",
                        borderRadius:
                          "8px",
                        background:
                          "#0f2d2d",
                        color:
                          "white",
                        border:
                          "none",
                        display:
                          "inline-flex",
                        alignItems:
                          "center",
                        justifyContent:
                          "center",
                        gap:
                          "8px",
                        cursor:
                          loadingButton ===
                          "verify-tac"
                            ? "not-allowed"
                            : "pointer",
                        opacity:
                          loadingButton ===
                          "verify-tac"
                            ? 0.7
                            : 1,
                      }}
                    >

                      {loadingButton ===
                      "verify-tac" ? (
                        <>
                          Verifying
                          <LoadingSpinner />
                        </>
                      ) : (
                        "Verify TAC"
                      )}

                    </button>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default Dashboard;