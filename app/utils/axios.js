import axios from 'axios';
import apiConfig from "./apiConfig";

let ax = axios.create({
    baseURL: apiConfig.url
});

ax.defaults.headers.post['Content-Type'] = 'application/json';
ax.defaults.timeout = 15000;
export default ax;
