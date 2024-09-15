import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles.css';
import { Link, useNavigate } from "react-router-dom";

function TournamentManagement() {
    const navigate = useNavigate();

    // Retrieve uid from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    const uid = user ? user.uid : null;

    const [tournaments, setTournaments] = useState([]);
    const [currentTournamentIndex, setCurrentTournamentIndex] = useState(null);
    const [newTournament, setNewTournament] = useState({
        tid: '',
        tournamentName: '',
        startDate: '',
        endDate: '',
        status: 'UPCOMING',
        uid: uid
    });

    // Handle user logout
    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    // Fetch all tournaments
    useEffect(() => {
        axios.get("http://localhost:8084/tournament/getAll")
            .then(response => setTournaments(response.data))
            .catch(error => console.error("Error fetching tournaments:", error));
    }, []);

    // Handle input changes in the tournament form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTournament({
            ...newTournament,
            [name]: value
        });
    };

    // Create or edit a tournament
    const handleCreateOrEdit = () => {
        const tournamentData = { ...newTournament, uid };
        if (currentTournamentIndex !== null) {
            axios.put("http://localhost:8084/tournament/update", tournamentData)
                .then(response => {
                    const updatedTournaments = [...tournaments];
                    updatedTournaments[currentTournamentIndex] = response.data;
                    setTournaments(updatedTournaments);
                    setCurrentTournamentIndex(null);
                    resetNewTournament();
                })
                .catch(error => console.error("Error updating tournament:", error));
        } else {
            axios.post("http://localhost:8084/tournament/create", tournamentData)
                .then(response => {
                    setTournaments([...tournaments, response.data]);
                    resetNewTournament();
                })
                .catch(error => console.error("Error creating tournament:", error));
        }
    };

    // Set up tournament editing
    const handleEdit = (index) => {
        setCurrentTournamentIndex(index);
        setNewTournament(tournaments[index]);
    };

    // Delete a tournament
    const handleDelete = (index) => {
        const tournamentId = tournaments[index].tid;
        axios.delete(`http://localhost:8084/tournament/delete/${tournamentId}`)
            .then(() => {
                setTournaments(tournaments.filter((_, i) => i !== index));
                resetNewTournament();
            })
            .catch(error => console.error("Error deleting tournament:", error));
    };

    // Start a tournament
    const handleStart = (tid) => {
        axios.post("http://localhost:8084/tournament/start", { tid, uid })
            .then(response => {
                const updatedTournaments = tournaments.map(tournament =>
                    tournament.tid === tid ? { ...tournament, status: 'LIVE' } : tournament
                );
                setTournaments(updatedTournaments);
            })
            .catch(error => console.error("Error starting tournament:", error));
    };

    // Reset the new tournament form
    const resetNewTournament = () => {
        setNewTournament({
            tid: '',
            tournamentName: '',
            startDate: '',
            endDate: '',
            status: 'UPCOMING',
            uid: uid
        });
        setCurrentTournamentIndex(null);
    };

    return (
        <div className="dashboard-container">
            <nav className="sidebar">
                <ul>
                    <li>Tournament Management</li>
                    <li><Link to="../admin/ManageUser">Manage User</Link></li>
                    <li><Link to="../admin/ManageMatch">Manage Match</Link></li>
                </ul>
            </nav>
            <div className="dashboard-content">
                <button onClick={handleLogout} className="logout-button">Logout</button>
                <h2>Welcome, Admin</h2>
                <div className="tournament-management-container">
                    <h2>{currentTournamentIndex !== null ? 'Edit Tournament' : 'Create Tournament'}</h2>
                    <div className="form-container">
                        <input
                            type="text"
                            name="tournamentName"
                            placeholder="Tournament Name"
                            value={newTournament.tournamentName}
                            onChange={handleInputChange}
                            className="input-field"
                        />
                        <input
                            type="datetime-local"
                            name="startDate"
                            placeholder="Start Date"
                            value={newTournament.startDate}
                            onChange={handleInputChange}
                            className="input-field"
                        />
                        <input
                            type="datetime-local"
                            name="endDate"
                            placeholder="End Date"
                            value={newTournament.endDate}
                            onChange={handleInputChange}
                            className="input-field"
                        />
                        <select
                            name="status"
                            value={newTournament.status}
                            onChange={handleInputChange}
                            className="input-field"
                        >
                            <option value="LIVE">Live</option>
                            <option value="UPCOMING">Upcoming</option>
                            <option value="COMPLETED">Completed</option>
                        </select>
                        <button onClick={handleCreateOrEdit} className="create-button">
                            {currentTournamentIndex !== null ? 'Update' : 'Create'}
                        </button>
                    </div>

                    <h2>Tournaments List</h2>
                    <div className="tournament-list">
                        {tournaments.map((tournament, index) => (
                            <div key={index} className="tournament-item">
                                <h3>{tournament.tournamentName}</h3>
                                <p>Start Date: {new Date(tournament.startDate).toLocaleString()}</p>
                                <p>End Date: {new Date(tournament.endDate).toLocaleString()}</p>
                                <p>Status: {tournament.status}</p>
                                <p>Creator UID: {tournament.uid}</p>
                                <div className="button-container">
                                    <button onClick={() => handleEdit(index)} className="edit-button">Edit</button>
                                    <button onClick={() => handleDelete(index)} className="delete-button">Delete
                                    </button>
                                    {tournament.status === 'UPCOMING' && tournament.uid === uid && (
                                        <button onClick={() => handleStart(tournament.tid)}
                                                className="start-button">Start</button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TournamentManagement;