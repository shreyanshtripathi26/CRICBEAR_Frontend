import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Tabs, Tab, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, TextField, InputAdornment, Dialog, DialogTitle, DialogContent } from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import { getMatchesByStatus, getMatchesresultByMid } from '../ApiService';

// Styled Table and Tab components with Material-UI
const StyledTable = styled(Table)(({ theme }) => ({
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

const StyledTab = styled(Tab)(({ theme }) => ({
    '&.Mui-selected': {
        backgroundColor: '#FF8C00',
        color: 'white',
    },
    '&': {
        color: '#FF8C00',
    },
}));

const CustomButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#FF8C00',
    '&:hover': {
        backgroundColor: '#FF5722',
    },
}));

function MatchesPage() {
    // State variables for managing component data and UI
    const [tabValue, setTabValue] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [matchesData, setMatchesData] = useState({ LIVE: [], UPCOMING: [], COMPLETED: [] });
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [openMatchDialog, setOpenMatchDialog] = useState(false);
    const navigate = useNavigate();

    // Fetch matches data when tab changes
    useEffect(() => {
        const fetchMatches = async (status) => {
            try {
                const response = await getMatchesByStatus(status);
                setMatchesData((prevData) => ({
                    ...prevData,
                    [status]: response.data || [],
                }));
            } catch (error) {
                console.error('Error fetching matches', error);
            }
        };

        const statusMap = ['LIVE', 'UPCOMING', 'COMPLETED'];
        fetchMatches(statusMap[tabValue]);
    }, [tabValue]);

    // Handle tab change
    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    };
    // Navigate to live match page
    const handleMatchClick = (mid) => {
        navigate(`../live-match/${mid}`);
    };

    // Fetch and display match details
    const handleMatchDetailsClick = async (mid) => {
        try {
            const response = await getMatchesresultByMid(mid);
            setSelectedMatch(response.data);
            console.log(response);
            setOpenMatchDialog(true);
        } catch (error) {
            console.error('Error fetching match details', error);
        }
    };

    // Filter matches based on search term
    const filteredMatches = (matches) => {
        if (!Array.isArray(matches)) {
            return [];
        }
        return matches.filter((match) =>
            `${match.team1} vs ${match.team2}`.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    // Format date to local string
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(); // Formats the date to "MM/DD/YYYY"
    };

    const tabLabels = ['LIVE', 'UPCOMING', 'COMPLETED'];

    // Close match details dialog
    const handleCloseDialog = () => {
        setOpenMatchDialog(false);
    };


    return (
        <Container style={{ marginTop: '20px' }}>
            <Typography variant="h4" component="h1" style={{ color: '#FF8C00', marginBottom: '20px' }}>
                Matches
            </Typography>
            {/* Search input field */}
            <TextField
                placeholder="Search by teams"
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
            {/* Tabs for different match statuses */}
            <Tabs value={tabValue} onChange={handleChange} aria-label="matches tabs" style={{ marginBottom: '30px' }}>
                {tabLabels.map((label, index) => (
                    <StyledTab key={index} label={label} />
                ))}
            </Tabs>
            <Box>
                {/* Render match tables for each status */}
                {['LIVE', 'UPCOMING', 'COMPLETED'].map((status, index) => (
                    tabValue === index && (
                        <TableContainer component={Paper} key={status}>
                            <StyledTable>
                                {/* Table header */}
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">Match</TableCell>
                                        {/* Conditional rendering of additional headers */}
                                        {status === 'UPCOMING' && (
                                            <>
                                                <TableCell align="center">Date</TableCell>
                                                <TableCell align="center">Place</TableCell>
                                            </>
                                        )}
                                        {status === 'COMPLETED' && (
                                            <>
                                                <TableCell align="center">Date</TableCell>
                                            </>
                                        )}
                                        {status === 'LIVE' && (
                                            <>
                                                <TableCell align="center">VIEW</TableCell>
                                            </>
                                        )}
                                    </TableRow>
                                </TableHead>
                                {/* Table body */}
                                <TableBody>
                                    {filteredMatches(matchesData[status]).map((match, index) => (
                                        <TableRow key={index}>
                                            {/* Render match details */}
                                            <TableCell align="center">
                                                {status === 'COMPLETED' ? (
                                                    <Button
                                                        onClick={() => handleMatchDetailsClick(match.mid)}
                                                        style={{ cursor: 'pointer', color: '#FF8C00', fontWeight: 'bold' }}
                                                    >
                                                        {`${match.team1} vs ${match.team2}`}
                                                    </Button>
                                                ) : (
                                                    `${match.team1} vs ${match.team2}`
                                                )}
                                            </TableCell>
                                            {/* Conditional rendering of additional cells */}
                                            {status === 'UPCOMING' && (
                                                <>
                                                    <TableCell align="center">{formatDate(match.matchDate)}</TableCell>
                                                    <TableCell align="center">{match.stadium}</TableCell>
                                                </>
                                            )}
                                            {status === 'COMPLETED' && (
                                                <>
                                                    <TableCell align="center" style={{ cursor: 'pointer', color: '#FF8C00', fontWeight: 'bold' }}
                                                               onClick={() => handleMatchDetailsClick(match.mid)}
                                                    >
                                                        {formatDate(match.matchDate)}
                                                    </TableCell>
                                                </>
                                            )}
                                            {status === 'LIVE' && (
                                                <TableCell align="center">
                                                    <CustomButton variant="contained" onClick={() => handleMatchClick(match.mid)}>
                                                        Live
                                                    </CustomButton>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </StyledTable>
                        </TableContainer>
                    )
                ))}
            </Box>

            {/* Dialog for displaying match details */}
            <Dialog open={openMatchDialog} onClose={handleCloseDialog}>
                <DialogTitle>Match Details</DialogTitle>
                <DialogContent>
                    {selectedMatch ? (
                        <>
                            <Typography variant="body1">
                                Toss Winner: {selectedMatch.tossWinnerName}
                            </Typography>
                            <Typography variant="body1">
                                Toss Decision: {selectedMatch.tossDecision}
                            </Typography>
                            <Typography variant="body1">
                                Match Winner: {selectedMatch.matchWinner}
                            </Typography>
                            <Typography variant="body1">
                                First innings Score: {selectedMatch.runsScoredInFirstinnings} / {selectedMatch.wicketsInFirstinnings}
                            </Typography>
                            <Typography variant="body1">
                                Second Innings Score: {selectedMatch.runsScoredInSecondinnings} / {selectedMatch.wicketsInSecondinnings}
                            </Typography>
                        </>
                    ) : (
                        <Typography variant="body1">No details available</Typography>
                    )}

                    <Button onClick={handleCloseDialog} variant="contained" color="secondary" style={{ marginTop: '20px' }}>
                        Close
                    </Button>
                </DialogContent>
            </Dialog>
        </Container>
    );
}

export default MatchesPage;
