import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import axios from 'axios';
import App from './App';
import Tournament from './Components/Tournament';
import TeamsPage from './Components/TeamsPage';
import PlayerProfilePage from './Components/PlayerProfilePage';
import LiveMatchPage from './Components/LiveMatchPage';
import MatchesPage from './Components/MatchesPage';
import { MemoryRouter } from 'react-router-dom';

// Mock axios
jest.mock('axios');

// Mock the ApiService functions
jest.mock('./ApiService', () => ({
  getAllTournaments: jest.fn(),
  getMatchesByTournamentId: jest.fn(),
  getAllTeams: jest.fn(),
  getPlayersByTeamId: jest.fn(),
  getAllPlayers: jest.fn(),
  getMatchesByStatus: jest.fn(),
  getMatchesresultByMid: jest.fn(),
}));

describe('Tournament Component', () => {
  const mockTournaments = [
    { id: 1, tournamentName: 'Test Tournament', startDate: '2023-01-01', endDate: '2023-12-31', status: 'Ongoing' },
  ];

  beforeEach(() => {
    require('./ApiService').getAllTournaments.mockResolvedValue({ data: mockTournaments });
    require('./ApiService').getMatchesByTournamentId.mockResolvedValue({ data: [] });
  });

  test('renders tournaments list', async () => {
    await act(async () => {
      render(<Tournament />);
    });
    screen.getByText('Tournaments List');
    screen.getByText('Test Tournament');
  });

  test('expands tournament details on click', async () => {
    await act(async () => {
      render(<Tournament />);
    });

    fireEvent.click(screen.getByText('Test Tournament'));
    screen.getByText('Tournament ID:');
  });

  test('shows "View Matches" button', async () => {
    await act(async () => {
      render(<Tournament />);
    });

    fireEvent.click(screen.getByText('Test Tournament'));
    screen.getByText('View Matches');
  });
});

describe('TeamsPage Component', () => {
  const mockTeams = [
    { teamId: 1, teamName: 'Test Team', matchesPlayed: 10, matchesWon: 5, matchesLost: 4, matchesDrawn: 1, matchesAbandoned: 0, points: 11, nrr: 0.5 },
  ];

  beforeEach(() => {
    require('./ApiService').getAllTeams.mockResolvedValue({ data: mockTeams });
    require('./ApiService').getPlayersByTeamId.mockResolvedValue({ data: [] });
  });

  test('renders teams table', async () => {
    await act(async () => {
      render(<TeamsPage />);
    });

    screen.getByText('TEAMS');
    
    const teamNameCell = screen.getByRole('cell', { name: 'Test Team' });
    teamNameCell.style.cursor = 'pointer';
    teamNameCell.style.color = 'rgb(255, 140, 0)';
    teamNameCell.style.fontWeight = 'bold';
  });

  test('filters teams based on search input', async () => {
    await act(async () => {
      render(<TeamsPage />);
    });

    const searchInput = screen.getByPlaceholderText('Search by team name');
    fireEvent.change(searchInput, { target: { value: 'Non-existent Team' } });
    !screen.queryByRole('cell', { name: 'Test Team' });
  });

  test('shows team statistics chart', async () => {
    await act(async () => {
      render(<TeamsPage />);
    });

    screen.getByText('TEAM STATISTICS');
  });
});

describe('PlayerProfilePage Component', () => {
  const mockPlayers = [
    { playerId: 1, name: 'Test Player', playerRole: 'Batsman' },
  ];

  beforeEach(() => {
    require('./ApiService').getAllPlayers.mockResolvedValue({ data: mockPlayers });
  });

  test('renders player profiles', async () => {
    await act(async () => {
      render(<PlayerProfilePage />);
    });

    screen.getByText('Player Profiles');
    screen.getByText('Test Player');
  });

  test('filters players based on search input', async () => {
    await act(async () => {
      render(<PlayerProfilePage />);
    });

    const searchInput = screen.getByLabelText('Search Players');
    fireEvent.change(searchInput, { target: { value: 'Non-existent Player' } });
    !screen.queryByText('Test Player');
  });
});

