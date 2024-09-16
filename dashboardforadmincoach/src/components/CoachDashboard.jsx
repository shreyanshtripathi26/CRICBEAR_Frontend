import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles.css';

function CoachDashboard() {
    const navigate = useNavigate();
    // Handle user logout
    const handleLogout = () => {
        navigate('/login');
    };

    return (
        <div className="dashboard-container">
            {/* Sidebar navigation for coach functions */}
            <nav className="sidebar">
                <ul>
                    <li><Link to="./RegisterTournament">Register Tournament</Link></li>
                    <li><Link to="./CreatePlayer"> Create Player</Link></li>
                    <li><Link to="./ManageTeam">Manage Team</Link></li>
                </ul>
            </nav>
            <div className="dashboard-content">
                {/* Logout button and welcome message */}
                <button onClick={handleLogout} className="logout-button">Logout</button>
                <h2>Welcome, Coach</h2>
                <p>Select an option from the sidebar.</p>

            </div>
        </div>
    );
}

export default CoachDashboard;
