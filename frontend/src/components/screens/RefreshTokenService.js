import axios from 'axios';

const RefreshTokenService = async () => {
  const refreshToken=localStorage.getItem('refreshToken')
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/v1/recipes/refresh-token', { refresh_token: refreshToken });
    localStorage.setItem('accessToken',response.data.access_token);
    window.location.reload();
    return response.data.access_token;
  } catch (error) {
    throw new Error('Failed to refresh access token');
  }
};

export default RefreshTokenService;