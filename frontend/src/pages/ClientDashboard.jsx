import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import JobModal from '../components/JobModal';

export default function ClientDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState(null);

  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get('/jobs/');
      setJobs(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = () => { fetchJobs(); };

  if (loading) return <div className="page-shell"><div className="loading-state">Loading dashboard</div></div>;

  return (
    <div className="page-shell">
      <div className="page-header">
        <p className="page-kicker">Client workspace</p>
        <h1 className="page-title">Your renovation requests</h1>
        <p className="page-subtitle">Create jobs, monitor statuses and complete projects after contractor review.</p>
      </div>

      <div className="stats-grid section-block">
        <article className="stat-card"><h3>{jobs.length}</h3><p>Total jobs</p></article>
        <article className="stat-card"><h3>{jobs.filter((job) => job.status === 'open').length}</h3><p>Open requests</p></article>
        <article className="stat-card"><h3>{jobs.filter((job) => job.status === 'completed').length}</h3><p>Completed</p></article>
      </div>

      <div className="section-block job-actions">
        <Link to="/create-job" className="button-primary">Create New Job</Link>
      </div>

      <section className="section-block">
        <h2 className="section-title">My Jobs</h2>
        {jobs.length ? (
          <div className="jobs-list">
            {jobs.map(job => (
              <article key={job.id} className="job-card" onClick={() => setSelectedJobId(job.id)}>
                <div className="job-meta">
                  <span className="status-pill">{job.status}</span>
                  <span className="badge">${job.budget}</span>
                </div>
                <h3>{job.title}</h3>
                <p>{job.description || 'No description provided.'}</p>
              </article>
            ))}
          </div>
        ) : <div className="empty-state">No jobs created yet.</div>}
      </section>

      {selectedJobId && <JobModal jobId={selectedJobId} onClose={() => setSelectedJobId(null)} onComplete={handleComplete} />}
    </div>
  );
}
