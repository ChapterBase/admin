import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Paper, CircularProgress, Box, TextField, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Grid from '@mui/material/Grid2'; // Correct import statement for Grid2
import { apiClient } from '../services/ApiService';
import dayjs from 'dayjs';

const statusMapping = {
  PUBLISH: "Publish",
  PREVIEW: "Preview",
  DELETED: "Deleted"
};

function ViewBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await apiClient.get(`/Book/${id}`);
        setBook(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch book:', error);
        setError('Failed to fetch book');
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  if (loading) {
    return <Box display="flex" justifyContent="center" alignItems="center" height="100vh"><CircularProgress /></Box>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Paper style={{ padding: '20px', marginTop: '20px' }}>
      <Box display="flex" alignItems="center" mb={2}>
        <IconButton onClick={() => navigate('/books')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" style={{ marginLeft: 10 }}>
          Book Details
        </Typography>
      </Box>
      {book && (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Title"
              value={book.title}
              fullWidth
              slotProps={{
                input: { readOnly: true },
              }}
              variant="outlined"
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Author"
              value={book.author}
              fullWidth
              slotProps={{
                input: { readOnly: true },
              }}
              variant="outlined"
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="ISBN"
              value={book.isbn}
              fullWidth
              slotProps={{
                input: { readOnly: true },
              }}
              variant="outlined"
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Publisher"
              value={book.publisher}
              fullWidth
              slotProps={{
                input: { readOnly: true },
              }}
              variant="outlined"
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Quantity"
              value={book.quantity}
              fullWidth
              slotProps={{
                input: { readOnly: true },
              }}
              variant="outlined"
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Price"
              value={`$${book.price}`}
              fullWidth
              slotProps={{
                input: { readOnly: true },
              }}
              variant="outlined"
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Status"
              value={statusMapping[book.status] || book.status}
              fullWidth
              slotProps={{
                input: { readOnly: true },
              }}
              variant="outlined"
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Published Date"
              value={dayjs(book.publishedDate).format('YYYY-MM-DD')}
              fullWidth
              slotProps={{
                input: { readOnly: true },
              }}
              variant="outlined"
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
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
          </Grid>
          <Grid item xs={12} sm={6}>
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
          </Grid>
        </Grid>
      )}
    </Paper>
  );
}

export default ViewBook;