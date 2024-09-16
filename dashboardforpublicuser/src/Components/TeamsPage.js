import React, { useState, useEffect } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, InputAdornment, Dialog, DialogTitle, DialogContent, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search.js';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { getAllTeams, getPlayersByTeamId } from '../ApiService.js'; // Import the API functions

// Styled Table component with Material-UI
const StyledTable = styled(Table)(({ theme }) => ({
    minWidth: '1000',
    '& thead th': {
        backgroundColor: '#FF8C00',
        color: 'white',
    },
    '& tbody tr:nth-of-type(odd)': {
        backgroundColor: '#f5f5f5',
    },
    '& tbody tr:nth-of-type(even)': {
        backgroundColor: 'white',
    },
}));

function TeamsPage() {
    const [teams, setTeams] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [openPlayersDialog, setOpenPlayersDialog] = useState(false);

    // Fetch teams data from API
    const fetchTeams = async () => {
        try {
            const response = await getAllTeams();
            setTeams(response.data);
        } catch (error) {
            console.error('Error fetching teams', error);
        }
    };

    // Calculate win percentage for a team
    const calculateMatchesWonPercentage = (matchesWon, matchesPlayed) => {
        return matchesPlayed > 0 ? ((matchesWon / matchesPlayed) * 100).toFixed(2) : '0.00';
    };


    useEffect(() => {
        fetchTeams();
    }, []);

    // Fetch and display players for a selected team
    const handlePlayersClick = async (teamId) => {
        try {
            const response = await getPlayersByTeamId(teamId);
            setSelectedPlayers(response.data);
            setOpenPlayersDialog(true);
        } catch (error) {
            console.error('Error fetching players', error);
        }
    };

    const handleCloseDialog = () => {
        setOpenPlayersDialog(false);
    };

    // Filter teams based on search term
    const filteredTeams = teams.filter((team) =>
        team.teamName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container style={{ marginTop: '20px' }}>
            <Typography variant="h4" component="h1" style={{ color: '#FF8C00', marginBottom: '20px' }}>
                TEAMS
            </Typography>
            {/* Search input for filtering teams */}
            <TextField
                placeholder="Search by team name"
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ marginBottom: '20px', width: '100%' }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
            />
            {/* Table displaying team statistics */}
            <TableContainer component={Paper}>
                <StyledTable>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Team ID</TableCell>
                            <TableCell align="center">Team Name</TableCell>
                            <TableCell align="center">Matches Played</TableCell>
                            <TableCell align="center">Matches Won</TableCell>
                            <TableCell align="center">Won Percentage</TableCell> {/* New Column */}
                            <TableCell align="center">Matches Lost</TableCell>
                            <TableCell align="center">Matches Drawn</TableCell>
                            <TableCell align="center">Matches Abandoned</TableCell>
                            <TableCell align="center">Points</TableCell>
                            <TableCell align="center">Net Run Rate</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredTeams.length > 0 ? (
                            filteredTeams.map((team) => (
                                <TableRow key={team.teamId} style={{ cursor: 'pointer' }}>
                                    <TableCell align="center">{team.teamId}</TableCell>
                                    <TableCell
                                        align="center"
                                        onClick={() => handlePlayersClick(team.teamId)}
                                        style={{ cursor: 'pointer', color: '#FF8C00', fontWeight: 'bold' }}
                                    >
                                        {team.teamName}
                                    </TableCell>
                                    <TableCell align="center">{team.matchesPlayed}</TableCell>
                                    <TableCell align="center">{team.matchesWon}</TableCell>
                                    <TableCell align="center">
                                        {calculateMatchesWonPercentage(team.matchesWon, team.matchesPlayed)}%
                                    </TableCell> {/* Display Percentage */}
                                    <TableCell align="center">{team.matchesLost}</TableCell>
                                    <TableCell align="center">{team.matchesDrawn}</TableCell>
                                    <TableCell align="center">{team.matchesAbandoned}</TableCell>
                                    <TableCell align="center">{team.points}</TableCell>
                                    <TableCell align="center">{team.nrr}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={10} align="center"> {/* Adjust colspan to match new column count */}
                                    No teams found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>

                </StyledTable>
            </TableContainer>

            {/* Bar chart visualization of team statistics */}
            <Typography variant="h5" component="h2" style={{ color: '#FF8C00', marginTop: '30px', marginBottom: '20px' }}>
                TEAM STATISTICS
            </Typography>
            <BarChart
                width={1170}
                height={400}
                data={filteredTeams}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="teamName" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="matchesPlayed" fill="#8884d8" name="Matches Played" />
                <Bar dataKey="matchesWon" fill="#82ca9d" name="Matches Won" />
                <Bar dataKey="points" fill="#FF8C00" name="Points" />
                <Bar dataKey={(team) => calculateMatchesWonPercentage(team.matchesWon, team.matchesPlayed)} fill="#FF8C00" name="Won Percentage" />
            </BarChart>


            {/* Dialog to display players of a selected team */}
            {selectedPlayers.length > 0 && (
                <Dialog open={openPlayersDialog} onClose={handleCloseDialog} PaperProps={{
                    style: {
                        width: '80%', // Adjust the width as needed
                        maxWidth: 'none' // Ensures the width is not constrained by default maximum width
                    },
                }}>
                    <DialogTitle>{selectedPlayers[0]?.teamName} Players</DialogTitle>
                    <DialogContent>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#FF8C00' }}>
                                    <TableCell align={"left"} sx={{ color: 'white' }}>Player Name</TableCell>
                                    <TableCell align={"left"} sx={{ color: 'white' }}>Role</TableCell>
                                    <TableCell align={"left"} sx={{ color: 'white' }}>RunsScored</TableCell>
                                    <TableCell align={"left"} sx={{ color: 'white' }}>Balls</TableCell>
                                    <TableCell align={"left"} sx={{ color: 'white' }}>Wickets</TableCell>
                                    <TableCell align={"left"} sx={{ color: 'white' }}>Overs</TableCell>
                                    <TableCell align={"left"} sx={{ color: 'white' }}>RunsGiven</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {selectedPlayers.map(player => (


                                    <TableRow key={player.playerId}>
                                        <TableCell align={"left"}>{player.name}</TableCell>
                                        <TableCell align={"left"}>{player.playerRole}</TableCell>
                                        <TableCell align={"left"}>{player.runsScored}</TableCell>
                                        <TableCell align={"left"}>{player.balls}</TableCell>
                                        <TableCell align={"left"}>{player.wickets}</TableCell>
                                        <TableCell align={"left"}>{player.overs}</TableCell>
                                        <TableCell align={"left"}>{player.runsGiven}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <Button
                            onClick={handleCloseDialog}
                            variant="contained"
                            style={{
                                backgroundColor: '#FF8C00', // Orange color
                                color: 'white',              // Text color
                                marginTop: '20px'
                            }}
                        >
                            Close
                        </Button>
                    </DialogContent>
                </Dialog>
            )}

        </Container>
    );
}

export default TeamsPage;
