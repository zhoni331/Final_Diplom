import { useState } from "react";
import { createJob } from "../services/jobs";

export default function CreateJob() {
  const [form, setForm] = useState({ title: "", description: "", budget: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      title: form.title,
      description: form.description,
      budget: Number(form.budget),
    };

    try {
      await createJob(data);
      alert("Заявка создана");
    } catch (err) {
      console.error('Error details:', err.response?.data || err.message);
      alert('Ошибка: ' + JSON.stringify(err.response?.data || err.message));
    }
  };

  return (
    <div className="page-shell">
      <div className="page-header">
        <p className="page-kicker">New request</p>
        <h1 className="page-title">Create renovation job</h1>
        <p className="page-subtitle">Describe the task clearly so contractors can send accurate proposals.</p>
      </div>
      <div className="form-card">
        <h2>Создать заказ</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Job title</label>
            <input placeholder="Название" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea placeholder="Описание" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Budget</label>
            <input type="number" placeholder="Бюджет" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} required min="0.01" step="0.01" />
          </div>
          <button type="submit" className="button-primary">Создать</button>
        </form>
      </div>
    </div>
  );
}
