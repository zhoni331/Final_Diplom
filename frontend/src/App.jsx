import './App.css'

import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import CreateJob from "./pages/CreateJob";
import JobsFeed from "./pages/JobsFeed";
import ProposalsPage from "./pages/ProposalsPage";
import JobPage from "./pages/JobPage";
import ClientDashboard from "./pages/ClientDashboard";
import ContractorDashboard from "./pages/ContractorDashboard";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import MyProposalsPage from "./pages/MyProposalsPage";
import ContractorProfilePage from "./pages/ContractorProfilePage";
import Layout from './components/Layout'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/login" element={<Layout><LoginPage /></Layout>} />
        <Route path="/register" element={<Layout><RegisterPage /></Layout>} />
        <Route path="/client" element={<Layout><ClientDashboard /></Layout>} />
        <Route path="/contractor" element={<Layout><ContractorDashboard /></Layout>} />
        <Route path="/dashboard" element={<Layout><DashboardPage /></Layout>} />
        <Route path="/create-job" element={<Layout><CreateJob /></Layout>} />
        <Route path="/jobs" element={<Layout><JobsFeed /></Layout>} />
        <Route path="/proposals" element={<Layout><ProposalsPage /></Layout>} />
        <Route path="/jobs/:id" element={<Layout><JobPage /></Layout>} />
        <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
        <Route path="/contractor/:id" element={<Layout><ContractorProfilePage /></Layout>} />
        <Route path="/my-proposals" element={<Layout><MyProposalsPage /></Layout>} />
        <Route path="/contractors/:id" element={<Layout><ContractorProfilePage /></Layout>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
