import React, { useState, useEffect } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Button, CircularProgress } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

import { getAllTournaments, getMatchesByTournamentId } from '../ApiService.js';

function Tournament() {
    // State variables for managing tournament data and UI
    const [expanded, setExpanded] = useState(false);
    const [selectedTournament, setSelectedTournament] = useState(null);
    const [showMatches, setShowMatches] = useState(false);
    const [tournaments, setTournaments] = useState([]);
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(false);  // To show loading state

    // Fetch all tournaments on component mount
    useEffect(() => {
        const fetchTournaments = async () => {
            try {
                const response = await getAllTournaments();
                console.log('Tournaments fetched:', response.data);
                setTournaments(response.data);
            } catch (error) {
                console.error('Error fetching tournaments:', error);
            }
        };

        fetchTournaments();
    }, []);

    // Log selected tournament when it changes
    useEffect(() => {
        console.log('Selected Tournament State:', selectedTournament);
    }, [selectedTournament]);

    // Handle expanding/collapsing of tournament accordion
    const handleChange = (panel, tournament) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
        if (isExpanded) {
            console.log('Selected Tournament:', tournament);
            setSelectedTournament(tournament);
            setShowMatches(false);
            setMatches([]);  // Reset matches when a new tournament is selected
        } else {
            setSelectedTournament(null);
        }
    };

    // Format date to local string
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(); // Formats the date to "MM/DD/YYYY"
    };

    // Fetch and display matches for the selected tournament
    const handleViewMatches = async () => {
        console.log('Selected Tournament in View Matches:', selectedTournament);
        if (selectedTournament && selectedTournament.tid) {
            setLoading(true);
            try {
                const matchesData = await getMatchesByTournamentId(selectedTournament.tid);
                console.log('Matches Data:', matchesData);
                setMatches(matchesData.data || []);
                setShowMatches(true);
            } catch (error) {
                console.error('Error fetching matches:', error);
            } finally {
                setLoading(false);
            }
        } else {
            console.log('No tournament selected or tournament ID is missing.');
        }
    };

    return (
        <div className="tournament-management-container" style={{ padding: '20px', backgroundColor: 'white' }}>
            <h2 style={{ color: '#FF8C00' }}>Tournaments List</h2>
            {tournaments.length > 0 ? (
                tournaments.map((tournament, index) => (
                    // Accordion for each tournament
                    <Accordion
                        key={index}
                        expanded={expanded === `panel${index}`}
                        onChange={handleChange(`panel${index}`, tournament)}
                        style={{ marginBottom: '10px', border: '1px solid #FF8C00' }}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon sx={{ color: '#FF8C00' }} />}
                            aria-controls={`panel${index}d-content`}
                            id={`panel${index}d-header`}
                        >
                            <Typography style={{ color: '#FF8C00', fontWeight: 'bold' }}>
                                {tournament.tournamentName}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography style={{ color: '#333' }}>
                                {/* Display tournament details */}
                                <strong>Tournament ID:</strong> {tournament.id}
                                <br/>
                                <strong>Start Date:</strong> {formatDate(tournament.startDate)}
                                <br/>
                                <strong>End Date:</strong> {formatDate(tournament.endDate)}
                                <br />
                                <strong>Status:</strong> {tournament.status}
                                <br />

                                {/* Button to view matches */}
                                <Button
                                    variant="contained"
                                    sx={{ backgroundColor: '#FF8C00', '&:hover': { backgroundColor: '#FF4500' } }}
                                    onClick={handleViewMatches}
                                    style={{ marginTop: '10px' }}
                                    disabled={loading}
                                >
                                    {loading ? <CircularProgress size={24} /> : 'View Matches'}
                                </Button>
                                {/* Display matches if available */}
                                {showMatches && selectedTournament && selectedTournament.id === tournament.id && (
                                    <div style={{ marginTop: '20px' }}>
                                        <h3 style={{ color: '#FF8C00' }}>Matches</h3>
                                        {matches.length > 0 ? (
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell><strong>Match</strong></TableCell>
                                                        <TableCell><strong>Date</strong></TableCell>
                                                        <TableCell><strong>Status</strong></TableCell>
                                                        <TableCell><strong>Stadium</strong></TableCell>
                                                        <TableCell><strong>Match Type</strong></TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {matches.map((match) => (
                                                        <TableRow key={match.id}>
                                                            <TableCell>{match.team1} vs {match.team2}</TableCell>
                                                            <TableCell align="left">{formatDate(match.matchDate)}</TableCell>
                                                            <TableCell>{match.status}</TableCell>
                                                            <TableCell>{match.stadium}</TableCell>
                                                            <TableCell>{match.type}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        ) : (
                                            <Typography>No matches available for this tournament.</Typography>
                                        )}
                                    </div>
                                )}
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                ))
            ) : (
                <Typography>No tournaments found.</Typography>
            )}
        </div>
    );
}

export default Tournament;