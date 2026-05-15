import { useState, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await api.post("/api/token/", { email, password });
      login(res.data.access);
      const me = await api.get("/api/me/");
      localStorage.setItem("user", JSON.stringify(me.data));
      navigate("/");
    } catch (err) {
      console.log("ERROR:", err);
      alert("Ошибка логина");
    }
  };

  return (
    <div className="auth-page">
      <div className="form-card">
        <p className="page-kicker">Welcome back</p>
        <h2>Вход</h2>
        <p>Access your RenoTrust workspace.</p>
        <div className="form-group">
          <label>Email</label>
          <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="form-actions">
          <button type="button" className="button-primary" onClick={handleLogin}>Login</button>
          <Link className="button-secondary" to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
}
