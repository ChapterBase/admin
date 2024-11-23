import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Paper, CircularProgress, Box, TextField, Button, MenuItem, Select, FormControl, InputLabel, Snackbar, Alert, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import { apiClient } from '../services/ApiService';
import dayjs from 'dayjs';

const statusMapping = {
  Publish: "PUBLISH",
  Preview: "PREVIEW",
  Deleted: "DELETED"
};

function UpdateBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState({
    id: '',
    title: '',
    author: '',
    isbn: '',
    publisher: '',
    quantity: '',
    price: '',
    status: 'Preview',
    publishedDate: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await apiClient.get(`/Book/${id}`);
        const bookData = response.data.data;
        setBook({
          ...bookData,
          status: bookData.status ? Object.keys(statusMapping).find(key => statusMapping[key] === bookData.status) : 'Preview'
        });
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch book:', error);
        setError('Failed to fetch book');
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook((prevBook) => ({
      ...prevBook,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    try {
      const response = await apiClient.put(`/Book`, {
        ...book,
        status: statusMapping[book.status]
      });
      if (response.data.success) {
        setSuccessMessage(response.data.message);
        setOpenSnackbar(true);
        setTimeout(() => {
          navigate(`/view-book/${id}`);
        }, 2000);
      } else {
        setError(response.data.message || 'Failed to update book');
        setOpenErrorSnackbar(true);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError(error.response.data.message || 'Failed to update book');
      } else {
        console.error('Failed to update book:', error);
        setError('Failed to update book');
      }
      setOpenErrorSnackbar(true);
    }
  };

  const handleCancel = () => {
    navigate('/books');
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleCloseErrorSnackbar = () => {
    setOpenErrorSnackbar(false);
  };

  if (loading) {
    return <Box display="flex" justifyContent="center" alignItems="center" height="100vh"><CircularProgress /></Box>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Paper style={{ padding: '20px', marginTop: '20px', maxWidth: '600px', margin: '20px auto' }}>
      <Box display="flex" alignItems="center" mb={2}>
        <IconButton onClick={() => navigate('/books')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" style={{ marginLeft: 10 }}>
          Update Book
        </Typography>
      </Box>
      {book && (
        <form>
          <TextField
            label="Title"
            name="title"
            value={book.title}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />
          <TextField
            label="Author"
            name="author"
            value={book.author}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />
          <TextField
            disabled
            label="ISBN"
            name="isbn"
            value={book.isbn}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />
          <TextField
            label="Publisher"
            name="publisher"
            value={book.publisher}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />
          <TextField
            label="Quantity"
            name="quantity"
            value={book.quantity}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />
          <TextField
            label="Price"
            name="price"
            value={book.price}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />
          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              label="Status"
              name="status"
              value={book.status}
              onChange={handleChange}
              fullWidth
            >
              {Object.keys(statusMapping).map((key) => (
                <MenuItem key={key} value={key}>{key}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Published Date"
            name="publishedDate"
            value={dayjs(book.publishedDate).format('YYYY-MM-DD')}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />
          <TextField
            label="Created At"
            value={dayjs(book.createdAt).format('YYYY-MM-DD HH:mm:ss')}
            fullWidth
            slotProps={{
              input: { readOnly: true },
            }}
            variant="outlined"
            margin="normal"
          />
          <TextField
            label="Updated At"
            value={dayjs(book.updatedAt).format('YYYY-MM-DD HH:mm:ss')}
            fullWidth
            slotProps={{
              input: { readOnly: true },
            }}
            variant="outlined"
            margin="normal"
          />
          <Box display="flex" justifyContent="right" mt={2}>
            <Button variant="outlined" color="warning" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" style={{ marginLeft: 10 }} onClick={handleUpdate}>
              Update Book
            </Button>
          </Box>
        </form>
      )}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%', fontSize: '1.25rem' }}>
          {successMessage}
        </Alert>
      </Snackbar>
      <Snackbar
        open={openErrorSnackbar}
        autoHideDuration={10000}
        onClose={handleCloseErrorSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseErrorSnackbar}
          severity="error"
          sx={{ width: '100%', fontSize: '1.25rem' }}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={handleCloseErrorSnackbar}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {error}
        </Alert>
      </Snackbar>
    </Paper>
  );
}

export default UpdateBook;