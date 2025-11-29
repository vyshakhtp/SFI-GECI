import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Only redirect if we're not already on admin page
      if (!window.location.pathname.includes('/admin')) {
        window.location.reload();
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/me'),
  createAdmin: (userData) => api.post('/auth/create-admin', userData),
  testToken: () => api.get('/auth/test-token'),
  debugHeaders: () => api.get('/auth/debug-headers'),
};

// Notes API
export const notesAPI = {
  // Get all notes with optional filters
  getAll: (params = {}) => api.get('/notes', { params }),
  
  // Get note by ID
  getById: (id) => api.get(`/notes/${id}`),
  
  // Create new note
  create: (formData) => api.post('/notes', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  
  // Update note
  update: (id, data) => api.put(`/notes/${id}`, data),
  
  // Delete note
  delete: (id) => api.delete(`/notes/${id}`),
  
  // Download note file
  download: (id) => api.get(`/notes/${id}/download`, { 
    responseType: 'blob' 
  }),
  
  // Get popular notes
  getPopular: (limit = 10) => api.get('/notes/popular', { 
    params: { limit } 
  }),
  
  // Get notes by subject
  getBySubject: (subject) => api.get('/notes/subject/' + subject),
  
  // Get notes by department
  getByDepartment: (department) => api.get('/notes/department/' + department),
  
  // Get notes by semester
  getBySemester: (semester) => api.get('/notes/semester/' + semester),
  
  // Search notes
  search: (query, params = {}) => api.get('/notes/search', {
    params: { q: query, ...params }
  }),
  // Add to notesAPI in api.js
view: (id) => api.get(`/notes/${id}/view`, { 
  responseType: 'blob' 
}),
  
  // Get metadata for filters
  getSubjects: () => api.get('/notes/meta/subjects'),
  getDepartments: () => api.get('/notes/meta/departments'),
  getSemesters: () => api.get('/notes/meta/semesters'),
  getTypes: () => api.get('/notes/meta/types'),
  
  // Increment download count
  incrementDownload: (id) => api.patch(`/notes/${id}/download`),
  
  // Rate a note
  rate: (id, rating) => api.post(`/notes/${id}/rate`, { rating }),
};

// Complaints API
export const complaintsAPI = {
  // Submit new complaint
  submit: (data) => api.post('/complaints', data),
  
  // Get all complaints (admin only)
  getAll: (params = {}) => api.get('/complaints', { params }),
  
  // Get complaint by ID
  getById: (id) => api.get(`/complaints/${id}`),
  
  // Update complaint (admin only)
  update: (id, data) => api.put(`/complaints/${id}`, data),
  
  // Delete complaint (admin only)
  delete: (id) => api.delete(`/complaints/${id}`),
  
  // Get user's complaints
  getMyComplaints: () => api.get('/complaints/my-complaints'),
  
  // Update complaint status
  updateStatus: (id, status, response = '') => 
    api.patch(`/complaints/${id}/status`, { status, response }),
  
  // Assign complaint to admin
  assign: (id, adminId) => 
    api.patch(`/complaints/${id}/assign`, { assignedTo: adminId }),
  
  // Add response to complaint
  addResponse: (id, response) => 
    api.patch(`/complaints/${id}/response`, { response }),
  
  // Get complaint statistics
  getStats: () => api.get('/complaints/stats/overview'),
  getCategoryStats: () => api.get('/complaints/stats/categories'),
  getStatusStats: () => api.get('/complaints/stats/status'),
  
  // Get recent complaints
  getRecent: (limit = 10) => api.get('/complaints/recent/public', {
    params: { limit }
  }),
  
  // Search complaints
  search: (query, params = {}) => api.get('/complaints/search', {
    params: { q: query, ...params }
  }),
  
  // Get metadata
  getCategories: () => api.get('/complaints/meta/categories'),
  getDepartments: () => api.get('/complaints/meta/departments'),
  getStatuses: () => api.get('/complaints/meta/statuses'),
  getPriorities: () => api.get('/complaints/meta/priorities'),
};

// Gallery API
export const galleryAPI = {
  // Get all gallery items
  getAll: (params = {}) => api.get('/gallery', { params }),
  
  // Get gallery item by ID
  getById: (id) => api.get(`/gallery/${id}`),
  
  // Create new gallery item
  create: (formData) => api.post('/gallery', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  
  // Update gallery item
  update: (id, data) => api.put(`/gallery/${id}`, data),
  
  // Delete gallery item
  delete: (id) => api.delete(`/gallery/${id}`),
  
  // Get gallery items by category
  getByCategory: (category) => api.get('/gallery/category/' + category),
  
  // Get recent gallery items
  getRecent: (limit = 10) => api.get('/gallery/recent', { 
    params: { limit } 
  }),
  
  // Get popular gallery items
  getPopular: (limit = 10) => api.get('/gallery/popular', { 
    params: { limit } 
  }),
  
  // Increment view count
  incrementViews: (id) => api.patch(`/gallery/${id}/view`),
  
  // Search gallery items
  search: (query, params = {}) => api.get('/gallery/search', {
    params: { q: query, ...params }
  }),
  
  // Get metadata
  getCategories: () => api.get('/gallery/meta/categories'),
  getYears: () => api.get('/gallery/meta/years'),
};

// Members API
export const membersAPI = {
  // Get all members
  getAll: (params = {}) => api.get('/members', { params }),
  
  // Get member by ID
  getById: (id) => api.get(`/members/${id}`),
  
  // Create new member
  create: (formData) => api.post('/members', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  
  // Update member
  update: (id, formData) => api.put(`/members/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  
  // Delete member
  delete: (id) => api.delete(`/members/${id}`),
  
  // Get members by position
  getByPosition: (position) => api.get('/members/position/' + position),
  
  // Get members by department
  getByDepartment: (department) => api.get('/members/department/' + department),
  
  // Get members by year
  getByYear: (year) => api.get('/members/year/' + year),
  
  // Get executive committee
  getExecutive: () => api.get('/members/executive'),
  
  // Get active members
  getActive: () => api.get('/members/active'),
  
  // Search members
  search: (query, params = {}) => api.get('/members/search', {
    params: { q: query, ...params }
  }),
  
  // Get metadata
  getPositions: () => api.get('/members/meta/positions'),
  getDepartments: () => api.get('/members/meta/departments'),
  getYears: () => api.get('/members/meta/years'),
};

// Notifications API
export const notificationsAPI = {
  // Get all notifications
  getAll: (params = {}) => api.get('/notifications', { params }),
  
  // Get notification by ID
  getById: (id) => api.get(`/notifications/${id}`),
  
  // Create new notification
  create: (data) => api.post('/notifications', data),
  
  // Update notification
  update: (id, data) => api.put(`/notifications/${id}`, data),
  
  // Delete notification
  delete: (id) => api.delete(`/notifications/${id}`),
  
  // Get active notifications
  getActive: () => api.get('/notifications/active'),
  
  // Get notifications by type
  getByType: (type) => api.get('/notifications/type/' + type),
  
  // Get urgent notifications
  getUrgent: () => api.get('/notifications/urgent'),
  
  // Mark notification as read
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  
  // Mark all as read
  markAllAsRead: () => api.patch('/notifications/read-all'),
  
  // Get unread count
  getUnreadCount: () => api.get('/notifications/unread/count'),
  
  // Get notifications for admin
  getAllForAdmin: (params = {}) => api.get('/notifications/admin/all', { params }),
  
  // Search notifications
  search: (query, params = {}) => api.get('/notifications/search', {
    params: { q: query, ...params }
  }),
  
  // Get metadata
  getTypes: () => api.get('/notifications/meta/types'),
  getPriorities: () => api.get('/notifications/meta/priorities'),
  getTargetAudiences: () => api.get('/notifications/meta/audiences'),
};

// Analytics API
export const analyticsAPI = {
  // Dashboard overview
  getOverview: () => api.get('/analytics/overview'),
  
  // Notes analytics
  getNotesStats: (period = 'monthly') => 
    api.get('/analytics/notes', { params: { period } }),
  
  // Complaints analytics
  getComplaintsStats: (period = 'monthly') => 
    api.get('/analytics/complaints', { params: { period } }),
  
  // User analytics
  getUserStats: () => api.get('/analytics/users'),
  
  // Download statistics
  getDownloadStats: (period = 'monthly') => 
    api.get('/analytics/downloads', { params: { period } }),
};

// File Upload API
export const uploadAPI = {
  // Upload single file
  uploadFile: (formData, onProgress = null) => {
    const config = {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onProgress
    };
    return api.post('/upload/file', formData, config);
  },
  
  // Upload multiple files
  uploadMultiple: (formData, onProgress = null) => {
    const config = {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onProgress
    };
    return api.post('/upload/multiple', formData, config);
  },
  
  // Delete uploaded file
  deleteFile: (filename) => api.delete('/upload/files/' + filename),
  
  // Get uploaded files
  getFiles: () => api.get('/upload/files'),
};

// User Management API (Admin only)
export const usersAPI = {
  // Get all users
  getAll: (params = {}) => api.get('/admin/users', { params }),
  
  // Get user by ID
  getById: (id) => api.get('/admin/users/' + id),
  
  // Create user
  create: (userData) => api.post('/admin/users', userData),
  
  // Update user
  update: (id, userData) => api.put('/admin/users/' + id, userData),
  
  // Delete user
  delete: (id) => api.delete('/admin/users/' + id),
  
  // Change user role
  changeRole: (id, role) => 
    api.patch('/admin/users/' + id + '/role', { role }),
  
  // Toggle user active status
  toggleActive: (id) => 
    api.patch('/admin/users/' + id + '/active'),
  
  // Reset user password
  resetPassword: (id, newPassword) => 
    api.patch('/admin/users/' + id + '/password', { newPassword }),
};

// System API
export const systemAPI = {
  // Health check
  health: () => api.get('/health'),
  
  // Get server info
  getInfo: () => api.get('/system/info'),
  
  // Get server stats
  getStats: () => api.get('/system/stats'),
  
  // Backup database
  backup: () => api.get('/system/backup', { responseType: 'blob' }),
  
  // Get logs
  getLogs: (lines = 100) => api.get('/system/logs', { 
    params: { lines } 
  }),
};

// Utility functions
export const apiUtils = {
  // Handle API errors
  handleError: (error) => {
    if (error.response) {
      // Server responded with error status
      return {
        message: error.response.data?.message || 'An error occurred',
        status: error.response.status,
        data: error.response.data
      };
    } else if (error.request) {
      // Request made but no response received
      return {
        message: 'No response from server. Please check your connection.',
        status: 0
      };
    } else {
      // Something else happened
      return {
        message: error.message || 'An unexpected error occurred',
        status: -1
      };
    }
  },
  
  // Check if error is authentication related
  isAuthError: (error) => {
    return error.response?.status === 401;
  },
  
  // Check if error is network related
  isNetworkError: (error) => {
    return !error.response;
  },
  
  // Generate query string from object
  generateQueryString: (params) => {
    const searchParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        searchParams.append(key, params[key]);
      }
    });
    return searchParams.toString();
  }
};

// Export the main axios instance
export default api;