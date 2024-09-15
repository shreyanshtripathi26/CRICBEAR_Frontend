import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles.css';
import axios from 'axios';

function RegisterTournament() {
    const navigate = useNavigate();
    const [tournaments, setTournaments] = useState([]);
    const [registrationMessage, setRegistrationMessage] = useState('');
    const [teamId, setTeamId] = useState(null);
    const user = JSON.parse(localStorage.getItem('user'));
    const coachId = user ? user.uid : null;

    // Fetch tournaments and teams on component mount
    useEffect(() => {
        fetchTournaments();
        fetchTeams();
    }, []);

    // Fetch all tournaments from the server
    const fetchTournaments = async () => {
        try {
            const response = await axios.get('http://localhost:8084/tournament/getAll');
            setTournaments(response.data);
        } catch (error) {
            console.error('Error fetching tournaments:', error);
            setRegistrationMessage('Error fetching tournaments. Please try again.');
        }
    };

    // Fetch teams associated with the current coach
    const fetchTeams = async () => {
        try {
            const response = await axios.get('http://localhost:8084/team/getAll');
            const coachTeams = response.data.filter(team => team.coachId === coachId);
            if (coachTeams.length > 0) {
                setTeamId(coachTeams[0].teamId);
            } else {
                setRegistrationMessage('No team found for this coach.');
            }
        } catch (error) {
            console.error('Error fetching teams:', error);
            setRegistrationMessage('Error fetching teams. Please try again.');
        }
    };

    // Handle user logout
    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    // Register the team for a tournament
    const handleRegister = async (tournament) => {
        if (!teamId) {
            setRegistrationMessage('No team available for registration.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8084/regTeam/addRegTeam', {
                tid: tournament.tid,
                teamid: teamId,
            });

            console.log(JSON.stringify(response.data));
            setRegistrationMessage('Registered successfully to the tournament');
        } catch (error) {
            alert("You are not eligible to Register Tournament");
            console.error('Error registering for tournament:', error);
            setRegistrationMessage('An error occurred while registering. Please try again.');
        }
    };

    return (
        <div className="dashboard-container">
            <nav className="sidebar">
                <ul>
                    <li>Register Tournament</li>
                    <li><Link to="../coach/CreatePlayer">Create Player</Link></li>
                    <li><Link to="../coach/ManageTeam">Manage Team</Link></li>
                </ul>
            </nav>
            <div className="dashboard-content">
                <button onClick={handleLogout} className="logout-button">Logout</button>
                <h2>Welcome, Coach</h2>
                <div className="tournament-registration-container">
                    <h2>Register for Tournament</h2>
                    {registrationMessage && (
                        <div className={`registration-message ${registrationMessage.includes('successfully') ? 'success' : 'error'}`}>
                            {registrationMessage}
                        </div>
                    )}
                    <div className="tournament-list">
                        {tournaments.map((tournament) => (
                            <div key={tournament.tid} className="tournament-item">
                                <h3>{tournament.tournamentName}</h3>
                                <p>TID: {tournament.tid}</p>
                                <p>Start Date: {new Date(tournament.startDate).toLocaleString()}</p>
                                <p>End Date: {new Date(tournament.endDate).toLocaleString()}</p>
                                <p>Status: {tournament.status}</p>
                                <button
                                    onClick={() => handleRegister(tournament)}
                                    className="register-tournament-button"
                                    disabled={tournament.isRegistered || tournament.status !== 'UPCOMING' || !teamId}
                                >
                                    {tournament.isRegistered ? 'REGISTERED' : 'REGISTER'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterTournament;