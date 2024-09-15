import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import '../styles.css';

function ManageMatch() {
    const navigate = useNavigate();
    const [matches, setMatches] = useState([]);
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [editingMatch, setEditingMatch] = useState({
        team1: '',
        team2: '',
        matchDate: '',
        stadium: '',
        status: '',
        matchType: ''
    });
    const [showPopup, setShowPopup] = useState(false);
    const [tournaments, setTournaments] = useState([]);
    const [selectedTournament, setSelectedTournament] = useState(null);
    const [uid, setUid] = useState(null);

    // Fetch tournaments on component mount
    useEffect(() => {
        fetchTournaments();
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user ? user.uid : null;
        setUid(userId);
    }, []);

    // Fetch tournaments from the server
    const fetchTournaments = async () => {
        try {
            const response = await axios.get('http://localhost:8084/tournament/getAll');
            setTournaments(response.data);
        } catch (error) {
            console.error('Error fetching tournaments:', error);
        }
    };

    // Fetch matches for a specific tournament
    const fetchMatches = async (tid) => {
        try {
            const response = await axios.get(`http://localhost:8084/match/getByTid/${tid}`);
            setMatches(response.data);
        } catch (error) {
            console.error('Error fetching matches:', error);
        }
    };

    // Handle tournament selection change
    const handleTournamentChange = (event) => {
        const tid = parseInt(event.target.value);
        setSelectedTournament(tid);
        fetchMatches(tid);
    };

    // Handle user logout
    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    // Handle managing a specific match
    const handleManage = (match) => {
        setSelectedMatch(match);
        setEditingMatch({
            team1: match.team1,
            team2: match.team2,
            matchDate: match.matchDate.split('T')[0],
            stadium: match.stadium,
            status: match.status,
            matchType: match.type
        });
        setShowPopup(true);
    };

    // Handle input changes in the match editing form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditingMatch({
            ...editingMatch,
            [name]: value
        });
    };

    // Submit updated match details
    const handleSubmit = async () => {
        try {
            console.log(editingMatch);
            const response = await axios.put(`http://localhost:8084/match/update/${selectedMatch.mid}`, editingMatch);
            console.log(response);
            if (response.data) {
                const updatedMatches = matches.map(match =>
                    match.mid === selectedMatch.mid ? response.data : match
                );
                setMatches(updatedMatches);
                setShowPopup(false);
            }
        } catch (error) {
            console.error('Error updating match:', error);
        }
    };

    // Start a match
    const handleStart = async (match) => {
        try {
            const response = await axios.get(`http://localhost:8084/match/start/${match.mid}`);
            if (response.data === "Match started") {
                const updatedMatches = matches.map(m =>
                    m.mid === match.mid ? { ...m, status: 'LIVE' } : m
                );
                setMatches(updatedMatches);
            }
        } catch (error) {
            console.error('Error starting match:', error);
        }
    };

    // Close the match editing popup
    const handleClosePopup = () => {
        setShowPopup(false);
        setSelectedMatch(null);
    };

    // Schedule semi-finals for a tournament
    const handleScheduleSemiFinals = async () => {
        if (!uid) {
            alert('User ID not found. Please log in again.');
            return;
        }
        try {
            const response = await axios.get(`http://localhost:8084/match/semi/${selectedTournament}/${uid}`);
            if (response.data) {
                alert('Semi-finals scheduled successfully!');
                fetchMatches(selectedTournament);
            }
        } catch (error) {
            console.error('Error scheduling semi-finals:', error);
            alert('Failed to schedule semi-finals. Please try again.');
        }
    };

    // Schedule the final match for a tournament
    const handleScheduleFinal = async () => {
        if (!uid) {
            alert('User ID not found. Please log in again.');
            return;
        }
        try {
            const response = await axios.get(`http://localhost:8084/match/final/${selectedTournament}/${uid}`);
            console.log(response.data);
            if (response.data) {
                alert('Final match scheduled successfully!');
                fetchMatches(selectedTournament);
            }
        } catch (error) {
            console.error('Error scheduling final match:', error);
            alert('Failed to schedule final match. Please try again.');
        }
    };

    return (
        <div className="dashboard-container">
            <nav className="sidebar">
                <ul>
                    <li><Link to="../admin/TournamentManagement">Tournament Management</Link></li>
                    <li><Link to="../admin/ManageUser">Manage User</Link></li>
                    <li>Manage Match</li>
                </ul>
            </nav>
            <div className="dashboard-content">
                <button onClick={handleLogout} className="logout-button">Logout</button>
                <h2>Welcome, Admin</h2>
                <div className="tournament-selector">
                    <select onChange={handleTournamentChange}>
                        <option value="">Select Tournament</option>
                        {tournaments.map(tournament => (
                            <option key={tournament.tid} value={tournament.tid}>
                                {tournament.tournamentName}
                            </option>
                        ))}
                    </select>
                </div>
                {selectedTournament && (
                    <div className="schedule-buttons">
                        <button onClick={handleScheduleSemiFinals} className="manage-button">Schedule Semi-Finals</button>
                        <button onClick={handleScheduleFinal} className="manage-button">Schedule Final</button>
                    </div>
                )}
                <div className="match-management-container">
                    <div className="matches-list">
                        {matches.map((match) => (
                            <div key={match.mid} className="match-item">
                                <span>{`${match.team1} vs ${match.team2}`}</span>
                                <div className="button-group">
                                    {match.type !== 'NORMAL' && (
                                        <button onClick={() => handleManage(match)} className="manage-button">MANAGE</button>
                                    )}
                                    {match.status === 'UPCOMING' && (
                                        <button onClick={() => handleStart(match)} className="start-button">START</button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {showPopup && selectedMatch && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h2>{`Match ${selectedMatch.mid}`}</h2>
                        <div className="popup-form">
                            <div className="form-group">
                                <label htmlFor="team1">Team 1:</label>
                                <input
                                    id="team1"
                                    type="text"
                                    name="team1"
                                    value={editingMatch.team1}
                                    onChange={handleInputChange}
                                    disabled
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="team2">Team 2:</label>
                                <input
                                    id="team2"
                                    type="text"
                                    name="team2"
                                    value={editingMatch.team2}
                                    onChange={handleInputChange}
                                    disabled
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="matchDate">Date:</label>
                                <input
                                    id="matchDate"
                                    type="date"
                                    name="matchDate"
                                    value={editingMatch.matchDate}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="stadium">Stadium:</label>
                                <input
                                    id="stadium"
                                    type="text"
                                    name="stadium"
                                    value={editingMatch.stadium}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="status">Status:</label>
                                <select
                                    id="status"
                                    name="status"
                                    value={editingMatch.status}
                                    onChange={handleInputChange}
                                >
                                    <option value="UPCOMING">UPCOMING</option>
                                    <option value="LIVE">LIVE</option>
                                    <option value="COMPLETED">COMPLETED</option>
                                </select>
                            </div>
                        </div>
                        <div className="popup-buttons">
                            <button onClick={handleSubmit} className="submit-button">MAKE CHANGES</button>
                            <button onClick={handleClosePopup} className="close-button">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ManageMatch;