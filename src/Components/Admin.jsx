import React, {
  useEffect,
  useState,
} from "react";

import {
  FaArrowRight,
  FaBars,
  FaBell,
  FaCircleCheck,
  FaClock,
  FaMoneyBillTransfer,
  FaUsers,
  FaWallet,
  FaRotate,
  FaRightFromBracket,
  FaShieldHalved,
} from "react-icons/fa6";

import { useNavigate } from "react-router-dom";

import Live from "./Live";

import "./Admin.css";

const API_URL = "https://api.elonixx.com";

const Admin = () => {
  const navigate = useNavigate();

  /* =====================================================
     ADMIN TOKEN
  ===================================================== */

  const [
    adminToken,
    setAdminToken,
  ] = useState(() =>
    localStorage.getItem(
      "elonixxAdminToken"
    )
  );

  /* =====================================================
     STATISTICS
  ===================================================== */

  const [
    statistics,
    setStatistics,
  ] = useState({
    totalUsers: 0,
    totalTransactions: 0,
    totalWithdrawals: 0,
    pendingWithdrawals: 0,
    completedWithdrawals: 0,
  });

  /* =====================================================
     USERS
  ===================================================== */

  const [
    users,
    setUsers,
  ] = useState([]);

  /* =====================================================
     WITHDRAWALS
  ===================================================== */

  const [
    withdrawals,
    setWithdrawals,
  ] = useState([]);

  /* =====================================================
     ACTIVE PAGE
  ===================================================== */

  const [
    activePage,
    setActivePage,
  ] = useState("overview");

  /* =====================================================
     LOADING
  ===================================================== */

  const [
    loading,
    setLoading,
  ] = useState(true);

  /* =====================================================
     UPDATING WITHDRAWAL
  ===================================================== */

  const [
    updatingId,
    setUpdatingId,
  ] = useState("");

  /* =====================================================
     SIDEBAR
  ===================================================== */

  const [
    sidebarOpen,
    setSidebarOpen,
  ] = useState(false);

  /* =====================================================
     ERROR
  ===================================================== */

  const [
    dashboardError,
    setDashboardError,
  ] = useState("");

  /* =====================================================
     ADMIN EMAIL
  ===================================================== */

  const [
    adminEmail,
    setAdminEmail,
  ] = useState(
    () =>
      localStorage.getItem(
        "elonixxAdminEmail"
      ) || "Administrator"
  );

  /* =====================================================
     AUTHENTICATION CHECK
  ===================================================== */

  useEffect(() => {
    const token =
      localStorage.getItem(
        "elonixxAdminToken"
      );

    const email =
      localStorage.getItem(
        "elonixxAdminEmail"
      );

    if (!token) {
      navigate("/", {
        replace: true,
      });

      return;
    }

    setAdminToken(token);

    if (email) {
      setAdminEmail(email);
    }
  }, [navigate]);

  /* =====================================================
     ADMIN API HELPER
  ===================================================== */

  const adminFetch = async (
    endpoint,
    options = {}
  ) => {
    const token =
      localStorage.getItem(
        "elonixxAdminToken"
      );

    if (!token) {
      throw new Error(
        "Admin authentication token is missing."
      );
    }

    const response =
      await fetch(
        `${API_URL}${endpoint}`,
        {
          ...options,

          headers: {
            "Content-Type":
              "application/json",

            ...(options.headers || {}),

            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    const responseText =
      await response.text();

    let data = {};

    try {
      data = responseText
        ? JSON.parse(responseText)
        : {};
    } catch {
      data = {};
    }

    /* =================================================
       AUTH ERROR
    ================================================= */

    if (
      response.status === 401 ||
      response.status === 403
    ) {
      throw new Error(
        data.message ||
          "Admin authentication failed. Your admin session may be invalid or expired."
      );
    }

    /* =================================================
       OTHER SERVER ERROR
    ================================================= */

    if (!response.ok) {
      throw new Error(
        data.message ||
          `Server returned ${response.status}.`
      );
    }

    return data;
  };

  /* =====================================================
     LOAD ADMIN DASHBOARD
  ===================================================== */

  const loadDashboard =
    async () => {
      const token =
        localStorage.getItem(
          "elonixxAdminToken"
        );

      if (!token) {
        setDashboardError(
          "Admin token is missing."
        );

        setLoading(false);

        return;
      }

      setLoading(true);
      setDashboardError("");

      try {
        const [
          overviewData,
          withdrawalsData,
        ] = await Promise.all([
          adminFetch(
            "/api/admin/overview"
          ),

          adminFetch(
            "/api/admin/withdrawals"
          ),
        ]);

        /* =================================================
           SAFE STATISTICS
        ================================================= */

        const safeStatistics =
          overviewData?.statistics ||
          {};

        setStatistics({
          totalUsers:
            Number(
              safeStatistics.totalUsers
            ) || 0,

          totalTransactions:
            Number(
              safeStatistics.totalTransactions
            ) || 0,

          totalWithdrawals:
            Number(
              safeStatistics.totalWithdrawals
            ) || 0,

          pendingWithdrawals:
            Number(
              safeStatistics.pendingWithdrawals
            ) || 0,

          completedWithdrawals:
            Number(
              safeStatistics.completedWithdrawals
            ) || 0,
        });

        /* =================================================
           SAFE USERS
        ================================================= */

        setUsers(
          Array.isArray(
            overviewData?.users
          )
            ? overviewData.users
            : []
        );

        /* =================================================
           SAFE WITHDRAWALS
        ================================================= */

        setWithdrawals(
          Array.isArray(
            withdrawalsData?.withdrawals
          )
            ? withdrawalsData.withdrawals
            : []
        );
      } catch (error) {
        console.error(
          "Admin dashboard error:",
          error
        );

        setDashboardError(
          error.message ||
            "Unable to load admin dashboard."
        );

        /*
         * IMPORTANT:
         *
         * We DO NOT immediately navigate
         * back to "/" here.
         *
         * This allows you to actually see
         * what went wrong instead of the
         * dashboard disappearing.
         */
      } finally {
        setLoading(false);
      }
    };

  /* =====================================================
     LOAD DASHBOARD WHEN TOKEN EXISTS
  ===================================================== */

  useEffect(() => {
    if (adminToken) {
      loadDashboard();
    }
  }, [adminToken]);

  /* =====================================================
     UPDATE WITHDRAWAL STATUS
  ===================================================== */

  const updateWithdrawalStatus =
    async (
      id,
      status
    ) => {
      if (!id) return;

      setUpdatingId(id);

      try {
        await adminFetch(
          `/api/admin/withdrawals/${id}/status`,
          {
            method: "PATCH",

            body: JSON.stringify({
              status,
            }),
          }
        );

        setWithdrawals(
          (previous) =>
            previous.map(
              (item) =>
                item._id === id
                  ? {
                      ...item,
                      status,
                    }
                  : item
            )
        );

        /*
         * Reload dashboard so that
         * statistics stay accurate.
         */

        await loadDashboard();
      } catch (error) {
        console.error(
          "Withdrawal update error:",
          error
        );

        alert(
          error.message ||
            "Unable to update withdrawal."
        );
      } finally {
        setUpdatingId("");
      }
    };

  /* =====================================================
     LOGOUT
  ===================================================== */

  const handleLogout = () => {
    localStorage.removeItem(
      "elonixxAdminToken"
    );

    localStorage.removeItem(
      "elonixxAdminEmail"
    );

    localStorage.removeItem(
      "finwalletToken"
    );

    localStorage.removeItem(
      "finwalletCurrentUser"
    );

    setAdminToken(null);

    navigate("/", {
      replace: true,
    });
  };

  /* =====================================================
     FORMAT MONEY
  ===================================================== */

  const formatMoney = (
    amount
  ) => {
    return Number(
      amount || 0
    ).toLocaleString(
      "en-NG",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
  };

  /* =====================================================
     FORMAT DATE
  ===================================================== */

  const formatDate = (
    date
  ) => {
    if (!date) return "-";

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "-";
    }

    return parsedDate.toLocaleString(
      "en-US",
      {
        dateStyle:
          "medium",

        timeStyle:
          "short",
      }
    );
  };

  /* =====================================================
     STATUS CLASS
  ===================================================== */

  const statusClass = (
    status
  ) => {
    return `status status-${
      status || "pending"
    }`;
  };

  /* =====================================================
     IF NO ADMIN TOKEN
  ===================================================== */

  if (!adminToken) {
    return null;
  }

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="admin-layout">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside
        className={
          sidebarOpen
            ? "admin-sidebar open"
            : "admin-sidebar"
        }
      >

        {/* LOGO */}

        <div className="admin-logo">

          <div className="admin-logo-icon">
            <FaShieldHalved />
          </div>

          <div>
            <h2>
              ElonixxWallet
            </h2>

            <span>
              Admin Panel
            </span>
          </div>

        </div>

        {/* PROFILE */}

        <div className="admin-profile">

          <div className="admin-avatar">
            {(
              adminEmail ||
              "A"
            )
              .charAt(0)
              .toUpperCase()}
          </div>

          <div>
            <strong>
              Administrator
            </strong>

            <small>
              {adminEmail}
            </small>
          </div>

        </div>

        {/* NAVIGATION */}

        <nav className="admin-nav">

          <button
            type="button"
            className={
              activePage ===
              "overview"
                ? "active"
                : ""
            }
            onClick={() => {
              setActivePage(
                "overview"
              );

              setSidebarOpen(
                false
              );
            }}
          >
            <FaWallet />
            Overview
          </button>

          <button
            type="button"
            className={
              activePage ===
              "users"
                ? "active"
                : ""
            }
            onClick={() => {
              setActivePage(
                "users"
              );

              setSidebarOpen(
                false
              );
            }}
          >
            <FaUsers />
            Users
          </button>

          <button
            type="button"
            className={
              activePage ===
              "withdrawals"
                ? "active"
                : ""
            }
            onClick={() => {
              setActivePage(
                "withdrawals"
              );

              setSidebarOpen(
                false
              );
            }}
          >
            <FaMoneyBillTransfer />
            Withdrawals
          </button>

          <button
            type="button"
            className={
              activePage ===
              "chat"
                ? "active"
                : ""
            }
            onClick={() => {
              setActivePage(
                "chat"
              );

              setSidebarOpen(
                false
              );
            }}
          >
            <FaBell />
            Live Chat
          </button>

        </nav>

        {/* LOGOUT */}

        <button
          type="button"
          className="admin-logout"
          onClick={
            handleLogout
          }
        >
          <FaRightFromBracket />
          Logout
        </button>

      </aside>

      {/* =================================================
          MOBILE OVERLAY
      ================================================= */}

      {sidebarOpen && (
        <div
          className="admin-mobile-overlay"
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="admin-main">

        {/* HEADER */}

        <header className="admin-header">

          <button
            type="button"
            className="admin-menu"
            onClick={() =>
              setSidebarOpen(true)
            }
          >
            <FaBars />
          </button>

          <div>
            <h1>
              {activePage ===
              "overview"
                ? "Dashboard"
                : activePage ===
                  "users"
                ? "Users"
                : activePage ===
                  "withdrawals"
                ? "Withdrawals"
                : "Live Chat"}
            </h1>

            <p>
              Manage your
              ElonixxWallet
              platform.
            </p>
          </div>

          <div className="header-actions">

            <button
              type="button"
              onClick={
                loadDashboard
              }
              title="Refresh"
            >
              <FaRotate />
            </button>

            <div className="admin-header-avatar">
              {(
                adminEmail ||
                "A"
              )
                .charAt(0)
                .toUpperCase()}
            </div>

          </div>

        </header>

        {/* =================================================
            ERROR MESSAGE
        ================================================= */}

        {dashboardError && (
          <div className="admin-error">

            <strong>
              Admin dashboard could not
              load.
            </strong>

            <p>
              {dashboardError}
            </p>

            <button
              type="button"
              onClick={
                loadDashboard
              }
            >
              Try Again
            </button>

          </div>
        )}

        {/* =================================================
            OVERVIEW
        ================================================= */}

        {activePage ===
          "overview" && (
          <section>

            <div className="admin-welcome">

              <div>
                <span>
                  ADMINISTRATION
                </span>

                <h2>
                  Welcome back,
                  Administrator
                </h2>

                <p>
                  Here is what's
                  happening with
                  your platform.
                </p>
              </div>

              <FaShieldHalved />

            </div>

            <div className="stats-grid">

              <div className="stat-card">

                <div className="stat-icon users">
                  <FaUsers />
                </div>

                <div>
                  <span>
                    TOTAL USERS
                  </span>

                  <h3>
                    {
                      statistics.totalUsers
                    }
                  </h3>

                  <p>
                    Registered accounts
                  </p>
                </div>

              </div>

              <div className="stat-card">

                <div className="stat-icon transactions">
                  <FaMoneyBillTransfer />
                </div>

                <div>
                  <span>
                    TRANSACTIONS
                  </span>

                  <h3>
                    {
                      statistics.totalTransactions
                    }
                  </h3>

                  <p>
                    All transactions
                  </p>
                </div>

              </div>

              <div className="stat-card">

                <div className="stat-icon pending">
                  <FaClock />
                </div>

                <div>
                  <span>
                    PENDING
                  </span>

                  <h3>
                    {
                      statistics.pendingWithdrawals
                    }
                  </h3>

                  <p>
                    Awaiting review
                  </p>
                </div>

              </div>

              <div className="stat-card">

                <div className="stat-icon completed">
                  <FaCircleCheck />
                </div>

                <div>
                  <span>
                    COMPLETED
                  </span>

                  <h3>
                    {
                      statistics.completedWithdrawals
                    }
                  </h3>

                  <p>
                    Completed withdrawals
                  </p>
                </div>

              </div>

            </div>

            <div className="admin-two-column">

              {/* RECENT USERS */}

              <div className="admin-card">

                <div className="card-heading">

                  <div>
                    <h3>
                      Recent Users
                    </h3>

                    <p>
                      Latest registered
                      accounts
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setActivePage(
                        "users"
                      )
                    }
                  >
                    View all
                    <FaArrowRight />
                  </button>

                </div>

                <div className="table-container">

                  <table>

                    <thead>

                      <tr>
                        <th>
                          User
                        </th>

                        <th>
                          Email
                        </th>

                        <th>
                          Balance
                        </th>

                        <th>
                          Joined
                        </th>
                      </tr>

                    </thead>

                    <tbody>

                      {users
                        .slice(
                          0,
                          5
                        )
                        .map(
                          (
                            user
                          ) => (
                            <tr
                              key={
                                user._id
                              }
                            >

                              <td>

                                <div className="table-user">

                                  <div className="mini-avatar">
                                    {(
                                      user.name ||
                                      "U"
                                    )
                                      .charAt(
                                        0
                                      )
                                      .toUpperCase()}
                                  </div>

                                  <strong>
                                    {
                                      user.name
                                    }
                                  </strong>

                                </div>

                              </td>

                              <td>
                                {
                                  user.email
                                }
                              </td>

                              <td>
                                $
                                {formatMoney(
                                  user.balance
                                )}
                              </td>

                              <td>
                                {
                                  formatDate(
                                    user.createdAt
                                  )
                                }
                              </td>

                            </tr>
                          )
                        )}

                      {users.length ===
                        0 && (
                        <tr>
                          <td
                            colSpan="4"
                          >
                            No users found.
                          </td>
                        </tr>
                      )}

                    </tbody>

                  </table>

                </div>

              </div>

              {/* PENDING WITHDRAWALS */}

              <div className="admin-card">

                <div className="card-heading">

                  <div>
                    <h3>
                      Pending Withdrawals
                    </h3>

                    <p>
                      Requests requiring
                      attention
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setActivePage(
                        "withdrawals"
                      )
                    }
                  >
                    View all
                    <FaArrowRight />
                  </button>

                </div>

                <div className="withdrawal-preview">

                  {withdrawals.filter(
                    (item) =>
                      item.status ===
                      "pending"
                  ).length === 0 ? (
                    <div className="empty-state">

                      <FaCircleCheck />

                      <p>
                        No pending
                        withdrawals.
                      </p>

                    </div>
                  ) : (
                    withdrawals
                      .filter(
                        (item) =>
                          item.status ===
                          "pending"
                      )
                      .slice(
                        0,
                        5
                      )
                      .map(
                        (
                          item
                        ) => (
                          <div
                            className="withdrawal-preview-row"
                            key={
                              item._id
                            }
                          >

                            <div className="mini-avatar">
                              {(
                                item.userId
                                  ?.name ||
                                "U"
                              )
                                .charAt(
                                  0
                                )
                                .toUpperCase()}
                            </div>

                            <div className="preview-info">

                              <strong>
                                {
                                  item.userId
                                    ?.name ||
                                  "Unknown User"
                                }
                              </strong>

                              <span>
                                {
                                  item.paymentMethod ||
                                  "Bank Transfer"
                                }
                              </span>

                            </div>

                            <strong>
                              $
                              {formatMoney(
                                item.amount
                              )}
                            </strong>

                          </div>
                        )
                      )
                  )}

                </div>

              </div>

            </div>

          </section>
        )}

        {/* =================================================
            USERS
        ================================================= */}

        {activePage ===
          "users" && (
          <section className="admin-card full-card">

            <div className="card-heading">

              <div>
                <h3>
                  All Users
                </h3>

                <p>
                  Manage and view
                  registered users.
                </p>
              </div>

              <div className="count-pill">
                {
                  users.length
                } users
              </div>

            </div>

            <div className="table-container">

              <table>

                <thead>

                  <tr>

                    <th>
                      User
                    </th>

                    <th>
                      Email
                    </th>

                    <th>
                      Balance
                    </th>

                    <th>
                      Deposited
                    </th>

                    <th>
                      Withdrawn
                    </th>

                    <th>
                      Created
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {users.map(
                    (
                      user
                    ) => (
                      <tr
                        key={
                          user._id
                        }
                      >

                        <td>

                          <div className="table-user">

                            <div className="mini-avatar">
                              {(
                                user.name ||
                                "U"
                              )
                                .charAt(
                                  0
                                )
                                .toUpperCase()}
                            </div>

                            <strong>
                              {
                                user.name
                              }
                            </strong>

                          </div>

                        </td>

                        <td>
                          {
                            user.email
                          }
                        </td>

                        <td>
                          $
                          {formatMoney(
                            user.balance
                          )}
                        </td>

                        <td>
                          $
                          {formatMoney(
                            user.deposited
                          )}
                        </td>

                        <td>
                          $
                          {formatMoney(
                            user.withdrawn
                          )}
                        </td>

                        <td>
                          {
                            formatDate(
                              user.createdAt
                            )
                          }
                        </td>

                      </tr>
                    )
                  )}

                  {users.length ===
                    0 && (
                    <tr>
                      <td
                        colSpan="6"
                      >
                        No users found.
                      </td>
                    </tr>
                  )}

                </tbody>

              </table>

            </div>

          </section>
        )}

        {/* =================================================
            WITHDRAWALS
        ================================================= */}

        {activePage ===
          "withdrawals" && (
          <section className="admin-card full-card">

            <div className="card-heading">

              <div>
                <h3>
                  Withdrawal Requests
                </h3>

                <p>
                  Review and update
                  withdrawal statuses.
                </p>
              </div>

              <div className="count-pill">
                {
                  withdrawals.length
                } requests
              </div>

            </div>

            <div className="table-container">

              <table>

                <thead>

                  <tr>

                    <th>
                      User
                    </th>

                    <th>
                      Amount
                    </th>

                    <th>
                      Method
                    </th>

                    <th>
                      Account
                    </th>

                    <th>
                      Date
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {withdrawals.map(
                    (
                      item
                    ) => (
                      <tr
                        key={
                          item._id
                        }
                      >

                        <td>

                          <div className="table-user">

                            <div className="mini-avatar">
                              {(
                                item.userId
                                  ?.name ||
                                "U"
                              )
                                .charAt(
                                  0
                                )
                                .toUpperCase()}
                            </div>

                            <div>

                              <strong>
                                {
                                  item.userId
                                    ?.name ||
                                  "Unknown"
                                }
                              </strong>

                              <small>
                                {
                                  item.userId
                                    ?.email ||
                                  ""
                                }
                              </small>

                            </div>

                          </div>

                        </td>

                        <td>
                          <strong>
                            $
                            {formatMoney(
                              item.amount
                            )}
                          </strong>
                        </td>

                        <td>
                          {
                            item.paymentMethod ||
                            "Bank Transfer"
                          }
                        </td>

                        <td>

                          <div className="account-info">

                            <strong>
                              {
                                item.accountName ||
                                "-"
                              }
                            </strong>

                            <small>
                              {
                                item.accountNumber ||
                                "-"
                              }
                            </small>

                          </div>

                        </td>

                        <td>
                          {
                            formatDate(
                              item.createdAt
                            )
                          }
                        </td>

                        <td>

                          <span
                            className={statusClass(
                              item.status
                            )}
                          >
                            {
                              item.status ||
                              "pending"
                            }
                          </span>

                        </td>

                        <td>

                          <select
                            value={
                              item.status ||
                              "pending"
                            }
                            disabled={
                              updatingId ===
                              item._id
                            }
                            onChange={(
                              e
                            ) =>
                              updateWithdrawalStatus(
                                item._id,
                                e.target
                                  .value
                              )
                            }
                          >

                            <option value="pending">
                              Pending
                            </option>

                            <option value="processing">
                              Processing
                            </option>

                            <option value="completed">
                              Completed
                            </option>

                            <option value="failed">
                              Failed
                            </option>

                          </select>

                        </td>

                      </tr>
                    )
                  )}

                  {withdrawals.length ===
                    0 && (
                    <tr>
                      <td
                        colSpan="7"
                      >
                        No withdrawal
                        requests found.
                      </td>
                    </tr>
                  )}

                </tbody>

              </table>

            </div>

          </section>
        )}

        {/* =================================================
            LIVE CHAT
        ================================================= */}

        {activePage ===
          "chat" && (
          <section className="admin-chat-page">

            <div className="chat-admin-heading">

              <div>

                <h2>
                  Live Customer Support
                </h2>

                <p>
                  Communicate with
                  customers through
                  the live chat.
                </p>

              </div>

              <div className="online-indicator">

                <span />

                Support online

              </div>

            </div>

            <div className="admin-live-container">

              <Live role="admin" />

            </div>

          </section>
        )}

        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (
          <div className="admin-loading">

            <div className="admin-spinner" />

            Loading admin data...

          </div>
        )}

      </main>

    </div>
  );
};

export default Admin;