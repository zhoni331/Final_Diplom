import { useEffect, useState } from "react";
import { getMyJobs } from "../services/jobs";

export default function JobsFeed() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async () => {
    try {
      console.log("REQUEST TO API");
      const res = await getMyJobs();
      console.log("API RESPONSE:", res);
      console.log("API DATA:", res.data);
      setJobs(res.data);
    } catch (err) {
      console.log("FETCH ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="page-header">
        <p className="page-kicker">Open marketplace</p>
        <h1 className="page-title">Доступные заказы</h1>
        <p className="page-subtitle">Browse renovation requests and prepare proposals for clients.</p>
      </div>
      {loading ? <div className="loading-state">Loading jobs</div> : jobs.length ? (
        <div className="jobs-grid">
          {(Array.isArray(jobs) ? jobs : []).map((job) => (
            <article key={job.id} className="job-card">
              <div className="job-meta"><span className="badge">${job.budget}</span><span className="status-pill">{job.status}</span></div>
              <h3>{job.title}</h3>
              <p>{job.description}</p>
            </article>
          ))}
        </div>
      ) : <div className="empty-state">No jobs available.</div>}
    </div>
  );
}
