import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Paper, Box, TextField, Button, Snackbar, Alert, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { apiClient } from '../services/ApiService';
import dayjs from 'dayjs';

function CreateBook() {
  const navigate = useNavigate();
  const [book, setBook] = useState({
    title: '',
    author: '',
    isbn: '',
    publisher: '',
    quantity: '',
    price: '',
    publishedDate: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook((prevBook) => ({
      ...prevBook,
      [name]: value,
    }));
  };

  const handleCreate = async () => {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(book.publishedDate)) {
      setError('Published Date must be in the format YYYY-MM-DD');
      setOpenErrorSnackbar(true);
      return;
    }

    try {
      const response = await apiClient.post('/Book', {
        ...book,
        publishedDate: `${book.publishedDate}T00:00:00`,
      });
      if (response.data.success) {
        setSuccessMessage(response.data.message);
        setOpenSnackbar(true);
        setTimeout(() => {
          navigate('/books');
        }, 2000);
      } else {
        setError(response.data.message || 'Failed to create book');
        setOpenErrorSnackbar(true);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError(error.response.data.message || 'Failed to create book');
      } else {
        console.error('Failed to create book:', error);
        setError('Failed to create book');
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

  return (
    <Paper style={{ padding: '20px', marginTop: '20px', maxWidth: '600px', margin: '20px auto' }}>
      <Typography variant="h4" gutterBottom>Create Book</Typography>
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
        <TextField
          label="Published Date"
          name="publishedDate"
          value={book.publishedDate}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          margin="normal"
          placeholder="YYYY-MM-DD"
        />
        <Box display="flex" justifyContent="right" mt={2}>
          <Button variant="outlined" color="warning" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" style={{ marginLeft: 10 }} onClick={handleCreate}>
            Create Book
          </Button>
        </Box>
      </form>
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

export default CreateBook;