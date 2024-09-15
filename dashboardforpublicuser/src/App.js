import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Tournament from './Components/Tournament';
import MatchesPage from './Components/MatchesPage';
import TeamsPage from './Components/TeamsPage';
import PlayerProfilePage from './Components/PlayerProfilePage';
import LiveMatchPage from './Components/LiveMatchPage';

// Main App component defining the routing structure for the public-facing part of the application
function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                {/* Define routes for various pages */}
                <Route path="/tournaments" element={<Tournament />} />
                <Route path="/matches" element={<MatchesPage />} />
                <Route path="/teams" element={<TeamsPage />} />
                <Route path="/playerprofile" element={<PlayerProfilePage />} />
                <Route path="/live-match/:mid" element={<LiveMatchPage />} />
            </Routes>
        </Router>
    );
}

export default App;
