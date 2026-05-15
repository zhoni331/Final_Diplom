import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";

export default function JobPage() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [user, setUser] = useState(null);
  const [score, setScore] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    setUser(u);
    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchData = async () => {
    try {
      const jobRes = await api.get(`/jobs/${id}/`);
      setJob(jobRes.data);
      const propRes = await api.get("/proposals/", { params: { t: Date.now() } });
      setProposals(propRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAccept = async (proposalId) => {
    try {
      await api.post(`/proposals/${proposalId}/accept/`);
      alert("Принято ✅");
      fetchData();
    } catch (err) {
      console.error(err.response?.data || err);
    }
  };

  const handleComplete = async () => {
    try {
      await api.post(`/jobs/${id}/COMPLETE/`);
      alert("Завершено ✅");
      fetchData();
    } catch (err) {
      console.error(err.response?.data || err);
    }
  };

  const handleRate = async () => {
    try {
      await api.post("/ratings/", { job: id, score, comment });
      alert("Оценка отправлена 🌟");
    } catch (err) {
      console.error(err.response?.data || err);
    }
  };

  if (!job) return <div className="page-shell"><div className="loading-state">Loading job</div></div>;

  const jobProposals = proposals.filter((p) => p.job === job?.id);

  return (
    <div className="page-shell">
      <div className="page-header">
        <p className="page-kicker">Job workspace</p>
        <h1 className="page-title">{job.title}</h1>
        <p className="page-subtitle">{job.description}</p>
      </div>

      <article className="card">
        <div className="job-meta"><span className="status-pill">{job.status}</span><span className="badge">${job.budget}</span></div>
        {user?.role === "client" && job.status === "in_progress" && (
          <div className="job-actions"><button type="button" className="button-primary" onClick={handleComplete}>Завершить работу</button></div>
        )}
      </article>

      {user?.role === "client" && (
        <section className="section-block">
          <h2 className="section-title">Отклики</h2>
          {jobProposals.length ? jobProposals.map((p) => (
            <article key={p.id} className="proposal-card section-block">
              <span className="status-pill">{p.status}</span>
              <div className="proposal-row">
                <p><strong>Contractor:</strong> {p.contractor_email}</p>
                <p>{p.message}</p>
                <p><strong>Цена:</strong> ${p.price}</p>
              </div>
              <div className="proposal-actions">
                {p.contractor_id ? <Link to={`/contractor/${p.contractor_id}`} className="button-secondary">View Profile</Link> : <span className="badge">No contractor_id</span>}
                {p.status === "pending" && <button type="button" className="button-primary" onClick={() => handleAccept(p.id)}>Accept</button>}
              </div>
            </article>
          )) : <div className="empty-state">No proposals for this job yet.</div>}
        </section>
      )}

      {user?.role === "client" && job.status === "completed" && (
        <section className="form-card section-block">
          <h3 className="section-title">Оценить исполнителя</h3>
          <div className="form-group"><label>Score</label><input type="number" min="1" max="5" value={score} onChange={(e) => setScore(e.target.value)} /></div>
          <div className="form-group"><label>Comment</label><textarea placeholder="Комментарий" value={comment} onChange={(e) => setComment(e.target.value)} /></div>
          <button type="button" className="button-primary" onClick={handleRate}>Отправить оценку</button>
        </section>
      )}
    </div>
  );
}
