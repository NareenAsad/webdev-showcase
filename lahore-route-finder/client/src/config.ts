// Dynamic backend API base URL resolver (strips trailing slash if present)
const rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const API_BASE = rawUrl.replace(/\/+$/, '');
