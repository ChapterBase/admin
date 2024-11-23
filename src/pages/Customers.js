import React, { useState, useEffect } from 'react';
import {
    Chip,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    IconButton,
    Menu,
    MenuItem,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../services/ApiService';
import dayjs from 'dayjs';
import SettingsIcon from '@mui/icons-material/Settings';

const statusColors = {
    ACTIVE: 'success',
    INACTIVE: 'warning',
};

function Customers() {
    const [customers, setCustomers] = useState([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [error, setError] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();

    const fetchCustomers = async () => {
        try {
            const response = await apiClient.get('/User/ByRole?role=USER', {
                params: {
                    page: page,
                    size: size,
                },
            });
            setCustomers(response.data.data);
            setError(''); // Clear error message
        } catch (error) {
            console.error('Failed to fetch customers:', error);
            setError('Failed to fetch customers');
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, [page, size]); // Fetch customers on initial render and when page or size changes

    const handleView = (id) => {
        navigate(`/view-customer/${id}`);
    };

    const handlePreviousPage = () => {
        if (page > 0) {
            setPage(page - 1);
        }
    };

    const handleNextPage = () => {
        setPage(page + 1);
    };

    const handleSettingsClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleSettingsClose = () => {
        setAnchorEl(null);
    };

    const handleSizeChange = (event) => {
        setSize(event.target.value);
        setAnchorEl(null);
    };

    return (
        <div>
            <Typography variant="h4">Customers</Typography>
            <Typography>Manage and verify customers here.</Typography>

            {error && <Typography color="error">{error}</Typography>}

            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">Customers List</Typography>
                <IconButton onClick={handleSettingsClick}>
                    <SettingsIcon />
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleSettingsClose}
                >
                    <MenuItem value={5} onClick={handleSizeChange}>5</MenuItem>
                    <MenuItem value={10} onClick={handleSizeChange}>10</MenuItem>
                    <MenuItem value={20} onClick={handleSizeChange}>20</MenuItem>
                    <MenuItem value={30} onClick={handleSizeChange}>30</MenuItem>
                </Menu>
            </Box>

            <TableContainer component={Paper} sx={{ maxHeight: 1000 }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Username</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Created At</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Updated At</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {customers.map((customer) => (
                            <TableRow key={customer.id} onDoubleClick={() => handleView(customer.id)}>
                                <TableCell>{customer.username}</TableCell>
                                <TableCell>{customer.email}</TableCell>
                                <TableCell>{customer.role}</TableCell>
                                <TableCell>
                                    <Chip label={customer.status} color={statusColors[customer.status] || 'default'} />
                                </TableCell>
                                <TableCell>{dayjs(customer.createdAt).format('YYYY-MM-DD HH:mm:ss')}</TableCell>
                                <TableCell>{dayjs(customer.updatedAt).format('YYYY-MM-DD HH:mm:ss')}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box display="flex" justifyContent="right" mt={2}>
                <Button onClick={handlePreviousPage} color="secondary" disabled={page === 0}>
                    Previous Page
                </Button>
                <Button onClick={handleNextPage}>
                    Next Page
                </Button>
            </Box>
        </div>
    );
}

export default Customers;