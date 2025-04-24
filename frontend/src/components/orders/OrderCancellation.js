import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Typography,
    Alert,
    Box,
    Chip
} from '@mui/material';
import { orderService } from '../../services/orderService';
import './OrderCancellation.css';

const cancellationReasons = [
    'Changed my mind',
    'Found better price elsewhere',
    'Ordered wrong item',
    'Shipping time too long',
    'Other'
];

const OrderCancellation = ({ order, onCancellationComplete }) => {
    const [open, setOpen] = useState(false);
    const [reason, setReason] = useState('');
    const [additionalInfo, setAdditionalInfo] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleCancellation = async () => {
        try {
            setLoading(true);
            setError(null);

            await orderService.cancelOrder(order._id, {
                reason,
                additionalInfo
            });

            onCancellationComplete?.();
            setOpen(false);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const canCancel = order.status === 'pending' || order.status === 'processing';

    return (
        <>
            <Button
                variant="outlined"
                color="error"
                onClick={() => setOpen(true)}
                disabled={!canCancel}
            >
                Cancel Order
            </Button>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    Cancel Order #{order._id}
                </DialogTitle>
                <DialogContent>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box className="cancellation-content">
                        <Typography variant="subtitle2" gutterBottom>
                            Order Details
                        </Typography>
                        <Box className="order-summary">
                            <Typography variant="body2">
                                Order Date: {new Date(order.createdAt).toLocaleDateString()}
                            </Typography>
                            <Typography variant="body2">
                                Total Amount: ${order.totalAmount}
                            </Typography>
                            <Typography variant="body2">
                                Items: {order.items.length}
                            </Typography>
                        </Box>

                        <FormControl component="fieldset" sx={{ mt: 2 }}>
                            <FormLabel component="legend">
                                Reason for Cancellation
                            </FormLabel>
                            <RadioGroup
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                            >
                                {cancellationReasons.map((r) => (
                                    <FormControlLabel
                                        key={r}
                                        value={r}
                                        control={<Radio />}
                                        label={r}
                                    />
                                ))}
                            </RadioGroup>
                        </FormControl>

                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Additional Information"
                            value={additionalInfo}
                            onChange={(e) => setAdditionalInfo(e.target.value)}
                            margin="normal"
                        />

                        <Box className="cancellation-notice">
                            <Typography variant="body2" color="error">
                                Please note:
                            </Typography>
                            <ul>
                                <li>Cancellation is only possible for orders that haven't been shipped</li>
                                <li>Refund will be processed to original payment method</li>
                                <li>Processing time: 5-7 business days</li>
                            </ul>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={() => setOpen(false)}
                        disabled={loading}
                    >
                        Keep Order
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleCancellation}
                        disabled={loading || !reason}
                    >
                        {loading ? 'Processing...' : 'Confirm Cancellation'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default OrderCancellation; 