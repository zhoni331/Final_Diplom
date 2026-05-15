import { useEffect, useState } from "react";
import api, { getMe } from "../services/api";
import { useNavigate } from "react-router-dom";

const ProposalsPage = () => {
  const [proposals, setProposals] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const userData = await getMe();
        setUser(userData);
        const res = await api.get("/proposals/");
        setProposals(res.data);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleAccept = async (id) => {
    try {
      await api.post(`/proposals/${id}/accept/`);
      alert("Заявка принята");
      setProposals(prev => prev.map(p => p.id === id ? { ...p, status: "accepted" } : { ...p, status: "rejected" }));
    } catch (err) {
      console.error(err.response?.data || err);
      alert("Ошибка при принятии заявки");
    }
  };

  return (
    <div className="page-shell">
      <div className="page-header">
        <p className="page-kicker">Client decisions</p>
        <h1 className="page-title">Отклики</h1>
        <p className="page-subtitle">Review contractor offers, inspect profiles and accept the best proposal.</p>
      </div>
      {loading ? <div className="loading-state">Loading proposals</div> : proposals.length ? (
        <div className="proposals-grid">
          {proposals.map(p => (
            <article key={p.id} className="proposal-card">
              <span className="status-pill">{p.status}</span>
              <div className="proposal-row">
                <p><strong>Job:</strong> {p.job}</p>
                <p><strong>Message:</strong> {p.message}</p>
                <p><strong>Price:</strong> ${p.price}</p>
              </div>
              {user?.role === "client" && p.status === "pending" && (
                <div className="proposal-actions">
                  <button type="button" className="button-secondary" onClick={() => navigate(`/contractors/${p.contractor_id}`)}>View Profile</button>
                  <button type="button" className="button-primary" onClick={() => handleAccept(p.id)}>Accept</button>
                </div>
              )}
            </article>
          ))}
        </div>
      ) : <div className="empty-state">No proposals received yet.</div>}
    </div>
  );
};

export default ProposalsPage;
