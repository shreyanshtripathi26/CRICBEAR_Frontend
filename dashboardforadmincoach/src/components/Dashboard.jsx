import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

function Dashboard() {
    const navigate = useNavigate();  // Hook to programmatically navigate between routes

    // Handle logout action
    const handleLogout = () => {
        navigate('/login');  // Redirect to the login page after logout
    };

    return (
        <div>
            <header className="header">
                <div className="logo">CRICBEAR Dashboard</div>  // Logo of the app
                <div className="nav">
                    {/* Logout button */}
                    <button onClick={handleLogout} className="logout-button">Logout</button>
                </div>
            </header>
            <div className="dashboard-content">
                <h2>Welcome to CRICBEAR Dashboard</h2>  {/* Dashboard welcome message */}
                {/* Add your dashboard content here */}
            </div>
        </div>
    );
}

export default Dashboard;
