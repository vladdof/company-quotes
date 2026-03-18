import config from '../config';
import axios from 'axios';

export default axios.create({
  baseURL: `${config.apiUrl}/stable/`,
  params: {
    apikey: config.apiKey,
  },
});
