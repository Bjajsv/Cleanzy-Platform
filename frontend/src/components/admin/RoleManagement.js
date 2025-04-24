import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Chip,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    FormGroup,
    FormControlLabel
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Add as AddIcon
} from '@mui/icons-material';
import { roleService } from '../../services/roleService';
import './RoleManagement.css';

const RoleManagement = () => {
    const [roles, setRoles] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);
    const [roleData, setRoleData] = useState({
        name: '',
        description: '',
        permissions: []
    });

    // Define available permissions
    const availablePermissions = {
        products: [
            'view_products',
            'create_products',
            'edit_products',
            'delete_products'
        ],
        orders: [
            'view_orders',
            'process_orders',
            'cancel_orders',
            'refund_orders'
        ],
        users: [
            'view_users',
            'create_users',
            'edit_users',
            'delete_users'
        ],
        inventory: [
            'view_inventory',
            'manage_inventory',
            'adjust_stock'
        ],
        reports: [
            'view_reports',
            'export_reports'
        ]
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        try {
            const response = await roleService.getAllRoles();
            setRoles(response.data);
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    };

    const handleAddRole = () => {
        setSelectedRole(null);
        setRoleData({
            name: '',
            description: '',
            permissions: []
        });
        setOpenDialog(true);
    };

    const handleEditRole = (role) => {
        setSelectedRole(role);
        setRoleData({
            name: role.name,
            description: role.description,
            permissions: role.permissions
        });
        setOpenDialog(true);
    };

    const handleDeleteRole = async (roleId) => {
        if (window.confirm('Are you sure you want to delete this role?')) {
            try {
                await roleService.deleteRole(roleId);
                fetchRoles();
            } catch (error) {
                console.error('Error deleting role:', error);
            }
        }
    };

    const handlePermissionChange = (permission) => {
        setRoleData(prev => ({
            ...prev,
            permissions: prev.permissions.includes(permission)
                ? prev.permissions.filter(p => p !== permission)
                : [...prev.permissions, permission]
        }));
    };

    const handleSaveRole = async () => {
        try {
            if (selectedRole) {
                await roleService.updateRole(selectedRole._id, roleData);
            } else {
                await roleService.createRole(roleData);
            }
            setOpenDialog(false);
            fetchRoles();
        } catch (error) {
            console.error('Error saving role:', error);
        }
    };

    return (
        <div className="role-management">
            <div className="header">
                <h2>Role Management</h2>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddRole}
                >
                    Add New Role
                </Button>
            </div>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Role Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Permissions</TableCell>
                            <TableCell>Users</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {roles.map((role) => (
                            <TableRow key={role._id}>
                                <TableCell>{role.name}</TableCell>
                                <TableCell>{role.description}</TableCell>
                                <TableCell>
                                    <div className="permission-chips">
                                        {role.permissions.map((permission) => (
                                            <Chip
                                                key={permission}
                                                label={permission}
                                                size="small"
                                                className="permission-chip"
                                            />
                                        ))}
                                    </div>
                                </TableCell>
                                <TableCell>{role.userCount}</TableCell>
                                <TableCell>
                                    <IconButton
                                        onClick={() => handleEditRole(role)}
                                        disabled={role.name === 'admin'}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => handleDeleteRole(role._id)}
                                        disabled={role.name === 'admin'}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    {selectedRole ? 'Edit Role' : 'Add New Role'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Role Name"
                        value={roleData.name}
                        onChange={(e) => setRoleData({
                            ...roleData,
                            name: e.target.value
                        })}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Description"
                        value={roleData.description}
                        onChange={(e) => setRoleData({
                            ...roleData,
                            description: e.target.value
                        })}
                        margin="normal"
                        multiline
                        rows={2}
                    />

                    <div className="permissions-section">
                        <h3>Permissions</h3>
                        {Object.entries(availablePermissions).map(([category, permissions]) => (
                            <div key={category} className="permission-category">
                                <h4>{category.charAt(0).toUpperCase() + category.slice(1)}</h4>
                                <FormGroup>
                                    {permissions.map((permission) => (
                                        <FormControlLabel
                                            key={permission}
                                            control={
                                                <Checkbox
                                                    checked={roleData.permissions.includes(permission)}
                                                    onChange={() => handlePermissionChange(permission)}
                                                />
                                            }
                                            label={permission.split('_').join(' ')}
                                        />
                                    ))}
                                </FormGroup>
                            </div>
                        ))}
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleSaveRole} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default RoleManagement; 