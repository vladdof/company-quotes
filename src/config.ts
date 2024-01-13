export default {
  apiUrl: import.meta.env.VITE_API_URL,
  apiKey: import.meta.env.VITE_API_KEY,
  companies: import.meta.env.VITE_APP_COMPANIES
    ? import.meta.env.VITE_APP_COMPANIES.split(',')
    : ['BABA', 'FB', 'GOOG'],
};
