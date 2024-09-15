import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles.css';

function AdminDashboard() {
    const navigate = useNavigate();

    // Handle user logout
    const handleLogout = () => {
        navigate('/login');
    };

    return (
        <div className="dashboard-container">
            {/* Sidebar navigation for admin functions */}
            <nav className="sidebar">
                <ul>
                    <li><Link to="./TournamentManagement">Tournament Management</Link></li>
                    <li><Link to="./ManageUser">Manage User</Link></li>
                    <li><Link to="./ManageMatch">Manage Match</Link></li>
                </ul>
            </nav>
            <div className="dashboard-content">
                {/* Logout button and welcome message */}
                <button onClick={handleLogout} className="logout-button">Logout</button>
                <h2>Welcome, Admin</h2>
                <p>Select an option from the sidebar.</p>

            </div>
        </div>
    );
}

export default AdminDashboard;
