import { useEffect, useState } from "react";
import api from "../services/api";

export default function MyProposalsPage() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchProposals(); }, []);

  const fetchProposals = async () => {
    try {
      const response = await api.get("/proposals/");
      setProposals(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="page-header">
        <p className="page-kicker">Proposal tracking</p>
        <h1 className="page-title">My Proposals</h1>
        <p className="page-subtitle">Track all sent proposals and their current client decision status.</p>
      </div>
      {loading ? <div className="loading-state">Loading proposals</div> : proposals.length ? (
        <div className="proposals-grid">
          {proposals.map((proposal) => (
            <article key={proposal.id} className="proposal-card">
              <span className="status-pill">{proposal.status}</span>
              <div className="proposal-row">
                <p><strong>Job:</strong> {proposal.job}</p>
                <p><strong>Message:</strong> {proposal.message}</p>
                <p><strong>Price:</strong> ${proposal.price}</p>
              </div>
            </article>
          ))}
        </div>
      ) : <div className="empty-state">No proposals yet.</div>}
    </div>
  );
}
