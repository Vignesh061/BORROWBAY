import axios from 'axios';

const API = axios.create({
    baseURL: 'http://127.0.0.1:5000/api',
    headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth
export const registerUser = (data) => API.post('/register', data);
export const loginUser = (data) => API.post('/login', data);
export const getMe = () => API.get('/me');

// Items
export const getItems = (params) => API.get('/items', { params });
export const getItem = (id) => API.get(`/items/${id}`);
export const createItem = (data) => API.post('/items', data);
export const updateItem = (id, data) => API.put(`/items/${id}`, data);
export const deleteItem = (id) => API.delete(`/items/${id}`);
export const getCategories = () => API.get('/categories');

// Borrow Requests
export const createBorrowRequest = (data) => API.post('/request', data);
export const approveRequest = (id, action) => API.put(`/approve/${id}`, { action });
export const returnItem = (id) => API.put(`/return/${id}`);
export const getRequests = (params) => API.get('/requests', { params });

export default API;
