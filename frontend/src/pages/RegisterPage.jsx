import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api.js";
import { AuthContext } from "../context/AuthContext";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("client");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const res = await api.post("/api/register/", { email, password, role });
      login(res.data.access, res.data.user);
      navigate("/home");
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="auth-page">
      <div className="form-card">
        <p className="page-kicker">Create account</p>
        <h2>Регистрация</h2>
        <p>Join as a client or contractor.</p>
        <div className="form-group">
          <label>Email</label>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="client">Client</option>
            <option value="contractor">Contractor</option>
          </select>
        </div>
        <div className="form-actions">
          <button type="button" className="button-primary" onClick={handleRegister}>Register</button>
          <Link className="button-secondary" to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}
