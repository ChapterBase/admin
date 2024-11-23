import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Paper, CircularProgress, Grid, ImageList, ImageListItem } from '@mui/material';
import { apiClient } from '../services/ApiService';

function ViewAd() {
  const { id } = useParams();
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [thumbnailData, setThumbnailData] = useState(null);
  const [imageData, setImageData] = useState([]);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const response = await apiClient.get(`/post/by/id?id=${id}`);
        setAd(response.data);
        setLoading(false);

        if (response.data.thumbnail) {
          fetchImage(response.data.thumbnail, setThumbnailData);
        }

        if (response.data.images && response.data.images.length > 0) {
          response.data.images.forEach(image => {
            fetchImage(image, (data) => {
              setImageData(prevData => [...prevData, data]);
            });
          });
        }
      } catch (error) {
        console.error('Failed to fetch ad:', error);
        setError('Failed to fetch ad');
        setLoading(false);
      }
    };

    fetchAd();
  }, [id]);

  const fetchImage = async (fileName, setImage) => {
    try {
      const response = await apiClient.get('/file-uploader', {
        params: { fileName: `/${fileName}` },
        responseType: 'arraybuffer'
      });
      const base64Flag = 'data:image/jpeg;base64,';
      const imageStr = arrayBufferToBase64(response.data);
      setImage(base64Flag + imageStr);
    } catch (error) {
      console.error('Error fetching and processing image:', error);
    }
  };

  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Paper style={{ padding: '20px', marginTop: '20px' }}>
      <Typography variant="h4" gutterBottom>Ad Details</Typography>
      {ad && (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6"><strong>Title:</strong> {ad.title}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6"><strong>Description:</strong> {ad.description}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6"><strong>Created At:</strong> {new Date(ad.createdAt).toLocaleString()}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6"><strong>Updated At:</strong> {new Date(ad.updatedAt).toLocaleString()}</Typography>
          </Grid>
          {thumbnailData && (
            <Grid item xs={12}>
              <img src={thumbnailData} alt="Thumbnail" style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }} />
            </Grid>
          )}
          {imageData.length > 0 && (
            <Grid item xs={12}>
              <ImageList cols={3} rowHeight={164}>
                {imageData.map((image, index) => (
                  <ImageListItem key={index}>
                    <img src={image} alt={`Image ${index + 1}`} />
                  </ImageListItem>
                ))}
              </ImageList>
            </Grid>
          )}
        </Grid>
      )}
    </Paper>
  );
}

export default ViewAd;