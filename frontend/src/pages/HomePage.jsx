import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import JobCard from "../components/JobCard";

export default function HomePage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/jobs/")
      .then((res) => setJobs(res.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-shell">
      <section className="hero-section">
        <div className="hero-copy">
          <p className="page-kicker">Crowdsourced reputation platform</p>
          <h1 className="page-title">Trusted renovation teams, verified by real project history.</h1>
          <p className="page-subtitle">
            RenoTrust helps clients publish renovation jobs, compare proposals, review contractors and build trust through transparent ratings.
          </p>
          <div className="hero-actions">
            <Link className="button-primary" to="/jobs">Explore jobs</Link>
            <Link className="button-secondary" to="/register">Create account</Link>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="hero-card">
            <h3>Verified proposals</h3>
            <p>Compare price, status and contractor profile in one clean flow.</p>
          </div>
          <div className="hero-card">
            <h3>Reputation layer</h3>
            <p>Ratings and reviews keep renovation teams accountable.</p>
          </div>
          <div className="hero-card">
            <h3>Client dashboard</h3>
            <p>Track active, completed and pending renovation requests.</p>
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="page-header">
          <p className="page-kicker">Marketplace</p>
          <h2 className="section-title">Available renovation jobs</h2>
        </div>
        {loading ? (
          <div className="loading-state">Loading jobs</div>
        ) : jobs.length ? (
          <div className="jobs-grid">
            {jobs.map((job) => <JobCard key={job.id} job={job} />)}
          </div>
        ) : (
          <div className="empty-state">No jobs available yet.</div>
        )}
      </section>
    </div>
  );
}
