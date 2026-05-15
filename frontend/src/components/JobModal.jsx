import { useState, useEffect } from 'react';
import api from '../services/api';

export default function JobModal({ jobId, onClose, onComplete }) {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  useEffect(() => { fetchJob(); }, [jobId]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchJob = async () => {
    try {
      const res = await api.get(`/jobs/${jobId}/`);
      setJob(res.data);
      const ratingRes = await api.get('/ratings/');
      const hasRating = ratingRes.data.some(r => r.job === jobId);
      setRatingSubmitted(hasRating);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    setCompleting(true);
    try {
      await api.post(`/jobs/${jobId}/complete/`);
      setJob({ ...job, status: 'completed' });
      onComplete && onComplete();
    } catch (err) {
      console.log(err);
    } finally {
      setCompleting(false);
    }
  };

  const handleRate = async () => {
    try {
      await api.post('/ratings/', { job: jobId, rating, comment });
      setRatingSubmitted(true);
      alert('Rating submitted!');
    } catch (err) {
      console.log(err);
      alert('Не удалось отправить рейтинг. Проверьте, что вы авторизованы и работа в статусе In Progress.');
    }
  };

  if (loading) return <div className="modal-overlay" onClick={onClose}><div className="modal-content"><div className="loading-state">Loading job</div></div></div>;
  if (!job) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <p className="page-kicker">Job details</p>
        <h2>{job.title}</h2>
        <p>{job.description}</p>
        <div className="detail-grid">
          <div className="detail-item"><span className="detail-label">Budget</span><span className="detail-value">${job.budget}</span></div>
          <div className="detail-item"><span className="detail-label">Status</span><span className="detail-value">{job.status}</span></div>
          <div className="detail-item"><span className="detail-label">Client</span><span className="detail-value">{job.client_email || 'Unknown'}</span></div>
          <div className="detail-item"><span className="detail-label">Created</span><span className="detail-value">{new Date(job.created_at).toLocaleDateString()}</span></div>
        </div>

        {job.status === 'in_progress' && (
          <>
            <button onClick={handleComplete} disabled={!ratingSubmitted || completing} className="button-primary">
              {completing ? 'Completing...' : ratingSubmitted ? 'Complete Job' : 'Rate contractor first'}
            </button>
            {!ratingSubmitted && (
              <div className="rating-form">
                <h3>Rate the Contractor</h3>
                <label>Rating<select value={rating} onChange={e => setRating(Number(e.target.value))}>{[1,2,3,4,5].map(n => <option key={n} value={n}>{n} / 5</option>)}</select></label>
                <label>Comment<textarea value={comment} onChange={e => setComment(e.target.value)} /></label>
                <button onClick={handleRate} className="button-primary">Submit Rating</button>
              </div>
            )}
          </>
        )}

        {job.status === 'completed' && !ratingSubmitted && (
          <div className="rating-form">
            <h3>Rate the Contractor</h3>
            <label>Rating<select value={rating} onChange={e => setRating(Number(e.target.value))}>{[1,2,3,4,5].map(n => <option key={n} value={n}>{n} / 5</option>)}</select></label>
            <label>Comment<textarea value={comment} onChange={e => setComment(e.target.value)} /></label>
            <button onClick={handleRate} className="button-primary">Submit Rating</button>
          </div>
        )}

        <button onClick={onClose} className="button-secondary">Close</button>
      </div>
    </div>
  );
}
