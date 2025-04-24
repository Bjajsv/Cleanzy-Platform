import React, { useState } from 'react';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    Typography,
    LinearProgress,
    Alert
} from '@mui/material';
import {
    CloudUpload as UploadIcon,
    CloudDownload as DownloadIcon
} from '@mui/icons-material';
import { productService } from '../../services/productService';
import './BulkProductOperations.css';

const BulkProductOperations = () => {
    const [importing, setImporting] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleImport = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setImporting(true);
        setError(null);
        setSuccess(null);

        try {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const products = JSON.parse(e.target.result);
                let processed = 0;

                for (const product of products) {
                    try {
                        await productService.createProduct(product);
                        processed++;
                        setProgress((processed / products.length) * 100);
                    } catch (err) {
                        console.error(`Error importing product: ${product.name}`, err);
                    }
                }

                setSuccess(`Successfully imported ${processed} products`);
            };

            reader.readAsText(file);
        } catch (err) {
            setError('Error importing products: ' + err.message);
        } finally {
            setImporting(false);
            setProgress(0);
        }
    };

    const handleExport = async () => {
        try {
            const response = await productService.getAllProducts({ limit: 1000 });
            const products = response.data;

            const exportData = JSON.stringify(products, null, 2);
            const blob = new Blob([exportData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `products-export-${new Date().toISOString()}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (err) {
            setError('Error exporting products: ' + err.message);
        }
    };

    return (
        <div className="bulk-operations">
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Button
                        variant="contained"
                        component="label"
                        startIcon={<UploadIcon />}
                        disabled={importing}
                        fullWidth
                    >
                        Import Products
                        <input
                            type="file"
                            hidden
                            accept=".json"
                            onChange={handleImport}
                        />
                    </Button>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Button
                        variant="contained"
                        startIcon={<DownloadIcon />}
                        onClick={handleExport}
                        fullWidth
                    >
                        Export Products
                    </Button>
                </Grid>

                {importing && (
                    <Grid item xs={12}>
                        <LinearProgress variant="determinate" value={progress} />
                        <Typography variant="body2" color="textSecondary">
                            Importing products... {Math.round(progress)}%
                        </Typography>
                    </Grid>
                )}

                {error && (
                    <Grid item xs={12}>
                        <Alert severity="error">{error}</Alert>
                    </Grid>
                )}

                {success && (
                    <Grid item xs={12}>
                        <Alert severity="success">{success}</Alert>
                    </Grid>
                )}
            </Grid>
        </div>
    );
};

export default BulkProductOperations; 