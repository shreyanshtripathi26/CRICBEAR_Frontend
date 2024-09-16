import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

function Dashboard() {
    const navigate = useNavigate();
    // Handle logout action
    const handleLogout = () => {
        console.log('Logged out');
        navigate('/login');
    };

    return (
        <div>
            <header className="header">
                <div className="logo">CRICBEAR Dashboard</div>
                <div className="nav">
                    {/* Logout button */}
                    <button onClick={handleLogout} className="logout-button">Logout</button>
                </div>
            </header>
            <div className="dashboard-content">
                <h2>Welcome to CRICBEAR Dashboard</h2>
            </div>
        </div>
    );
}

export default Dashboard;
