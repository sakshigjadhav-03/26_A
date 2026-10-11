import { useState } from "react";
import "./App.css";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const categories = ["Food", "Travel", "Shopping", "Bills", "Other"];

  function addExpense(e) {
    e.preventDefault();
    if (!name.trim() || Number(amount) <= 0 || amount === "") {
      alert("Enter valid expense details.");
      return;
    }

    setExpenses([...expenses, {
      id: Date.now(), name, amount: Number(amount), category
    }]);
    setName("");
    setAmount("");
  }

  return (
    <div className="container">
      <h1>Personal Expense Tracker</h1>

      <div className="summary">
        <p>Total Expenses</p>
        <h2>₹{total.toFixed(2)}</h2>
      </div>

      <section className="card">
        <h2>Add Expense</h2>
        <form onSubmit={addExpense}>
          <input placeholder="Expense Name" value={name}
            onChange={e => setName(e.target.value)} required />
          <input type="number" placeholder="Amount (e.g. 300)"
            min="0.01" step="any" value={amount}
            onChange={e => setAmount(e.target.value)} required />
          <select value={category} onChange={e => setCategory(e.target.value)}>
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
          <button type="submit">Add Expense</button>
        </form>
      </section>

      <section className="card">
        <h2>Expense Analysis</h2>
        {categories.map(c => {
          const sum = expenses.filter(e => e.category === c)
            .reduce((s, e) => s + e.amount, 0);
          return sum > 0 && (
            <p key={c}>{c}: ₹{sum.toFixed(2)} ({(sum / total * 100).toFixed(1)}%)</p>
          );
        })}
      </section>

      <section className="card">
        <h2>Expense Records</h2>
        {expenses.map(e => (
          <div className="record" key={e.id}>
            <span>{e.name} — {e.category} — ₹{e.amount.toFixed(2)}</span>
            <button className="delete"
              onClick={() => setExpenses(expenses.filter(x => x.id !== e.id))}>
              Delete
            </button>
          </div>
        ))}
        {expenses.length === 0 && <p>No expenses added yet.</p>}
      </section>
    </div>
  );
}

export default App;