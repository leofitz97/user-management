import axios from 'axios';

const Axios = axios.create({
  baseURL: 'http://localhost:3005',
  withCredentials: true
});


export default Axios;