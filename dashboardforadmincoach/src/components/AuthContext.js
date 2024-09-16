import React, { createContext, useState, useEffect } from 'react';

// Create a context for managing user authentication state
export const AuthContext = createContext();

// AuthProvider component to wrap the app with user authentication context
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);// State to hold the currently logged-in user

    useEffect(() => {
        // Check for a stored user in localStorage when the app loads and set it
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser)); // Parse and set the stored user
        }
    }, []);

    // Provide the current user and function to set the user to the rest of the app
    return (
        <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
            {children}
        </AuthContext.Provider>
    );
};