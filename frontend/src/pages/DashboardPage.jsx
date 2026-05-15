import { useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/api/me/")
      .then(res => {
        if (res.data.role === "client") {
          navigate("/client");
        } else {
          navigate("/contractor");
        }
      })
      .catch(err => console.log(err));
  }, [navigate]);

  return <div className="page-shell"><div className="loading-state">Loading dashboard</div></div>;
}
