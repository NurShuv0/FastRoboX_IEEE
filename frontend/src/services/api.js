import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Inject auth token for every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('fastrobox-admin-token');
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});

// Normalize response / handle 401
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('fastrobox-admin-token');
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(err);
  }
);

// ── PUBLIC ───────────────────────────────────────────────────────

// Notices
export const getNotices = (params) => api.get('/notices', { params });
export const getNotice = (id) => api.get(`/notices/${id}`);

// Segments
export const getSegments = () => api.get('/segments');
export const getSegment = (id) => api.get(`/segments/${id}`);

// Timeline
export const getTimeline = () => api.get('/timeline');

// Sponsors
export const getSponsors = () => api.get('/sponsors');

// FAQs
export const getFaqs = () => api.get('/faqs');

// Gallery
export const getGallery = () => api.get('/gallery');

// Registration
export const submitRegistration = (formData) =>
  api.post('/registrations', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const checkRegistrationStatus = (params) => api.get('/registrations/status', { params });

// Contact
export const submitContact = (data) => api.post('/contact', data);

// ── ADMIN ────────────────────────────────────────────────────────

// Auth
export const adminLogin = (data) => api.post('/auth/login', data);
export const adminLogout = () => api.post('/auth/logout');
export const adminMe = () => api.get('/auth/me');

// Dashboard
export const getDashboardStats = () => api.get('/dashboard/stats');

// Admin Notices
export const adminGetNotices = (params) => api.get('/admin/notices', { params });
export const adminGetNotice = (id) => api.get(`/admin/notices/${id}`);
export const adminCreateNotice = (formData) =>
  api.post('/admin/notices', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const adminUpdateNotice = (id, formData) =>
  api.post(`/admin/notices/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const adminDeleteNotice = (id) => api.delete(`/admin/notices/${id}`);

// Admin Segments
export const adminGetSegments = () => api.get('/admin/segments');
export const adminGetSegment = (id) => api.get(`/admin/segments/${id}`);
export const adminCreateSegment = (formData) =>
  api.post('/admin/segments', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const adminUpdateSegment = (id, formData) =>
  api.post(`/admin/segments/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const adminDeleteSegment = (id) => api.delete(`/admin/segments/${id}`);

// Admin Registrations
export const adminGetRegistrations = (params) => api.get('/admin/registrations', { params });
export const adminGetRegistration = (id) => api.get(`/admin/registrations/${id}`);
export const adminUpdateRegistrationStatus = (id, data) => api.put(`/admin/registrations/${id}/status`, data);

// Admin Timeline
export const adminGetTimeline = () => api.get('/admin/timeline');
export const adminCreateTimeline = (data) => api.post('/admin/timeline', data);
export const adminUpdateTimeline = (id, data) => api.put(`/admin/timeline/${id}`, data);
export const adminDeleteTimeline = (id) => api.delete(`/admin/timeline/${id}`);

// Admin Sponsors
export const adminGetSponsors = () => api.get('/admin/sponsors');
export const adminCreateSponsor = (formData) =>
  api.post('/admin/sponsors', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const adminUpdateSponsor = (id, formData) =>
  api.post(`/admin/sponsors/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const adminDeleteSponsor = (id) => api.delete(`/admin/sponsors/${id}`);

// Admin FAQs
export const adminGetFaqs = () => api.get('/admin/faqs');
export const adminCreateFaq = (data) => api.post('/admin/faqs', data);
export const adminUpdateFaq = (id, data) => api.put(`/admin/faqs/${id}`, data);
export const adminDeleteFaq = (id) => api.delete(`/admin/faqs/${id}`);

// Admin Gallery
export const adminGetGallery = () => api.get('/admin/gallery');
export const adminCreateGallery = (formData) =>
  api.post('/admin/gallery', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const adminDeleteGallery = (id) => api.delete(`/admin/gallery/${id}`);

// Admin Contact Messages
export const adminGetMessages = () => api.get('/admin/contact');
export const adminMarkMessageRead = (id) => api.put(`/admin/contact/${id}/read`);

// Notice categories
export const getNoticeCategories = () => api.get('/notices/categories');

export default api;
