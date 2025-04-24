import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Select,
    MenuItem,
    Button,
    TextField,
    InputAdornment,
    Typography,
    Chip,
    Alert
} from '@mui/material';
import {
    Search as SearchIcon,
    PersonAdd as PersonAddIcon
} from '@mui/icons-material';
import { roleService } from '../../services/roleService';
import { userService } from '../../services/userService';
import './RoleAssignment.css';

const RoleAssignment = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const [usersResponse, rolesResponse] = await Promise.all([
                userService.getAllUsers(),
                roleService.getAllRoles()
            ]);
            setUsers(usersResponse.data);
            setRoles(rolesResponse.data);
        } catch (error) {
            setMessage({
                type: 'error',
                text: 'Error fetching data: ' + error.message
            });
        }
    };

    const handleRoleChange = async (userId, newRoleId) => {
        try {
            setLoading(true);
            await roleService.assignRoleToUser(userId, newRoleId);
            
            // Update local state
            setUsers(users.map(user => {
                if (user._id === userId) {
                    return {
                        ...user,
                        role: roles.find(role => role._id === newRoleId)
                    };
                }
                return user;
            }));

            setMessage({
                type: 'success',
                text: 'Role assigned successfully'
            });
        } catch (error) {
            setMessage({
                type: 'error',
                text: 'Error assigning role: ' + error.message
            });
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(user => 
        user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="role-assignment">
            <div className="header">
                <Typography variant="h5">Role Assignment</Typography>
                <TextField
                    variant="outlined"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        )
                    }}
                    className="search-field"
                />
            </div>

            {message.text && (
                <Alert 
                    severity={message.type}
                    onClose={() => setMessage({ type: '', text: '' })}
                    className="message-alert"
                >
                    {message.text}
                </Alert>
            )}

            <TableContainer component={Paper} className="users-table">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>User</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Current Role</TableCell>
                            <TableCell>Assign Role</TableCell>
                            <TableCell>Last Updated</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredUsers.map((user) => (
                            <TableRow key={user._id}>
                                <TableCell>
                                    {user.firstName} {user.lastName}
                                </TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={user.role?.name || 'No Role'}
                                        color={user.role?.name === 'admin' ? 'error' : 'default'}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Select
                                        value={user.role?._id || ''}
                                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                        disabled={loading || user.role?.name === 'admin'}
                                        fullWidth
                                    >
                                        {roles.map((role) => (
                                            <MenuItem key={role._id} value={role._id}>
                                                {role.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </TableCell>
                                <TableCell>
                                    {new Date(user.roleUpdatedAt).toLocaleDateString()}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default RoleAssignment; 