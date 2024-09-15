import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles.css';

function CreatePlayer() {
    const navigate = useNavigate();
    // State for player data and error message
    const [playerData, setPlayerData] = useState({
        name: '',
        player_roles: '',
        overseas: false // Defaulting to false (Indian player)
    });
    const [errorMessage, setErrorMessage] = useState('');

    // Handle user logout
    const handleLogout = () => {
        navigate('/login');
    };

    // Handle input changes in the player form
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setPlayerData(prevData => ({
            ...prevData,
            [name]: name === 'overseas' ? value === 'true' : value
        }));
    };

    // Submit new player data to the server
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8084/player/create', playerData);
            if (response) {
                console.log('Player created successfully:', response.data);
                setPlayerData({ name: '', player_roles: '', overseas: false });

            } else {
                setErrorMessage('Error creating player. Please try again.');
            }
        } catch (error) {
            console.error('Error while creating player:', error);
            setErrorMessage('Error creating player. Please try again.');
        }
    };

    return (
        <div className="dashboard-container">
            <nav className="sidebar">
                <ul>
                    <li><Link to="../coach/RegisterTournament">Register Tournament</Link></li>
                    <li>Create Player</li>
                    <li><Link to="../coach/ManageTeam">Manage Team</Link></li>
                </ul>
            </nav>
            <div className="dashboard-content">
                <button onClick={handleLogout} className="logout-button">Logout</button>
                <h2>Welcome, Coach</h2>
                <h2>Create Player</h2>
                <form onSubmit={handleSubmit} className="tournament-management-container">
                    <div className="input-field">
                        <label htmlFor="name">Name</label>
                        <input
                            className="input-field"
                            type="text"
                            id="name"
                            name="name"
                            value={playerData.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="input-field">
                        <label htmlFor="playerRole">Player Role</label>
                        <select
                            id="player_roles"
                            name="playerRole"
                            value={playerData.playerRole}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Role</option>
                            <option value="BATSMAN">Batsman</option>
                            <option value="BOWLER">Bowler</option>
                            <option value="ALLROUNDER">All-rounder</option>
                            <option value="WICKETKEEPER">Wicketkeeper</option>
                        </select>
                    </div>
                    <div className="input-field">
                        <label htmlFor="overseas">Overseas</label>
                        <select
                            id="overseas"
                            name="overseas"
                            value={playerData.overseas ? 'true' : 'false'}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="false">Indian</option>
                            <option value="true">Non-Indian</option>
                        </select>
                    </div>
                    <button type="submit" className="create-button">Create</button>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                </form>
            </div>
        </div>
    );
}

export default CreatePlayer;
