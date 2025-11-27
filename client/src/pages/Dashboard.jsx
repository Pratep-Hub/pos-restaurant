import { useState } from "react";
import Navbar from "../components/Navbar";
import { api } from "../api";
import "./Dashboard.css";

const TABLES = ["T1", "T2", "T3", "T4", "T5"];

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

  // Save Bill
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

      setBill(data);
      alert("Bill Saved Successfully!");
    } catch (err) {
      console.error("Save Bill Error:", err.response?.data || err.message);
      alert("Failed to save bill.");
    }
  };

  // ------------- MARK PAID & PRINT (POPUP RECEIPT WITH SMALL LOGO) -----------------
  const markPaidAndPrint = async () => {
    if (!bill || !bill._id) {
      alert("Please save the bill first before printing.");
      return;
    }

    await api.post(`/pos/bill/${bill._id}/pay`);

    const printArea = document.getElementById("print-receipt");
    if (!printArea) return alert("Print area not found!");

    const html = printArea.innerHTML;

    const popup = window.open("", "_blank", "width=400,height=600");

    popup.document.write(`
      <html>
        <head>
          <title>Receipt</title>

          <style>
            @page { size: 80mm auto; margin: 0; }

            body {
              font-family: monospace;
              width: 80mm;
              padding: 10px;
            }

            /* 🔥 SMALL LOGO FIX (WORKS IN POPUP) */
            .receipt-logo {
              width: 50px !important;
              max-width: 50px !important;
              height: auto !important;
              object-fit: contain !important;
              margin: 0 auto 6px auto !important;
              display: block !important;
            }

            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 4px 0; border-bottom: 1px dashed #aaa; }

            .receipt-title {
              text-align: center;
              font-size: 16px;
              font-weight: bold;
              margin-bottom: 8px;
            }

            .thanks-msg {
              text-align: center;
              margin-top: 10px;
            }
          </style>
        </head>

        <body>
          ${html}
        </body>
      </html>
    `);

    popup.document.close();
    popup.focus();

    setTimeout(() => {
      popup.print();
    }, 300);
  };

  return (
    <div className="dashboard-container">
      <Navbar />

      <div className="dashboard-card">

        <div className="table-select-area">
          <span>Table:</span>
          <select value={tableNo} onChange={(e) => setTableNo(e.target.value)}>
            {TABLES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>

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
                <td>{(row.quantity || 0) * (row.price || 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <button className="add-item-btn" onClick={addRow}>
          + Add Item
        </button>

        <div className="footer-actions">
          <span>Subtotal: {subtotal}</span>

          <button className="save-btn" onClick={createBill}>
            Save Bill
          </button>

          <button className="pay-btn" onClick={markPaidAndPrint}>
            Mark Paid & Print
          </button>
        </div>
      </div>

      {/* PRINT TEMPLATE */}
      <div id="print-receipt">
        <img src="/TurkishLogo.png" alt="Logo" className="receipt-logo" />

        <h2 className="receipt-title">Turkish Doner</h2>

        <p>Table: {bill?.tableNo}</p>
        <p>Date: {new Date(bill?.date).toLocaleString()}</p>
        <hr />

        <table>
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
        <p>Subtotal: {bill?.subtotal}</p>
        <p>Grand Total: {bill?.grandTotal}</p>

        <p className="thanks-msg">Thank you! Visit Again 🙏</p>
      </div>
    </div>
  );
}
