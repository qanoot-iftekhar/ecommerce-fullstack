import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Products API
export const getProducts = () => api.get('/products/');
export const getProduct = (id) => api.get(`/products/${id}/`);
export const getProductsByCategory = (category) => api.get(`/products/?category=${category}`);

// Cart API
export const getCart = (sessionId) => api.get(`/cart/?session_id=${sessionId}`);
export const addToCart = (data) => api.post('/cart/add_to_cart/', data);

// Orders API
export const createOrder = (orderData) => api.post('/orders/', orderData);

// Blogs API
export const getBlogs = () => api.get('/blogs/');

export default api;