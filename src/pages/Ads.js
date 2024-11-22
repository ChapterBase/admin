import React, { useState, useEffect } from 'react';
import {
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  TextField,
  Paper,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../services/ApiService';
import dayjs from 'dayjs';

const statusMapping = {
  All: "All",
  Active: "ACTIVE",
  Inactive: "INACTIVE",
  Deleted: "DELETED",
  Approved: "APPROVED",
  Rejected: "REJECTED",
  "Approval Pending": "APPROVAL_PENDING"
};

function Ads() {
  const [ads, setAds] = useState([]);
  const [status, setStatus] = useState('All');
  const [fromDate, setFromDate] = useState(dayjs().subtract(28, 'day'));
  const [toDate, setToDate] = useState(dayjs());
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchAds = async () => {
    if (!fromDate || !toDate) {
      setError('From Date and To Date are required');
      return;
    }

    const allStatuses = ["ACTIVE", "INACTIVE", "DELETED", "APPROVED", "REJECTED", "APPROVAL_PENDING"];
    const requestData = {
      statuses: status === "All" ? allStatuses : (status ? [statusMapping[status]] : []),
      fromDate: new Date(fromDate).toISOString(),
      toDate: new Date(toDate).toISOString(),
      page: page,
      size: size,
    };
  
    try {
      const response = await apiClient.post('/post', requestData);
      setAds(response.data);
      setError(''); // Clear error message
    } catch (error) {
      console.error('Failed to fetch ads:', error);
      setError('Failed to fetch ads');
    }
  };

  useEffect(() => {
    fetchAds();
  }, [page, size]); // Fetch ads on initial render and when page or size changes

  const handleSearch = () => {
    fetchAds();
  };

  const handleView = (id) => {
    navigate(`/view-ad/${id}`);
  };

  return (
    <div>
      <Typography variant="h4">Ads</Typography>
      <Typography>Manage and verify ads here.</Typography>

      <div style={{ margin: '20px 0', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <Select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          displayEmpty
          style={{ minWidth: '150px' }}
        >
          {Object.keys(statusMapping).map((key) => (
            <MenuItem key={key} value={key}>{key}</MenuItem>
          ))}
        </Select>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="From Date"
            value={fromDate}
            onChange={(date) => setFromDate(date)}
            renderInput={(params) => <TextField {...params} required />}
          />
          <DatePicker
            label="To Date"
            value={toDate}
            onChange={(date) => setToDate(date)}
            renderInput={(params) => <TextField {...params} required />}
          />
        </LocalizationProvider>
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
      </div>

      {error && <Typography color="error">{error}</Typography>}

      <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Created At</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Updated At</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ads.map((ad) => (
              <TableRow key={ad.id} onDoubleClick={() => handleView(ad.id)}>
                <TableCell>{ad.id}</TableCell>
                <TableCell>{ad.title}</TableCell>
                <TableCell>{ad.description}</TableCell>
                <TableCell>{ad.createdAt}</TableCell>
                <TableCell>{ad.updatedAt}</TableCell>
                <TableCell>
                  <Button variant="contained" onClick={() => handleView(ad.id)}>
                    Update
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Ads;