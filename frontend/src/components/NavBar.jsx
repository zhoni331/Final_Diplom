import { Link, useNavigate } from "react-router-dom";

export default function NavBar() {
  const navigate = useNavigate();
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">RenoTrust</Link>
      </div>
      <div className="nav-links">
        {user ? (
          <>
            <Link to="/">Home</Link>
            {user.role === "client" && (
              <>
                <Link to="/client">Dashboard</Link>
                <Link to="/create-job">Create Job</Link>
                <Link to="/proposals">Proposals</Link>
              </>
            )}

            {user.role === "contractor" && (
              <>
                <Link to="/contractor">Dashboard</Link>
                <Link to="/jobs">Find Jobs</Link>
                <Link to="/my-proposals">Proposals</Link>
              </>
            )}

            <Link to="/profile">Profile</Link>
            <button type="button" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
