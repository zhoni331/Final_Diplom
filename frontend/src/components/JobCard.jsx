import { createProposal } from "../services/proposal";
import { useState } from "react";

export default function JobCard({ job }) {
  const [message, setMessage] = useState("");
  const [price, setPrice] = useState("");
  const [showform, setShowForm] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const isContractor = user?.role === "contractor";

  const handleApply = async () => {
    try {
      await createProposal(job.id, message, price);
      alert("Заявка отправлена");
    } catch (err) {
      console.error(err.response?.data || err);
      alert("Ошибка при отправке заявки");
    }
  };

  return (
    <article className="job-card">
      <div className="job-meta">
        <span className="status-pill">{job.status}</span>
        <span className="badge">${job.budget}</span>
      </div>

      <div>
        <h3>{job.title}</h3>
        <p>{job.description}</p>
      </div>

      {isContractor && (
        <>
          {!showform ? (
            <div className="job-actions">
              <button type="button" className="button-primary" onClick={() => setShowForm(true)}>
                Send proposal
              </button>
            </div>
          ) : (
            <div className="form-card wide">
              <div className="form-group">
                <label>Message</label>
                <input placeholder="Сообщение" value={message} onChange={(e) => setMessage(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Price</label>
                <input placeholder="Цена" value={price} onChange={(e) => setPrice(e.target.value)} />
              </div>
              <div className="job-actions">
                <button type="button" className="button-primary" onClick={handleApply}>Отправить</button>
                <button type="button" className="button-secondary" onClick={() => setShowForm(false)}>Отмена</button>
              </div>
            </div>
          )}
        </>
      )}
    </article>
  );
}
