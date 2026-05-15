import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import JobModal from '../components/JobModal';

export default function ContractorDashboard() {
  const [jobs, setJobs] = useState([]);
  const [myProposals, setMyProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [jobsRes, proposalsRes] = await Promise.all([
        api.get('/jobs/?status=open'),
        api.get('/proposals/')
      ]);
      setJobs(jobsRes.data);
      setMyProposals(proposalsRes.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="page-shell"><div className="loading-state">Loading contractor workspace</div></div>;

  return (
    <div className="page-shell">
      <div className="page-header">
        <p className="page-kicker">Contractor workspace</p>
        <h1 className="page-title">Find trusted renovation work</h1>
        <p className="page-subtitle">Review open jobs, open details and track proposal statuses from one dashboard.</p>
      </div>

      <div className="stats-grid section-block">
        <article className="stat-card"><h3>{jobs.length}</h3><p>Open jobs</p></article>
        <article className="stat-card"><h3>{myProposals.length}</h3><p>Your proposals</p></article>
        <article className="stat-card"><h3>{myProposals.filter((p) => p.status === 'accepted').length}</h3><p>Accepted</p></article>
      </div>

      <section className="section-block">
        <h2 className="section-title">Available Jobs</h2>
        {jobs.length ? (
          <div className="jobs-list">
            {jobs.map(job => (
              <article key={job.id} className="job-card" onClick={() => setSelectedJobId(job.id)}>
                <div className="job-meta"><span className="badge">${job.budget}</span><span className="status-pill">{job.status}</span></div>
                <h3>{job.title}</h3>
                <p>{job.description || 'No description provided.'}</p>
                <div className="job-actions"><Link to={`/jobs/${job.id}`} className="button-secondary">View Details</Link></div>
              </article>
            ))}
          </div>
        ) : <div className="empty-state">No open jobs at the moment.</div>}
      </section>

      <section className="section-block">
        <h2 className="section-title">My Proposals</h2>
        {myProposals.length ? (
          <div className="proposals-list">
            {myProposals.map(proposal => (
              <article key={proposal.id} className="proposal-card">
                <span className="status-pill">{proposal.status}</span>
                <h3>{proposal.job_title || 'Job'}</h3>
                <p>Price: ${proposal.price}</p>
              </article>
            ))}
          </div>
        ) : <div className="empty-state">No proposals submitted yet.</div>}
      </section>

      {selectedJobId && <JobModal jobId={selectedJobId} onClose={() => setSelectedJobId(null)} />}
    </div>
  );
}
