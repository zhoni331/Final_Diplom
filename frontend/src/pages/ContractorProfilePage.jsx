import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

export default function ContractorProfilePage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/users/${id}/`)
      .then(res => { setUser(res.data); setLoading(false); })
      .catch(err => { console.log(err); setLoading(false); });
  }, [id]);

  if (loading) return <div className="page-shell"><div className="loading-state">Loading contractor profile</div></div>;
  if (!user) return <div className="page-shell"><div className="empty-state">User not found</div></div>;

  return (
    <div className="page-shell">
      <div className="page-header">
        <p className="page-kicker">Contractor reputation</p>
        <h1 className="page-title">Contractor Profile</h1>
        <p className="page-subtitle">Check contractor role and average reputation before accepting a proposal.</p>
      </div>
      <div className="form-card">
        <h2>{user.email}</h2>
        <div className="detail-grid">
          <div className="detail-item"><span className="detail-label">Role</span><span className="detail-value">{user.role}</span></div>
          {user.role === 'contractor' && <div className="detail-item"><span className="detail-label">Average rating</span><span className="detail-value">{user.average_rating} / 5</span></div>}
        </div>
      </div>
    </div>
  );
}
