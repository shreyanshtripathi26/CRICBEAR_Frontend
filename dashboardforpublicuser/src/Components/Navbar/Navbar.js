import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu'; // Hamburger menu icon
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';

import MenuItem from '@mui/material/MenuItem';
import SportsCricketIcon from '@mui/icons-material/SportsCricket.js'; // Ball icon
import { Link } from 'react-router-dom'; // Import Link for navigation

const pages = ['MATCHES', 'TEAMS', 'Player Profile', 'Tournaments'];


function Navbar() {

    // State to manage the mobile menu
    const [anchorElNav, setAnchorElNav] = React.useState(null);

    // Handler to open the mobile menu
    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    // Handler to close the mobile menu
    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };



    return (
        <AppBar position="static" sx={{ backgroundColor: '#FF8C00' }}> {/* Darker orange color */}
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <SportsCricketIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: 'white', fontSize: 32 }} /> {/* Ball icon */}
                    <Typography
                        variant="h6"
                        noWrap
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'white',
                            textDecoration: 'none',
                            fontSize: 24,
                        }}
                    >
                        CRICBEAR
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="menu"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon sx={{ color: 'white', fontSize: 32 }} />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{ display: { xs: 'block', md: 'none' } }}
                        >
                            {pages.map((page) => (
                                <MenuItem key={page} onClick={handleCloseNavMenu}>
                                    <Typography
                                        component={Link}
                                        to={`/${page.toLowerCase().replace(' ', '')}`}
                                        sx={{ textAlign: 'center', color: '#FF8C00', fontSize: 20 }}
                                    >
                                        {page}
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>

                    <SportsCricketIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1, color: 'white', fontSize: 32 }} />
                    <Typography
                        variant="h5"
                        noWrap
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'white',
                            textDecoration: 'none',
                            fontSize: 24,
                        }}
                    >
                        CRICBEAR
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                            <Button
                                key={page}
                                component={Link}
                                to={`/${page.toLowerCase().replace(' ', '')}`}
                                onClick={handleCloseNavMenu}
                                sx={{ my: 2, color: 'white', display: 'block', fontSize: 19, mx: 2 }}
                            >
                                {page}
                            </Button>
                        ))}
                    </Box>


                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default Navbar;
