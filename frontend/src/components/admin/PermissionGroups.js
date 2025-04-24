import React, { useState, useEffect } from 'react';
import {
    Paper,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Checkbox,
    FormGroup,
    FormControlLabel,
    Divider
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import { permissionService } from '../../services/permissionService';
import './PermissionGroups.css';

const PermissionGroups = () => {
    const [groups, setGroups] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [groupData, setGroupData] = useState({
        name: '',
        description: '',
        permissions: []
    });

    // Predefined permission categories
    const permissionCategories = {
        Products: [
            'view_products',
            'create_products',
            'edit_products',
            'delete_products',
            'manage_inventory'
        ],
        Orders: [
            'view_orders',
            'process_orders',
            'cancel_orders',
            'refund_orders',
            'manage_shipping'
        ],
        Customers: [
            'view_customers',
            'edit_customers',
            'delete_customers',
            'manage_support'
        ],
        Reports: [
            'view_reports',
            'export_reports',
            'manage_analytics',
            'view_statistics'
        ],
        Settings: [
            'manage_settings',
            'manage_roles',
            'manage_users',
            'system_config'
        ]
    };

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            const response = await permissionService.getAllGroups();
            setGroups(response.data);
        } catch (error) {
            console.error('Error fetching permission groups:', error);
        }
    };

    const handleAddGroup = () => {
        setSelectedGroup(null);
        setGroupData({
            name: '',
            description: '',
            permissions: []
        });
        setOpenDialog(true);
    };

    const handleEditGroup = (group) => {
        setSelectedGroup(group);
        setGroupData({
            name: group.name,
            description: group.description,
            permissions: group.permissions
        });
        setOpenDialog(true);
    };

    const handleDeleteGroup = async (groupId) => {
        if (window.confirm('Are you sure you want to delete this permission group?')) {
            try {
                await permissionService.deleteGroup(groupId);
                fetchGroups();
            } catch (error) {
                console.error('Error deleting permission group:', error);
            }
        }
    };

    const handlePermissionToggle = (permission) => {
        setGroupData(prev => ({
            ...prev,
            permissions: prev.permissions.includes(permission)
                ? prev.permissions.filter(p => p !== permission)
                : [...prev.permissions, permission]
        }));
    };

    const handleSaveGroup = async () => {
        try {
            if (selectedGroup) {
                await permissionService.updateGroup(selectedGroup._id, groupData);
            } else {
                await permissionService.createGroup(groupData);
            }
            setOpenDialog(false);
            fetchGroups();
        } catch (error) {
            console.error('Error saving permission group:', error);
        }
    };

    return (
        <div className="permission-groups">
            <div className="header">
                <Typography variant="h5">Permission Groups</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddGroup}
                >
                    Add New Group
                </Button>
            </div>

            <div className="groups-list">
                {groups.map((group) => (
                    <Paper key={group._id} className="group-item">
                        <div className="group-header">
                            <Typography variant="h6">{group.name}</Typography>
                            <div className="group-actions">
                                <IconButton onClick={() => handleEditGroup(group)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton onClick={() => handleDeleteGroup(group._id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </div>
                        </div>
                        <Typography variant="body2" color="textSecondary">
                            {group.description}
                        </Typography>
                        <div className="permissions-list">
                            {group.permissions.map((permission) => (
                                <span key={permission} className="permission-tag">
                                    {permission}
                                </span>
                            ))}
                        </div>
                    </Paper>
                ))}
            </div>

            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    {selectedGroup ? 'Edit Permission Group' : 'Create Permission Group'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Group Name"
                        value={groupData.name}
                        onChange={(e) => setGroupData({
                            ...groupData,
                            name: e.target.value
                        })}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Description"
                        value={groupData.description}
                        onChange={(e) => setGroupData({
                            ...groupData,
                            description: e.target.value
                        })}
                        margin="normal"
                        multiline
                        rows={2}
                    />
                    
                    <Typography variant="h6" className="permissions-title">
                        Permissions
                    </Typography>
                    
                    {Object.entries(permissionCategories).map(([category, permissions]) => (
                        <div key={category} className="permission-category">
                            <Typography variant="subtitle1">{category}</Typography>
                            <FormGroup>
                                {permissions.map((permission) => (
                                    <FormControlLabel
                                        key={permission}
                                        control={
                                            <Checkbox
                                                checked={groupData.permissions.includes(permission)}
                                                onChange={() => handlePermissionToggle(permission)}
                                            />
                                        }
                                        label={permission.split('_').join(' ')}
                                    />
                                ))}
                            </FormGroup>
                            <Divider />
                        </div>
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleSaveGroup} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default PermissionGroups; 