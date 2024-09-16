import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Tabs, Tab, Box, Grid, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';

// Styled components for custom UI elements
const StyledCard = styled(Box)(({ theme }) => ({
    marginBottom: '20px',
    padding: theme.spacing(2),
    backgroundColor: '#FFF8E1',
    borderRadius: '10px',
}));

const ScrollableBox = styled(Box)({
    overflowX: 'auto',
    whiteSpace: 'nowrap',
    marginTop: '20px',
});

const OverBox = styled(Box)({
    display: 'inline-block',
    border: '1px solid #ccc',
    padding: '5px',
    marginRight: '10px',
    minWidth: '120px',
});

const BallBox = styled(Box)({
    display: 'inline-block',
    border: '1px solid #ddd',
    padding: '2px 5px',
    margin: '2px',
    fontSize: '0.8rem',
    borderRadius: '3px',
});

const TabPanel = (props) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
};

// Main component for displaying live match information
const LiveMatchPage = () => {
    // State variables for match data, tabs, and scores
    const { mid } = useParams();
    const [matchData, setMatchData] = useState({
        Innings1: { ballByBall: [], battingTeamName: '', bowlingTeamName: '' },
        Innings2: { ballByBall: [], battingTeamName: '', bowlingTeamName: '' },
    });
    const [mainTab, setMainTab] = useState(0);
    const [scorecardTab, setScorecardTab] = useState(0);
    const [battingScore, setBattingScore] = useState({});
    const [bowlingScore, setBowlingScore] = useState({});

    // Effect hook for fetching match data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const matchResponse = await axios.get(`http://localhost:8084/ballByBall/${mid}`);
                setMatchData(matchResponse.data);

                const battingResponse = await axios.get(`http://localhost:8084/battingScore/${mid}`);
                const bowlingResponse = await axios.get(`http://localhost:8084/bowlingScore/${mid}`);
                setBattingScore(battingResponse.data);
                setBowlingScore(bowlingResponse.data);
            } catch (error) {
                console.error('Error fetching match data:', error);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 2500); // Refresh every 2.5 seconds

        return () => clearInterval(interval);
    }, [mid]);

    // Functions for handling tab changes
    const handleMainTabChange = (event, newValue) => {
        setMainTab(newValue);
    };

    const handleScorecardTabChange = (event, newValue) => {
        setScorecardTab(newValue);
    };
    // Function to get display value for each ball
    const getBallDisplay = (ball) => {
        if (ball.wicket) return 'W';
        if (ball.extra) return ball.extra[0];
        return ball.runsScored?.toString() || '0';
    };
    // Function to render the score view for an innings
    const renderScoreView = (innings) => {
        if (!innings || !innings.ballByBall || innings.ballByBall.length === 0) {
            return null;
        }
        const latestBall = innings.ballByBall[innings.ballByBall.length - 1];
        const batsman1Score = battingScore[`Innings${innings === matchData.Innings1 ? '1' : '2'}`]?.find(b => b.playerName === latestBall.batsmen1) || {};
        const batsman2Score = battingScore[`Innings${innings === matchData.Innings1 ? '1' : '2'}`]?.find(b => b.playerName === latestBall.batsmen2) || {};

        return (
            <StyledCard>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Typography variant="h6">{innings.battingTeamName}</Typography>
                        <Typography variant="body1">
                            {latestBall.batsmen1}* {batsman1Score.runsScored || 0} ({batsman1Score.ballsFaced || 0})
                        </Typography>
                        <Typography variant="body1">
                            {latestBall.batsmen2} {batsman2Score.runsScored || 0} ({batsman2Score.ballsFaced || 0})
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body1">Score: {latestBall.total || 0}/{latestBall.wicketNumber || 0}</Typography>
                        <Typography variant="body1">
                            Over: {latestBall.ballNumber === 6 ? (latestBall.overNumber + 1) : latestBall.overNumber}.
                            {latestBall.ballNumber === 6 ? 0 : latestBall.ballNumber}
                        </Typography>
                        <Typography variant="body1">Bowler: {latestBall.bowler}</Typography>
                    </Grid>
                </Grid>
                <ScrollableBox>
                    {Array.from(new Set(innings.ballByBall.map(ball => ball.overNumber)))
                        .sort((a, b) => b - a) // Sort in descending order
                        .map(overNum => {
                            const overBalls = innings.ballByBall.filter(ball => ball.overNumber === overNum);

                            return (
                                <OverBox key={overNum}>
                                    <Typography variant="body2" style={{ fontWeight: 'bold' }}>{overNum + 1}</Typography>
                                    {[6, 4, 3, 2, 1].map(ballNum => {
                                        const ball = overBalls.find(b => b.ballNumber === ballNum);
                                        return (
                                            <BallBox key={ballNum}>
                                                {ball ? getBallDisplay(ball) : '-'}
                                            </BallBox>
                                        );
                                    })}
                                </OverBox>
                            );
                        })}
                </ScrollableBox>
            </StyledCard>
        );
    };
    // Function to render the scorecard for an innings
    const renderScorecard = (inningsNumber) => {
        const batting = battingScore[`Innings${inningsNumber}`] || [];
        const bowling = bowlingScore[`Innings${inningsNumber}`] || [];

        return (
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Typography variant="h6">Batting - Innings {inningsNumber}</Typography>
                    <TableContainer component={Paper}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Batsman</TableCell>
                                    <TableCell>Runs</TableCell>
                                    <TableCell>Balls</TableCell>
                                    <TableCell>Fours</TableCell>
                                    <TableCell>Sixes</TableCell>
                                    <TableCell>Strike Rate</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {batting.map((player, index) => {
                                    const runsScored = player.runsScored || 0;
                                    const ballsFaced = player.ballsFaced || 1; // Avoid division by zero
                                    const strikeRate = ((runsScored / ballsFaced) * 100).toFixed(2);

                                    return (
                                        <TableRow key={index}>
                                            <TableCell>{player.playerName}</TableCell>
                                            <TableCell>{runsScored}</TableCell>
                                            <TableCell>{ballsFaced}</TableCell>
                                            <TableCell>{player.fours || 0}</TableCell>
                                            <TableCell>{player.six || 0}</TableCell>
                                            <TableCell>{strikeRate}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="h6">Bowling - Innings {inningsNumber}</Typography>
                    <TableContainer component={Paper}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Bowler</TableCell>
                                    <TableCell>Overs</TableCell>
                                    <TableCell>Runs Given</TableCell>
                                    <TableCell>Wickets</TableCell>
                                    <TableCell>Economy</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {bowling.map((player, index) => {
                                    const overs = player.overs || 1; // Avoid division by zero
                                    const runsGiven = player.runsGiven || 0;
                                    const economy = (runsGiven / overs).toFixed(2);

                                    return (
                                        <TableRow key={index}>
                                            <TableCell>{player.playerName}</TableCell>
                                            <TableCell>{overs}</TableCell>
                                            <TableCell>{runsGiven}</TableCell>
                                            <TableCell>{player.wickets || 0}</TableCell>
                                            <TableCell>{economy}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        );
    };
    // Main render function
    return (
        <Container>
            <Typography variant="h4" component="h1" style={{ color: '#FF8C00', marginBottom: '20px' }}>
                Live Match Updates
            </Typography>
            {/* Tabs for Score and Scorecard */}
            <Tabs value={mainTab} onChange={handleMainTabChange}>
                <Tab label="Score" />
                <Tab label="Scorecard" />
            </Tabs>
            {/* Content for Score tab */}
            <TabPanel value={mainTab} index={0}>
                {renderScoreView(matchData.Innings1)}
                {renderScoreView(matchData.Innings2)}
            </TabPanel>
            {/* Content for Scorecard tab */}
            <TabPanel value={mainTab} index={1}>
                {/* Nested tabs for innings */}
                <Tabs value={scorecardTab} onChange={handleScorecardTabChange}>
                    <Tab label="Innings 1" />
                    <Tab label="Innings 2" />
                </Tabs>
                <TabPanel value={scorecardTab} index={0}>
                    {renderScorecard(1)}
                </TabPanel>
                <TabPanel value={scorecardTab} index={1}>
                    {renderScorecard(2)}
                </TabPanel>
            </TabPanel>
        </Container>
    );
};

export default LiveMatchPage;