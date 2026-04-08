import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Portfolio from './Portfolio.jsx';
import Login from './admin/Login.jsx';
import AdminDashboard from './admin/AdminDashboard.jsx';
import ProjectManager from './admin/sections/ProjectManager.jsx';
import SkillManager from './admin/sections/SkillManager.jsx';
import ProfileManager from './admin/sections/ProfileManager.jsx';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Portfolio Route */}
        <Route path="/" element={<Portfolio />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />}>
          <Route index element={<Navigate to="/admin/projects" replace />} />
          <Route path="projects" element={<ProjectManager />} />
          <Route path="skills" element={<SkillManager />} />
          <Route path="profile" element={<ProfileManager />} />
        </Route>

        {/* Catch-all redirect to Portfolio */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
