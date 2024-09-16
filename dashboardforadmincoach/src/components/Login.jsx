import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import '../styles.css';

function Login() {
    const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    // State to store signup form data
    const [signupData, setSignupData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        username: "",
        password: "",
        role: "COACH",
    });

    const navigate = useNavigate();
    const { setCurrentUser } = useContext(AuthContext);

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            // Send login request to backend
            const response = await axios.post('http://localhost:8083/user/login', {
                username,
                password
            });

            if (response.data && response.data.uid) {
                const { uid, role } = response.data;
                const user = { username: response.data.username, role, uid };
                setCurrentUser(user);
                localStorage.setItem('user', JSON.stringify(user));

                if (role === 'ADMIN') {
                    navigate('/admin');
                } else if (role === 'COACH') {
                    navigate('/coach');
                } else {
                    alert('Unknown user role');
                }
            } else {
                alert('Login failed. Please check your username or password.');
            }
        } catch (error) {
            alert('Login failed. Please try again later.');
            console.error('Login error:', error);
        }
    };

     // Handle signup action
    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8083/user/register', signupData);
            setCurrentUser(response.data.token);
            if (response.data) {
                navigate('/');
            } else {
                alert('Username already taken');
            }
        } catch (error) {
            console.error('Signup error:', error);
        }
    };

    // Toggle between login and signup forms
    const toggleForm = () => {
        setIsLogin(!isLogin); // Toggle between login and signup
    };

    return (
        <div className="login-container">  {/* Using login-container for consistency */}
            {isLogin ? (
                <div>
                    <h2>Login</h2>
                    <form onSubmit={handleLoginSubmit}>
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="login-button">Login</button>
                        <p onClick={toggleForm} className="toggle-link">
                            Don't have an account? Sign Up here
                        </p>
                    </form>
                </div>
            ) : (
                <div>
                    <h2>Sign Up</h2>
                     {/* Render signup form */}
                    <form onSubmit={handleSignupSubmit}>
                        <div className="form-group">
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First Name"
                                value={signupData.firstName}
                                onChange={(e) => setSignupData({ ...signupData, firstName: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                value={signupData.lastName}
                                onChange={(e) => setSignupData({ ...signupData, lastName: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={signupData.email}
                                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={signupData.username}
                                onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={signupData.password}
                                onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                                required
                            />
                        </div>
                        <button type="submit" className="login-button">Sign Up</button>  {/* Reuse login-button class */}
                        <p onClick={toggleForm} className="toggle-link">
                            Already have an account? Login here
                        </p>
                    </form>
                </div>
            )}
        </div>
    );
}

export default Login;
