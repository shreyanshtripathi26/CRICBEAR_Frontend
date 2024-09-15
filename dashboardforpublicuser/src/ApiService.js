import axios from 'axios';

// Base URLs for different API endpoints
const API_BASE_URL = 'http://localhost:8084/tournament';
const API_URL = 'http://localhost:8084/player';
const API_BASE_URL1 = 'http://localhost:8084/team';
const API_Player_URL = 'http://localhost:8084/playerTeams';
const API_matches_URL = 'http://localhost:8084/match';
const API_matchesresult_URL = 'http://localhost:8084/matchResult';
const API_matchesLive_URL = 'http://localhost:8084/ballByBall';

// Create an axios instance for tournament-related requests
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
});

// Function to get all players
export const getAllPlayers = () => axios.get(`${API_URL}/getAll`);

// Function to get a tournament by ID
export const getTournamentById = async (id) => {
    try {
        return await api.get(`/getById/${id}`);
    } catch (error) {
        console.error('Error fetching tournament by ID', error);
        throw error;
    }
};

// Function to get a tournament by ID
export const getAllTournaments = async () => {
    try {
        return await api.get('/getAll');
    } catch (error) {
        console.error('Error fetching all tournaments', error);
        throw error;
    }
};

// Function to get tournaments by status
export const getTournamentsByStatus = async (status) => {
    try {
        return await api.post('http://localhost:8084/tournament/getByStatus', { status });
    } catch (error) {
        console.error('Error fetching tournaments by status', error);
        throw error;
    }
};

// Function to get all teams
export const getAllTeams = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL1}/getAll`);
        return response;
    } catch (error) {
        console.error('Error fetching teams', error);
        throw error;
    }
};

// Function to get players by team ID
export const getPlayersByTeamId = async (teamId) => {
    try {
        const response = await axios.get(`${API_Player_URL}/team/${teamId}`);
        return response;
    } catch (error) {
        console.error('Error fetching players', error);
        throw error;
    }
};

// Function to get matches by tournament ID
export const getMatchesByTournamentId = async (tid) => {
    try {
        const response = await axios.get(`${API_matches_URL}/getByTid/${tid}`);
        return response;
    } catch (error) {
        console.error('Error fetching matches:', error);
        throw error;
    }
};

// Function to get matches by status
export const getMatchesByStatus = async (status) => {
    try {
        const response = await axios.get(`${API_matches_URL}/status/${status}`);
        return response;
    } catch (error) {
        console.error('Error fetching matches by status', error);
        throw error;
    }
};

// Function to get match results by match ID
export const getMatchesresultByMid = async (mid) => {
    try {
        const response = await axios.get(`${API_matchesresult_URL}/getResultById/${mid}`);
        return response;
    } catch (error) {
        console.error('Error fetching matches by status', error);
        throw error;
    }
};

// Function to get ball-by-ball data for a match
export const getBallByBallData = async (mid) => {
    try {
        const response = await axios.get(`${API_matchesLive_URL}/${mid}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching ball-by-ball data:', error);
        throw error;
    }
};