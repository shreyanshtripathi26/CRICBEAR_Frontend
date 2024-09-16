import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Grid, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { getAllPlayers } from '../ApiService.js';

// Styled component for player profile box
const PlayerBox = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    margin: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    border: '1px solid #FF8C00',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    '&:hover': {
        backgroundColor: '#FF8C00',
        color: 'white',
    }
}));

function PlayerProfilePage() {
    // State for storing player data and search query
    const [players, setPlayers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch all players on component mount
    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const response = await getAllPlayers();
                setPlayers(response.data);
            } catch (error) {
                console.error('Error fetching players', error);
            }
        };

        fetchPlayers();
    }, []);

    // Filter players based on the search query (case-insensitive)
    const filteredPlayers = players.filter(player =>
        player.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Container style={{ marginTop: '20px' }}>
            <Typography variant="h4" component="h1" style={{ color: '#FF8C00', marginBottom: '20px' }}>
                Player Profiles
            </Typography>

            {/* Search input field */}
            <TextField
                label="Search Players"
                variant="outlined"
                fullWidth
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ marginBottom: '20px' }}
            />

            {/* Grid to display player profiles */}
            <Grid container spacing={2}>
                {filteredPlayers.length > 0 ? (
                    filteredPlayers.map(player => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={player.playerId}>
                            <PlayerBox>
                                <Typography variant="h6" component="div">
                                    {player.name}
                                </Typography>
                                <Typography variant="body1" component="div">
                                    Role: {player.playerRole}
                                </Typography>
                            </PlayerBox>
                        </Grid>
                    ))
                ) : (
                    <Typography variant="body1" component="div">
                        No players found.
                    </Typography>
                )}
            </Grid>
        </Container>
    );
}

export default PlayerProfilePage;
