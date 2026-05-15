import { useState, useEffect } from "react";
import api from "../services/api";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ email: "" });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/api/me/");
        setUser(response.data);
        setFormData({ email: response.data.email });
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  const handleSave = async () => {
    try {
      await api.patch("/api/me/", formData);
      setUser({ ...user, ...formData });
      setIsEditing(false);
      alert("Profile updated");
    } catch (err) {
      console.error(err);
      alert("Error updating profile");
    }
  };

  if (!user) return <div className="page-shell"><div className="loading-state">Loading profile</div></div>;

  return (
    <div className="page-shell">
      <div className="page-header">
        <p className="page-kicker">Account</p>
        <h1 className="page-title">Profile</h1>
        <p className="page-subtitle">Manage your account identity and marketplace role.</p>
      </div>

      <div className="form-card">
        <div className="detail-grid">
          <div className="detail-item"><span className="detail-label">Role</span><span className="detail-value">{user.role}</span></div>
          {user.role === "contractor" && <div className="detail-item"><span className="detail-label">Average rating</span><span className="detail-value">{user.average_rating} / 5</span></div>}
        </div>

        <div className="form-group">
          <label>Email</label>
          {isEditing ? (
            <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          ) : <p>{user.email}</p>}
        </div>

        <div className="form-actions">
          {isEditing ? (
            <>
              <button type="button" className="button-primary" onClick={handleSave}>Save</button>
              <button type="button" className="button-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
            </>
          ) : <button type="button" className="button-primary" onClick={() => setIsEditing(true)}>Edit Profile</button>}
        </div>
      </div>
    </div>
  );
}
