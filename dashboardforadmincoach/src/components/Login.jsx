import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import '../styles.css';

function Login() {
    const [isLogin, setIsLogin] = useState(true);  // Toggle between login and signup forms
    const [username, setUsername] = useState('');  // State to store username input
    const [password, setPassword] = useState('');  // State to store password input
    const [signupData, setSignupData] = useState({
        firstName: "", lastName: "", email: "", username: "", password: ""  // State to store signup form data
    });
    const { setCurrentUser } = useContext(AuthContext);  // Access auth context to set logged-in user
    const navigate = useNavigate();  // Hook to navigate between routes

    // Handle login action
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/login', { username, password });  // Send login request to backend
            setCurrentUser(response.data.user);  // Set the logged-in user in context
            localStorage.setItem('user', JSON.stringify(response.data.user));  // Save user data in localStorage
            navigate('/dashboard');  // Redirect to dashboard upon successful login
        } catch (error) {
            console.error('Login failed:', error);  // Log errors if login fails
        }
    };

    // Handle signup action
    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/signup', signupData);  // Send signup data to backend
            setCurrentUser(response.data.user);  // Set the newly signed up user in context
            localStorage.setItem('user', JSON.stringify(response.data.user));  // Save user data in localStorage
            navigate('/dashboard');  // Redirect to dashboard after signup
        } catch (error) {
            console.error('Signup failed:', error);  // Log errors if signup fails
        }
    };

    // Toggle between login and signup forms
    const toggleForm = () => {
        setIsLogin(!isLogin);
    };

    return (
        <div className="login-container">
            {/* Render login form */}
            {isLogin ? (
                <div>
                    <form onSubmit={handleLogin}>
                        {/* Username input field */}
                        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />

                        {/* Password input field */}
                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />

                        <button type="submit" className="login-button">Login</button>
                        <p onClick={toggleForm} className="toggle-link">Don't have an account? Sign up here</p>
                    </form>
                </div>
            ) : (
                <div>
                    {/* Render signup form */}
                    <form onSubmit={handleSignup}>
                        {/* Form input fields for first name, last name, email, username, and password */}
                        <input type="text" placeholder="First Name" value={signupData.firstName} onChange={(e) => setSignupData({ ...signupData, firstName: e.target.value })} required />
                        <input type="text" placeholder="Last Name" value={signupData.lastName} onChange={(e) => setSignupData({ ...signupData, lastName: e.target.value })} required />
                        <input type="email" placeholder="Email" value={signupData.email} onChange={(e) => setSignupData({ ...signupData, email: e.target.value })} required />
                        <input type="text" placeholder="Username" value={signupData.username} onChange={(e) => setSignupData({ ...signupData, username: e.target.value })} required />
                        <input type="password" placeholder="Password" value={signupData.password} onChange={(e) => setSignupData({ ...signupData, password: e.target.value })} required />

                        <button type="submit" className="login-button">Sign Up</button>
                        <p onClick={toggleForm} className="toggle-link">Already have an account? Login here</p>
                    </form>
                </div>
            )}
        </div>
    );
}

export default Login;
