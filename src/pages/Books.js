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
  All: "ALL",
  Publish: "PUBLISH",
  Preview: "PREVIEW",
  Deleted: "DELETED"
};

function Books() {
  const [books, setBooks] = useState([]);
  const [status, setStatus] = useState('All');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [error, setError] = useState('');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const navigate = useNavigate();

  const fetchBooks = async () => {
    const requestData = {
      status: statusMapping[status],
      page: page,
      size: size,
      fromDate: fromDate ? fromDate.toISOString() : null,
      toDate: toDate ? toDate.toISOString() : null,
    };
  
    try {
      const response = await apiClient.post('/Book/All', requestData);
      setBooks(response.data);
      setError(''); // Clear error message
    } catch (error) {
      console.error('Failed to fetch books:', error);
      setError('Failed to fetch books');
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [page, size]); // Fetch books on initial render and when page or size changes

  const handleSearch = () => {
    fetchBooks();
  };

  const handleView = (id) => {
    navigate(`/view-book/${id}`);
  };

  return (
    <div>
      <Typography variant="h4">Books</Typography>
      <Typography>Manage and verify books here.</Typography>

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
              <TableCell sx={{ fontWeight: 'bold' }}>Author</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>ISBN</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Publisher</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Quantity</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Price</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Published Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Created At</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Updated At</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {books.map((book) => (
              <TableRow key={book.id} onDoubleClick={() => handleView(book.id)}>
                <TableCell>{book.id}</TableCell>
                <TableCell>{book.title}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>{book.isbn}</TableCell>
                <TableCell>{book.publisher}</TableCell>
                <TableCell>{book.quantity}</TableCell>
                <TableCell>{book.price}</TableCell>
                <TableCell>{book.status}</TableCell>
                <TableCell>{dayjs(book.publishedDate).format('YYYY-MM-DD')}</TableCell>
                <TableCell>{dayjs(book.createdAt).format('YYYY-MM-DD HH:mm:ss')}</TableCell>
                <TableCell>{dayjs(book.updatedAt).format('YYYY-MM-DD HH:mm:ss')}</TableCell>
                <TableCell>
                  <Button variant="contained" onClick={() => handleView(book.id)}>
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

export default Books;