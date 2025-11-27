import { useState } from "react";
import Navbar from "../components/Navbar";
import { api } from "../api";
import "../pages/Dashboard.css";

const TABLES = ["T1", "T2", "T3", "T4","T5"];

export default function Dashboard() {
  const [tableNo, setTableNo] = useState(TABLES[0]);
  const [items, setItems] = useState([{ name: "", quantity: 1, price: 0 }]);
  const [bill, setBill] = useState(null);

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] =
      field === "quantity" || field === "price" ? Number(value) : value;
    setItems(updated);
  };

  const addRow = () => {
    setItems([...items, { name: "", quantity: 1, price: 0 }]);
  };

  const subtotal = items.reduce(
    (sum, i) => sum + (i.quantity || 0) * (i.price || 0),
    0
  );

  const createBill = async () => {
    try {
      const filtered = items.filter((i) => i.name && i.quantity > 0);

      if (filtered.length === 0) {
        alert("Please add at least 1 item.");
        return;
      }

      const { data } = await api.post("/pos/bill", {
        tableNo,
        items: filtered,
      });

      console.log("Bill Saved:", data);
      setBill(data);
      alert("Bill Saved Successfully!");
    } catch (err) {
      console.error("Save Bill Error:", err.response?.data || err.message);
      alert("Failed to save bill. Check console.");
    }
  };

  // ✅ FIXED PRINT FUNCTION — ALWAYS WORKS
  const markPaidAndPrint = async () => {
    if (!bill?._id) return;

    await api.post(`/pos/bill/${bill._id}/pay`);

    const printContents = document.getElementById("print-receipt").innerHTML;

    const popup = window.open("", "_blank", "width=400,height=600");
    popup.document.open();
    popup.document.write(`
      <html>
        <head>
          <title>Receipt</title>
          <style>
            body { font-family: monospace; padding: 20px; }
            .receipt-title { text-align: center; font-size: 18px; font-weight: bold; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { padding: 4px 0; border-bottom: 1px dashed #aaa; text-align: left; }
            .receipt-total { font-weight: bold; margin-top: 10px; }
            .thanks-msg { text-align: center; margin-top: 20px; }
          </style>
        </head>
        <body>
          ${printContents}
        </body>
      </html>
    `);

    popup.document.close();
    popup.focus();
    popup.print();
    popup.close();
  };

  return (
    <div className="dashboard-container">
      <Navbar />

      <div className="dashboard-card">
        {/* Table Selection */}
        <div className="table-select-area">
          <span>Table:</span>
          <select
            value={tableNo}
            onChange={(e) => setTableNo(e.target.value)}
          >
            {TABLES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* POS Table */}
        <table className="pos-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>

          <tbody>
            {items.map((row, idx) => (
              <tr key={idx}>
                <td>
                  <input
                    value={row.name}
                    onChange={(e) =>
                      handleItemChange(idx, "name", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="1"
                    value={row.quantity}
                    onChange={(e) =>
                      handleItemChange(idx, "quantity", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    value={row.price}
                    onChange={(e) =>
                      handleItemChange(idx, "price", e.target.value)
                    }
                  />
                </td>
                <td className="text-right">
                  {(row.quantity || 0) * (row.price || 0)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button className="add-item-btn" onClick={addRow}>
          + Add Item
        </button>

        <div className="footer-actions">
          <span className="subtotal-text">Subtotal: {subtotal}</span>

          <button className="save-btn" onClick={createBill}>
            Save Bill
          </button>

          <button className="pay-btn" onClick={markPaidAndPrint}>
            Mark Paid & Print
          </button>
        </div>
      </div>

      {/* PRINT RECEIPT */}
      <div id="print-receipt" className="print-area">
        <h2 className="receipt-title">Turkish Doner</h2>
        <p>Table: {bill?.tableNo}</p>
        <p>Date: {new Date(bill?.date).toLocaleString()}</p>
        <hr />

        <table className="receipt-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>

          <tbody>
            {bill?.items?.map((item, i) => (
              <tr key={i}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>{item.price}</td>
                <td>{item.total}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <hr />
        <p className="receipt-total">Subtotal: {bill?.subtotal}</p>
        <p className="receipt-total">Grand Total: {bill?.grandTotal}</p>

        <p className="thanks-msg">Thank you! Visit Again 🙏</p>
      </div>
    </div>
  );
}