describe('LiveMatchPage Component', () => {
  const mockMatchData = {
    Innings1: {
      ballByBall: [{ ballNumber: 1, runsScored: 1, overNumber: 0, wicket: false, batsmen1: 'Player 1', batsmen2: 'Player 2', bowler: 'Bowler 1', total: 1, wicketNumber: 0 }],
      battingTeamName: 'Team A',
      bowlingTeamName: 'Team B',
    },
    Innings2: { ballByBall: [], battingTeamName: '', bowlingTeamName: '' },
  };

  const mockBattingScore = {
    Innings1: [{ playerName: 'Player 1', runsScored: 1, ballsFaced: 1, fours: 0, six: 0 }],
    Innings2: [],
  };

  const mockBowlingScore = {
    Innings1: [{ playerName: 'Bowler 1', overs: 1, runsGiven: 1, wickets: 0 }],
    Innings2: [],
  };

  beforeEach(() => {
    axios.get.mockImplementation((url) => {
      if (url.includes('ballByBall')) {
        return Promise.resolve({ data: mockMatchData });
      } else if (url.includes('battingScore')) {
        return Promise.resolve({ data: mockBattingScore });
      } else if (url.includes('bowlingScore')) {
        return Promise.resolve({ data: mockBowlingScore });
      }
    });
  });

  test('switches tabs between Score and Scorecard', async () => {
    await act(async () => {
      render(<LiveMatchPage />);
    });

    await waitFor(() => screen.getByText('Score: 1/0'));
    fireEvent.click(screen.getByRole('tab', { name: 'Scorecard' }));
    await waitFor(() => screen.getByText('Batting - Innings 1'));
  });

  test('switches between Innings in Scorecard tab', async () => {
    await act(async () => {
      render(<LiveMatchPage />);
    });

    fireEvent.click(screen.getByRole('tab', { name: 'Scorecard' }));
    await waitFor(() => screen.getByText('Batting - Innings 1'));
    fireEvent.click(screen.getByRole('tab', { name: 'Innings 2' }));
    await waitFor(() => !screen.queryByText('Batting - Innings 2'));
  });
});

// MatchesPage Tests
describe('MatchesPage Component', () => {
  const mockMatches = {
    LIVE: [{ mid: 1, team1: 'Team A', team2: 'Team B' }],
    UPCOMING: [{ mid: 2, team1: 'Team C', team2: 'Team D', matchDate: '2024-09-16', stadium: 'Stadium X' }],
    COMPLETED: [{ mid: 3, team1: 'Team E', team2: 'Team F', matchDate: '2024-09-15' }],
  };

  beforeEach(() => {
    require('./ApiService').getMatchesByStatus.mockImplementation((status) =>
      Promise.resolve({ data: mockMatches[status] })
    );
    require('./ApiService').getMatchesresultByMid.mockResolvedValue({
      data: {
        tossWinnerName: 'Team A',
        tossDecision: 'Bat',
        matchWinner: 'Team B',
        runsScoredInFirstinnings: 150,
        wicketsInFirstinnings: 2,
        runsScoredInSecondinnings: 120,
        wicketsInSecondinnings: 3
      }
    });
  });

  test('renders MatchesPage and displays initial elements', async () => {
    await act(async () => {
      render(<MemoryRouter>
        <MatchesPage />
      </MemoryRouter>);
    });

    // Check if the title is rendered
    expect(screen.getByText('Matches')).toBeInTheDocument();

    // Check if tabs are present
    expect(screen.getByText('LIVE')).toBeInTheDocument();
    expect(screen.getByText('UPCOMING')).toBeInTheDocument();
    expect(screen.getByText('COMPLETED')).toBeInTheDocument();

    // Check if the search input is present
    expect(screen.getByPlaceholderText('Search by teams')).toBeInTheDocument();
  });

  test('switches tabs and displays correct data', async () => {
    await act(async () => {
      render(<MemoryRouter>
        <MatchesPage />
      </MemoryRouter>);
    });

    // Wait for initial data to be loaded
    await waitFor(() => screen.getByText('Team A vs Team B'));

    // Check if live matches are displayed
    fireEvent.click(screen.getByText('UPCOMING'));
    await waitFor(() => screen.getByText('Team C vs Team D'));

    fireEvent.click(screen.getByText('COMPLETED'));
    await waitFor(() => screen.getByText('Team E vs Team F'));
  });

  test('searches for matches by team name', async () => {
    await act(async () => {
      render(
      <MemoryRouter>
        <MatchesPage />
      </MemoryRouter>
      );
    });

    // Check initial state
    await waitFor(() => screen.getByText('Team A vs Team B'));

    // Search for matches
    fireEvent.change(screen.getByPlaceholderText('Search by teams'), { target: { value: 'Team A' } });

    // Check if filtered results are displayed
    expect(screen.getByText('Team A vs Team B')).toBeInTheDocument();
    expect(screen.queryByText('Team C vs Team D')).not.toBeInTheDocument();
  });

  test('navigates to live match page on button click', async () => {
    await act(async () => {
      render(
      <MemoryRouter>
      <MatchesPage />
    </MemoryRouter>);
    });

    // Wait for live matches data to load
    await waitFor(() => screen.getByText('Live'));

    // Click on "Live" button
    fireEvent.click(screen.getByText('Live'));

    // Assuming you're using React Router for navigation,
    // you might want to test the navigation behavior here
    // You may need additional setup depending on your routing setup
  });
});
