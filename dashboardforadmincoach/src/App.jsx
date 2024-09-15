import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import CoachDashboard from './components/CoachDashboard';
import TournamentManagement from './components/TournamentManagement';
import ManageUser from "./components/ManageUser";
import ManageMatch from "./components/ManageMatch";
import RegisterTournament from "./components/RegisterTournament";
import CreatePlayer from "./components/CreatePlayer";
import ManageTeam from "./components/ManageTeam";

// Component to protect routes based on user role
const ProtectedRoute = ({ children, allowedRole }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== allowedRole) {
        return <Navigate to="/login" />;
    }
    return children;
};

// Main App component defining the routing structure
function App() {
    return (
        <AuthProvider>
            <div className="App">
                {/* Define routes for different pages and protect them based on user roles */}
                <Routes>
                    {/* Default route redirects to Login */}
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route path="/login" element={<Login />} />
                    {/* Protected routes for Admin */}
                    <Route path="/admin" element={
                        <ProtectedRoute allowedRole="ADMIN">
                            <AdminDashboard />
                        </ProtectedRoute>
                    } />
                    {/* Protected routes for Coach */}
                    <Route path="/coach" element={
                        <ProtectedRoute allowedRole="COACH">
                            <CoachDashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/TournamentManagement" element={
                        <ProtectedRoute allowedRole="ADMIN">
                            <TournamentManagement />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/ManageUser" element={
                        <ProtectedRoute allowedRole="ADMIN">
                            <ManageUser />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/ManageMatch" element={
                        <ProtectedRoute allowedRole="ADMIN">
                            <ManageMatch />
                        </ProtectedRoute>
                    } />
                    <Route path="/coach/RegisterTournament" element={
                        <ProtectedRoute allowedRole="COACH">
                            <RegisterTournament />
                        </ProtectedRoute>
                    } />
                    <Route path="/coach/CreatePlayer" element={
                        <ProtectedRoute allowedRole="COACH">
                            <CreatePlayer />
                        </ProtectedRoute>
                    } />
                    <Route path="/coach/ManageTeam" element={
                        <ProtectedRoute allowedRole="COACH">
                            <ManageTeam />
                        </ProtectedRoute>
                    } />
                </Routes>
            </div>
        </AuthProvider>
    );
}

export default App;