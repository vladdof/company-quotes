import config from '../config';
import axios from 'axios';

export default axios.create({
  baseURL: `${config.apiUrl}/`,
  params: {
    apikey: config.apiKey,
    mode: 'no-cors',
    crossDomain: true,
  },
});
