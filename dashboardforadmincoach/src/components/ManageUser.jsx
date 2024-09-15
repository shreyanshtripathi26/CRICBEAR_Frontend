import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles.css';
import { Link, useNavigate } from "react-router-dom";

function ManageUser() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]); // Initialize as an empty array
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch users on component mount
    useEffect(() => {
        fetchUsers();
    }, []);

    // Fetch all users from the server
    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get('http://localhost:8083/user/all');
            if (response && response.data) {
                setUsers(response.data); // Set the user array
            } else {
                setUsers([]);
                setError('Unexpected API response format');
            }
            setIsLoading(false);
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Failed to fetch users');
            setIsLoading(false);
        }
    };

    // Handle user logout
    const handleLogout = () => {
        navigate('/login');
    };

    // Fetch details for a specific user
    const handleManageUser = async (uid) => {
        try {
            const response = await axios.get(`http://localhost:8083/user/${uid}`);
            setSelectedUser(response.data);
        } catch (err) {
            setError('Failed to fetch user details');
        }
    };

    // Handle role change for a user
    const handleRoleChange = (e) => {
        setSelectedUser({ ...selectedUser, role: e.target.value });
    };

    // Save updated user role
    const handleSaveRole = async () => {
        if (!selectedUser) return;

        try {
            console.log('Updating user:', selectedUser);
            console.log(selectedUser.role);
            const response = await axios.put(
                `http://localhost:8083/user/setUserRole/${selectedUser.uid}`,
                { role: selectedUser.role }
            );
            if (response) {
                fetchUsers();
                setSelectedUser(null);
            } else {
                setError('Failed to update user role');
            }
        } catch (err) {
            console.error('Error updating user role:', err);
            setError('Failed to update user role');
        }
    };



    // Handle search input change
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    // Filter users based on search term
    const filteredUsers = Array.isArray(users) ? users.filter(user =>
        (user.firstName && user.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.lastName && user.lastName.toLowerCase().includes(searchTerm.toLowerCase()))
    ) : [];

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="dashboard-container">
            <nav className="sidebar">
                <ul>
                    <li><Link to="../admin/TournamentManagement">Tournament Management</Link></li>
                    <li>Manage User</li>
                    <li><Link to="../admin/ManageMatch">Manage Match</Link></li>
                </ul>
            </nav>
            <div className="dashboard-content">
                <button onClick={handleLogout} className="logout-button">Logout</button>
                <h2>Welcome, Admin</h2>
                <div className="user-management-container">
                    <h2>Manage Users</h2>
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Search users by first or last name..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="search-input"
                        />
                    </div>
                    <div className="users-list">
                        {filteredUsers.map(user => (
                            <div key={user.uid} className="user-item">
                                <span>{user.firstName} {user.lastName}</span>
                                <button onClick={() => handleManageUser(user.uid)} className="manage-button">MANAGE</button>
                            </div>
                        ))}
                    </div>
                    {selectedUser && (
                        <div className="manage-user-modal">
                            <h3>Manage User</h3>
                            <div className="user-data">
                                <p>First Name: {selectedUser.firstName}</p>
                                <p>Last Name: {selectedUser.lastName}</p>
                                <p>Current Role: {selectedUser.role}</p>
                            </div>
                            <div className="role-selection">
                                <label htmlFor="role">Assign Role:</label>
                                <select
                                    id="role"
                                    value={selectedUser.role}
                                    onChange={handleRoleChange}
                                >
                                    <option value="ADMIN">ADMIN</option>
                                    <option value="COACH">COACH</option>
                                </select>
                            </div>
                            <button onClick={handleSaveRole} className="save-button">Save</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ManageUser;