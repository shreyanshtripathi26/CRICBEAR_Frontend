import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles.css';

const ManageTeam = () => {
    const navigate = useNavigate();
    const [teamName, setTeamName] = useState('');
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [showAddPlayerPopup, setShowAddPlayerPopup] = useState(false);
    const [allPlayers, setAllPlayers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null);

    const user = JSON.parse(localStorage.getItem('user'));
    const coachId = user ? user.uid : null;

    // Fetch players and teams on component mount
    useEffect(() => {
        fetchPlayers();
        fetchTeams();
    }, []);

    // Fetch all players from the server
    const fetchPlayers = async () => {
        try {
            const response = await axios.get('http://localhost:8084/player/getAll');
            setAllPlayers(response.data || []);
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching players:', error);
            setAllPlayers([]);
        }
    };

    // Fetch teams associated with the current coach
    const fetchTeams = async () => {
        try {
            const response = await axios.get('http://localhost:8084/team/getAll');
            const coachTeams = response.data.filter(team => team.coachId === coachId) || [];
            setTeams(coachTeams);
            console.log(teams);
        } catch (error) {
            console.error('Error fetching teams:', error);
            setTeams([]);
        }
    };

    // Fetch players for a specific team
    const fetchTeamPlayers = async (teamId) => {
        try {
            const response = await axios.get(`http://localhost:8084/playerTeams/team/${teamId}`);
            setSelectedPlayers(response.data || []);
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching team players:', error);
            setSelectedPlayers([]);
        }
    };

    // Handle user logout
    const handleLogout = () => {
        navigate('/login');
    };

    // Save a new team
    const handleSaveTeam = async () => {
        if (!teamName) {
            alert('Please enter a team name');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8084/team/create', {
                teamName: teamName,
                coachId: coachId
            });

            if (response.data) {
                alert('Team created successfully');
                setTeamName('');
                fetchTeams();
            } else {
                alert('Team name already exists');
            }
        } catch (error) {
            console.error('Error saving team:', error);
            alert('Failed to save team: ' + (error.response?.data?.message || error.message));
        }
    };

    // Add a player to the selected team
    const handleAddPlayer = async (player) => {
        if (!selectedTeam) {
            alert('Please select a team first');
            return;
        }

        if (selectedPlayers.length >= 15) {
            alert('A team can have a maximum of 15 players');
            return;
        }

        if (!selectedPlayers.find(p => p.pid === player.pid)) {
            const playerToAdd = [{
                pid: player.pid,
                teamId: selectedTeam.teamId,
                overseas: player.overseas,
                playerRole: player.playerRole,
                runsScored: 0,
                balls: 0,
                wickets: 0,
                overs: 0,
                runsGiven: 0
            }];

            try {
                await axios.post('http://localhost:8084/playerTeams/addPlayerTeam', playerToAdd);
                fetchTeamPlayers(selectedTeam.teamId);
                console.log(selectedTeam.teamId);
            } catch (error) {
                console.error('Error adding player to team:', error);
                alert('Failed to add player to team: ' + (error.response?.data?.message || error.message));
            }
        } else {
            alert('Player is already in the team');
        }
    };

    // Remove a player from the team
    const handleRemovePlayer = async (player) => {
        try {
            await axios.delete(`http://localhost:8084/playerTeams/delete/${player.pid}`);
            fetchTeamPlayers(selectedTeam.teamId);
        } catch (error) {
            console.error('Error removing player from team:', error);
            alert('Failed to remove player from team: ' + (error.response?.data?.message || error.message));
        }
    };

    // Handle team selection change
    const handleTeamSelect = (e) => {
        const team = teams.find(t => t.teamId === parseInt(e.target.value));

        setSelectedTeam(team);
        if (team) {
            fetchTeamPlayers(team.teamId);
        }
    };

    // Filter players based on search term
    const filteredPlayers = allPlayers.filter(player =>
        player.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="dashboard-container">
            <nav className="sidebar">
                <ul>
                    <li><Link to="../coach/RegisterTournament">Register Tournament</Link></li>
                    <li><Link to="../coach/CreatePlayer">Create Player</Link></li>
                    <li>Manage Team</li>
                </ul>
            </nav>
            <div className="dashboard-content tournament-registration-container">
                <button onClick={handleLogout} className="logout-button">Logout</button>
                <h2>Welcome, Coach</h2>
                <h2>Manage Team</h2>
                <div className="team-form">
                    <input
                        type="text"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        placeholder="Team Name"
                        className="search-input"
                    />
                    <button onClick={handleSaveTeam} className="submit-button">SAVE TEAM</button>

                    <select onChange={handleTeamSelect} className="input-field">
                        <option value="">Select a team</option>
                        {teams.map(team => (
                            <option key={team.teamId} value={team.teamId}>{team.teamName}</option>
                        ))}
                    </select>

                    {selectedTeam && (
                        <button onClick={() => setShowAddPlayerPopup(true)} className="register-button">ADD PLAYER</button>
                    )}

                    <div className="tournaments-list">
                        {selectedPlayers.map(player => (
                            <div key={player.pid} className="tournament-item">
                                <span>{player.name} - {player.playerRole} {player.overseas ? '(Overseas)' : ''}</span>
                                <button onClick={() => handleRemovePlayer(player)} className="delete-button">REMOVE</button>
                            </div>
                        ))}
                    </div>
                </div>

                {showAddPlayerPopup && (
                    <div className="registration-modal">
                        <h3>Player List</h3>
                        <div className="search-container">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search players"
                                className="search-input"
                            />
                        </div>
                        <div className="tournaments-list">
                            {filteredPlayers.map(player => (
                                <div key={player.pid} className="tournament-item">
                                    <span>{player.name} - {player.playerRole} - {player.overseas ? 'Overseas' : 'Indian'}</span>
                                    <button onClick={() => handleAddPlayer(player)} className="add-button">ADD</button>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => setShowAddPlayerPopup(false)} className="add-button">CLOSE</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageTeam;