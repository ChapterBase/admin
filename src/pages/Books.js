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
  Chip,
  Box,
  IconButton,
  Menu,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../services/ApiService';
import dayjs from 'dayjs';
import SettingsIcon from '@mui/icons-material/Settings';

const statusMapping = {
  All: "ALL",
  Publish: "PUBLISH",
  Preview: "PREVIEW",
  Deleted: "DELETED"
};

const statusColors = {
  PUBLISH: 'success',
  PREVIEW: 'warning',
  DELETED: 'error',
};

function Books() {
  const [books, setBooks] = useState([]);
  const [status, setStatus] = useState('All');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [error, setError] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const fetchBooks = async () => {
    const requestData = {
      status: statusMapping[status],
      page: page,
      size: size,
    };

    try {
      const response = await apiClient.post('/Book/All', requestData);
      setBooks(response.data.data);
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

  const handleUpdate = (id) => {
    navigate(`/update-book/${id}`);
  };

  const handleCreate = () => {
    navigate('/create-book');
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
      <Typography variant="h4">Books</Typography>
      <Typography>Manage and verify books here.</Typography>

      <Box justifyContent="space-between" style={{ margin: '20 0', display: 'flex', alignItems: 'center' }}>
        <Box>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            displayEmpty
            style={{ minWidth: '150px', height: '40px' }}
            inputProps={{ style: { height: '40px', padding: '10px 14px' } }}
          >
            {Object.keys(statusMapping).map((key) => (
              <MenuItem key={key} value={key}>{key}</MenuItem>
            ))}
          </Select>
          <Button variant="contained" onClick={handleSearch} style={{ marginLeft: 10 }}>
            Search
          </Button>
        </Box>
        <Box>
          <Button variant="contained" color="primary" onClick={handleCreate}>
            Create Book
          </Button>
        </Box>
      </Box>

      {error && <Typography color="error">{error}</Typography>}

      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Books List</Typography>
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
              <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Author</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>ISBN</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Publisher</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Quantity</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Price</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Published Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {books.map((book) => (
              <TableRow key={book.id} onDoubleClick={() => handleView(book.id)}>
                <TableCell>{book.title}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>{book.isbn}</TableCell>
                <TableCell>{book.publisher}</TableCell>
                <TableCell>{book.quantity}</TableCell>
                <TableCell>{book.price}</TableCell>
                <TableCell>
                  <Chip label={book.status} color={statusColors[book.status] || 'default'} />
                </TableCell>
                <TableCell>{dayjs(book.publishedDate).format('YYYY-MM-DD')}</TableCell>
                <TableCell>
                  <Button variant="contained" color="info" onClick={() => handleView(book.id)}>
                    Info
                  </Button>
                  <Button variant="contained" color="success" style={{ marginLeft: 10 }} onClick={() => handleUpdate(book.id)}>
                    Update
                  </Button>
                </TableCell>
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

export default Books;