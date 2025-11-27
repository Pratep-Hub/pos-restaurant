import { useState } from "react";
import Navbar from "../components/Navbar";
import { api } from "../api";
import "../pages/Reports.css";

const today = new Date().toISOString().slice(0, 10);

export default function Reports() {
  const [report, setReport] = useState(null);

  const [singleDate, setSingleDate] = useState(today);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  // Load Daily Report
  const loadDaily = async () => {
    const { data } = await api.get("/reports/daily", {
      params: { date: singleDate },
    });
    setReport(data);
  };

  // Load Range Report
  const loadRange = async () => {
    if (!startDate || !endDate) {
      return alert("Select From and To dates");
    }
    const { data } = await api.get("/reports/range", {
      params: { start: startDate, end: endDate },
    });
    setReport(data);
  };

  return (
    <div className="reports-container">
      <Navbar />

      <div className="reports-card">

        {/* DAILY REPORT */}
        <h2 className="section-title">Daily Report</h2>
        <div className="section">
          <label>Date:</label>
          <input
            type="date"
            value={singleDate}
            onChange={(e) => setSingleDate(e.target.value)}
          />
          <button onClick={loadDaily}>Load</button>
        </div>

        {/* RANGE REPORT */}
        <h2 className="section-title">Custom Range Report</h2>
        <div className="section">
          <label>From:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <label>To:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />

          <button onClick={loadRange}>Load Range</button>
        </div>

        {/* SHOW REPORT RESULT */}
        {report && (
          <div className="report-output">
            <h3>Summary</h3>

            <p><strong>Date Range:</strong> {report.dateRange}</p>
            <p><strong>Total Bills:</strong> {report.billCount}</p>
            <p><strong>Total Amount:</strong> ₹{report.totalAmount}</p>

            <h4 className="mt">Bills</h4>

            <table className="report-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Table</th>
                  <th>Amount</th>
                </tr>
              </thead>

              <tbody>
                {report.bills.map((b) => (
                  <tr key={b._id}>
                    <td>{new Date(b.date).toLocaleDateString()}</td>
                    <td>{new Date(b.date).toLocaleTimeString()}</td>
                    <td>{b.tableNo}</td>
                    <td>₹{b.grandTotal}</td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        )}
      </div>
    </div>
  );
}
