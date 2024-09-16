// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './Components/Navbar/Navbar.js';

import Tournament from './Components/Tournament.js';
import MatchesPage from './Components/MatchesPage.js';
import TeamsPage from './Components/TeamsPage.js';
import PlayerProfilePage from './Components/PlayerProfilePage.js';
import LiveMatchPage from './Components/LiveMatchPage.js';


function App() {
    return (
        <Router>
            <NavBar />
            <Routes>
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