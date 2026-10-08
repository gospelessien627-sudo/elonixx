import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const API_URL = "https://api.elonixx.com";

const money = (amount) =>
  Number(amount || 0).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const dateText = (date) => {
  if (!date) return "—";

  const parsed = new Date(date);

  return Number.isNaN(parsed.getTime())
    ? "—"
    : parsed.toLocaleString();
};

async function userFetch(endpoint, token, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });

  const text = await response.text();
  let data = {};

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error("The server returned an invalid response.");
  }

  if (response.status === 401 || response.status === 403) {
    throw new Error("Your session has expired. Please log in again.");
  }

  if (!response.ok) {
    throw new Error(data.message || "The request failed.");
  }

  return data;
}

export default function Dashboard() {
  const navigate = useNavigate();

  const [token, setToken] = useState(
    () => localStorage.getItem("finwalletToken") || ""
  );

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("finwalletCurrentUser") || "null"
      );
    } catch {
      return null;
    }
  });

  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [bankName, setBankName] = useState("");
  const [savingAccount, setSavingAccount] = useState(false);

  const logout = useCallback(() => {
    localStorage.removeItem("finwalletToken");
    localStorage.removeItem("finwalletCurrentUser");
    setToken("");
    navigate("/", { replace: true });
  }, [navigate]);

  const loadDashboard = useCallback(async (quiet = false) => {
    const currentToken = localStorage.getItem("finwalletToken");

    if (!currentToken) {
      logout();
      return;
    }

    if (quiet) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const [dashboardData, transactionData, accountData] =
        await Promise.all([
          userFetch("/api/dashboard", currentToken),
          userFetch("/api/transactions", currentToken),
          userFetch("/api/withdrawal-accounts", currentToken),
        ]);

      const freshUser = dashboardData.user;

      if (!freshUser) {
        throw new Error("The server did not return your account details.");
      }

      setUser(freshUser);
      localStorage.setItem(
        "finwalletCurrentUser",
        JSON.stringify(freshUser)
      );

      setTransactions(
        Array.isArray(transactionData.transactions)
          ? transactionData.transactions
          : []
      );

      setAccounts(
        Array.isArray(accountData.accounts)
          ? accountData.accounts
          : []
      );

      setToken(currentToken);
    } catch (err) {
      setError(err.message || "Unable to load your dashboard.");

      if (
        /session has expired|invalid or expired/i.test(err.message || "")
      ) {
        logout();
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [logout]);

  useEffect(() => {
    if (!token) {
      navigate("/", { replace: true });
      return;
    }

    loadDashboard();

    const handleFocus = () => loadDashboard(true);
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        loadDashboard(true);
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibility);

    // Refresh periodically to reflect changes made by the admin.
    const interval = window.setInterval(
      () => loadDashboard(true),
      20000
    );

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener(
        "visibilitychange",
        handleVisibility
      );
      window.clearInterval(interval);
    };
  }, [token, navigate, loadDashboard]);

  const submitWithdrawal = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError("Enter a valid withdrawal amount.");
      return;
    }

    if (!accountNumber.trim() || !accountName.trim()) {
      setError("Enter the destination account number and account name.");
      return;
    }

    if (numericAmount > Number(user?.balance || 0)) {
      setError("The requested amount exceeds your current balance.");
      return;
    }

    setSubmitting(true);

    try {
      const data = await userFetch("/api/withdrawals", token, {
        method: "POST",
        body: JSON.stringify({
          amount: numericAmount,
          paymentMethod,
          accountNumber: accountNumber.trim(),
          accountName: accountName.trim(),
        }),
      });

      setMessage(data.message || "Withdrawal request submitted.");
      setAmount("");

      // Load the actual balance and saved transaction from the API.
      await loadDashboard(true);
    } catch (err) {
      setError(err.message || "Unable to submit withdrawal.");
    } finally {
      setSubmitting(false);
    }
  };

  const saveWithdrawalAccount = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (
      !bankName.trim() ||
      !accountNumber.trim() ||
      !accountName.trim()
    ) {
      setError("Complete all bank account fields.");
      return;
    }

    setSavingAccount(true);

    try {
      const data = await userFetch("/api/withdrawal-accounts", token, {
        method: "POST",
        body: JSON.stringify({
          bankName: bankName.trim(),
          accountNumber: accountNumber.trim(),
          accountName: accountName.trim(),
        }),
      });

      setMessage(data.message || "Bank account saved.");
      setBankName("");
      await loadDashboard(true);
    } catch (err) {
      setError(err.message || "Unable to save bank account.");
    } finally {
      setSavingAccount(false);
    }
  };

  const totalTransactions = transactions.length;

  if (loading) {
    return (
      <main className="client-dashboard">
        <p>Loading your account...</p>
      </main>
    );
  }

  return (
    <main className="client-dashboard">
      <header className="client-header">
        <div>
          <h1>ElonixxWallet</h1>
          <p>Your personal wallet dashboard</p>
        </div>

        <div className="client-header-actions">
          <button
            type="button"
            onClick={() => loadDashboard(true)}
            disabled={refreshing}
          >
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>

          <button type="button" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      {error && (
        <div className="client-alert client-alert-error" role="alert">
          {error}
        </div>
      )}

      {message && (
        <div className="client-alert client-alert-success" role="status">
          {message}
        </div>
      )}

      <section className="client-welcome">
        <h2>
          Welcome, {user?.name || "User"}
        </h2>
        <p>{user?.email || ""}</p>
      </section>

      <section className="client-stats">
        <article className="client-stat-card">
          <span>Available balance</span>
          <h2>${money(user?.balance)}</h2>
        </article>

        <article className="client-stat-card">
          <span>Total deposited</span>
          <h2>${money(user?.deposited)}</h2>
        </article>

        <article className="client-stat-card">
          <span>Total withdrawn</span>
          <h2>${money(user?.withdrawn)}</h2>
        </article>

        <article className="client-stat-card">
          <span>Transactions</span>
          <h2>{totalTransactions}</h2>
        </article>
      </section>

      <section className="client-panel">
        <h2>Request a withdrawal</h2>

        <form onSubmit={submitWithdrawal} className="client-form">
          <label htmlFor="withdraw-amount">Amount</label>
          <input
            id="withdraw-amount"
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="Enter amount"
            required
          />

          <label htmlFor="payment-method">Payment method</label>
          <select
            id="payment-method"
            value={paymentMethod}
            onChange={(event) => setPaymentMethod(event.target.value)}
          >
            <option value="Bank Transfer">Bank Transfer</option>
          </select>

          <label htmlFor="account-number">Account number</label>
          <input
            id="account-number"
            value={accountNumber}
            onChange={(event) => setAccountNumber(event.target.value)}
            placeholder="Destination account number"
            required
          />

          <label htmlFor="account-name">Account name</label>
          <input
            id="account-name"
            value={accountName}
            onChange={(event) => setAccountName(event.target.value)}
            placeholder="Account holder's name"
            required
          />

          <button type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit withdrawal"}
          </button>
        </form>

        <p>
          Available balance: <strong>${money(user?.balance)}</strong>
        </p>
      </section>

      <section className="client-panel">
        <h2>Save a withdrawal account</h2>

        <form onSubmit={saveWithdrawalAccount} className="client-form">
          <label htmlFor="bank-name">Bank name</label>
          <input
            id="bank-name"
            value={bankName}
            onChange={(event) => setBankName(event.target.value)}
            placeholder="Bank name"
            required
          />

          <label htmlFor="saved-account-number">Account number</label>
          <input
            id="saved-account-number"
            value={accountNumber}
            onChange={(event) => setAccountNumber(event.target.value)}
            placeholder="Account number"
            required
          />

          <label htmlFor="saved-account-name">Account name</label>
          <input
            id="saved-account-name"
            value={accountName}
            onChange={(event) => setAccountName(event.target.value)}
            placeholder="Account holder's name"
            required
          />

          <button type="submit" disabled={savingAccount}>
            {savingAccount ? "Saving..." : "Save bank account"}
          </button>
        </form>

        <h3>Saved accounts</h3>

        {accounts.length === 0 ? (
          <p>No saved withdrawal accounts yet.</p>
        ) : (
          <ul>
            {accounts.map((account) => (
              <li key={account._id}>
                {account.bankName} — {account.accountName} —{" "}
                {account.accountNumber}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="client-panel">
        <div className="client-section-heading">
          <h2>Transaction history</h2>
          <span>{transactions.length} transactions</span>
        </div>

        {transactions.length === 0 ? (
          <p>No transactions found.</p>
        ) : (
          <div className="client-table-wrap">
            <table className="client-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction._id}>
                    <td>
                      {transaction.transactionId || transaction._id}
                    </td>
                    <td>{transaction.type}</td>
                    <td>${money(transaction.amount)}</td>
                    <td>
                      <span
                        className={`transaction-status status-${transaction.status}`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                    <td>{dateText(transaction.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}