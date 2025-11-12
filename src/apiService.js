// A simple function to get the token from localStorage
const getToken = () => localStorage.getItem('token');

// A helper for handling API responses
const handleResponse = async (response) => {
    // Check if the response has JSON content
    const contentType = response.headers.get("content-type");
    const hasJsonContent = contentType && contentType.includes("application/json");

    if (!response.ok) {
        // It's an error. Try to parse JSON, but fall back if it fails.
        let errorMessage = `Error: ${response.status} ${response.statusText}`;
        if (hasJsonContent) {
            try {
                const errorData = await response.json();
                // Include validation errors if present
                if (errorData && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
                    const details = errorData.errors
                        .map(err => `${err.field || 'field'}: ${err.message || 'Invalid'}`)
                        .join('; ');
                    errorMessage = `${errorData.message || 'Validation failed.'} ${details}`;
                } else {
                    errorMessage = errorData.message || errorMessage;
                }
            } catch (e) {
                // JSON parsing failed even though header said it was JSON
                errorMessage = "Failed to parse backend error response.";
            }
        } else {
            // No JSON content, maybe plain text?
            try {
                const textError = await response.text();
                if (textError) errorMessage = textError;
            } catch (e) { /* ignore */ }
        }
        throw new Error(errorMessage);
    }

    // It's a success.
    if (hasJsonContent) {
        return response.json();
    } else {
        // This handles 204 No Content responses
        return;
    }
};

/**
 * Performs a login request.
 * @param {string} email - User's email.
 * @param {string} password - User's password.
 * @returns {Promise<object>} - The API response (e.g., { user, token, message }).
 */
export const apiLogin = (email, password) => {
    return fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    }).then(handleResponse);
};

/**
 * Performs a signup request.
 * @param {object} signupData - User data for registration.
 * (e.g., { firstName, lastName, email, mobile, password, userType, businessType })
 * @returns {Promise<object>} - The API response (e.g., { user, token, message }).
 */
export const apiSignup = (signupData) => {
    return fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
    }).then(handleResponse);
};

/**
 * A helper function for making authenticated GET requests.
 * @param {string} url - The API endpoint (e.g., '/api/user/profile').
 * @returns {Promise<object>} - The API response.
 */
export const authedFetch = (url) => {
    const token = getToken();
    return fetch(url, {
        method: 'GET',
        cache: 'no-store',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    }).then(handleResponse);
};

/**
 * A helper function for making authenticated requests with a body.
 * @param {string} url - The API endpoint.
 * @param {string} method - HTTP method (e.g., 'POST', 'PUT').
 * @param {object} body - JSON body to send.
 * @returns {Promise<object>} - The API response.
 */
export const authedRequest = (url, method = 'POST', body = {}) => {
    const token = getToken();
    // Replace undefined values with null so SQL binders don’t reject the payload
    const sanitizedBody = JSON.parse(
        JSON.stringify(body, (key, value) => (value === undefined ? null : value))
    );
    return fetch(url, {
        method,
        cache: 'no-store',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(sanitizedBody),
    }).then(handleResponse);
};

/**
 * A helper function for making public GET requests.
 * @param {string} url - The API endpoint (e.g., '/api/cabs').
 * @returns {Promise<object>} - The API response.
 */
export const apiFetch = (url) => {
    return fetch(url, {
        method: 'GET',
        cache: 'no-store',
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(handleResponse);
};

/**
 * Fetches verified guides with optional filters.
 * @param {object} filters - { query?: string, language?: string, specialty?: string }
 * @returns {Promise<Array>} - List of guides.
 */
export const apiGetGuides = (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.query) params.set('query', filters.query);
    if (filters.language) params.set('language', filters.language);
    if (filters.specialty) params.set('specialty', filters.specialty);
    const qs = params.toString();
    const url = qs ? `/api/guides?${qs}` : '/api/guides';
    return apiFetch(url);
};

/**
 * Creates a guide profile for the authenticated Guide user.
 * @param {object} profileData - Fields like location, description_short, description_long, languages, specialties, price_per_hour, experience_years, image_url.
 */
export const apiCreateGuide = (profileData) => {
    return authedRequest('/api/guides', 'POST', profileData);
};

/**
 * Updates an existing guide profile by ID for the authenticated Guide user.
 * @param {number} id - Guide profile ID.
 * @param {object} updateData - Updatable fields.
 */
export const apiUpdateGuide = (id, updateData) => {
    return authedRequest(`/api/guides/${id}`, 'PUT', updateData);
};

/**
 * Fetches a single guide by ID (public).
 * @param {number|string} id - Guide ID.
 */
export const apiGetGuideById = (id) => {
    return apiFetch(`/api/guides/${id}`);
};

/**
 * Creates a booking (authenticated). Supports service types including 'Guide'.
 * @param {object} bookingData - { service_type, service_id, start_date, end_date?, num_hours?, total_price, ... }
 */
export const apiCreateBooking = (bookingData) => {
    return authedRequest('/api/bookings', 'POST', bookingData);
};

/**
 * Fetch bookings for the authenticated guide.
 */
export const apiGetMyGuideBookings = () => {
    return authedFetch('/api/guides/my/bookings');
};

/**
 * Fetch monthly performance stats for the authenticated guide.
 */
export const apiGetMyGuideStats = () => {
    return authedFetch('/api/guides/my/stats');
};

/**
 * Fetches bookings for the logged-in user.
 */
export const apiGetUserBookings = () => {
    return authedFetch('/api/bookings');
};

/**
 * Cancels a specific booking owned by the user.
 * @param {number|string} bookingId
 */
export const apiCancelBooking = (bookingId) => {
    return authedRequest(`/api/bookings/${bookingId}/cancel`, 'PATCH');
};

/**
 * Fetches reviews written by the logged-in user.
 */
export const apiGetUserReviews = () => {
    return authedFetch('/api/reviews/my-reviews');
};

/**
 * Fetches support queries created by the logged-in user.
 */
export const apiGetUserQueries = () => {
    return authedFetch('/api/support/queries');
};

/**
 * Fetches the logged-in user's profile.
 */
export const apiGetUserProfile = () => {
    return authedFetch('/api/user/profile');
};

/**
 * Update the logged-in user's profile.
 */
export const apiUpdateUserProfile = (profileData) => {
    return authedRequest('/api/user/profile', 'PUT', profileData);
};

/**
 * Uploads a new avatar for the logged-in user via multipart/form-data.
 * @param {File} file - The image file selected by the user.
 * @returns {Promise<object>} - The API response containing updated user profile.
 */
export const apiUploadUserAvatar = (file) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('avatar', file);
    return fetch('/api/user/profile/avatar', {
        method: 'POST',
        headers: {
            // Do NOT set Content-Type; browser will set proper multipart boundary
            'Authorization': `Bearer ${token}`,
        },
        body: formData,
    }).then(handleResponse);
};

// --- Hotel owner APIs ---
/**
 * Fetch the authenticated owner's hotel (with rooms, reviews summary).
 */
export const apiGetMyHotel = () => {
    return authedFetch('/api/hotels/my');
};

/**
 * Create a hotel for the authenticated owner.
 * @param {object} data
 */
export const apiCreateHotel = (data) => {
    return authedRequest('/api/hotels', 'POST', data);
};

/**
 * Update the authenticated owner's hotel by id.
 * @param {number} id
 * @param {object} updateData
 */
export const apiUpdateHotel = (id, updateData) => {
    return authedRequest(`/api/hotels/${id}`, 'PUT', updateData);
};

/**
 * Upload main image for a hotel via multipart/form-data.
 * @param {number} id - Hotel ID
 * @param {File} file - Image file
 */
export const apiUploadHotelImage = (id, file) => {
    const token = getToken();
    const formData = new FormData();
    formData.append('image', file);
    return fetch(`/api/hotels/${id}/upload-image`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
            // Do not set Content-Type; browser sets multipart boundary
        },
        body: formData,
    }).then(handleResponse);
};

/**
 * Upload a room image and update the room (edit flow).
 */
export const apiUploadRoomImage = (hotelId, roomId, file) => {
    const token = getToken();
    const formData = new FormData();
    formData.append('image', file);
    return fetch(`/api/hotels/${hotelId}/rooms/${roomId}/upload-image`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData,
    }).then(handleResponse);
};

/**
 * Upload a room image (create flow) and get a URL back without DB update.
 */
export const apiUploadRoomImageTemp = (hotelId, file) => {
    const token = getToken();
    const formData = new FormData();
    formData.append('image', file);
    return fetch(`/api/hotels/${hotelId}/rooms/upload-image`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData,
    }).then(handleResponse);
};

/**
 * Fetch bookings for the authenticated owner's hotel.
 */
export const apiGetMyHotelBookings = () => {
    return authedFetch('/api/hotels/my/bookings');
};

/**
 * Fetch monthly stats for the authenticated owner's hotel.
 */
export const apiGetMyHotelStats = () => {
    return authedFetch('/api/hotels/my/stats');
};

/**
 * Fetch hotels with optional filters (public).
 * @param {object} filters - { query?: string, sort?: 'rating'|'priceLowHigh'|'priceHighLow' }
 * @returns {Promise<Array>} - List of hotels.
 */
export const apiGetHotels = (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.query) params.set('query', filters.query);
    if (filters.sort) params.set('sort', filters.sort);
    const qs = params.toString();
    const url = qs ? `/api/hotels?${qs}` : '/api/hotels';
    return apiFetch(url);
};

/**
 * Fetch rooms for a given hotel id (public endpoint).
 * @param {number} hotelId
 */
export const apiGetHotelRooms = (hotelId) => {
    return apiFetch(`/api/hotels/${hotelId}/rooms`);
};

/**
 * Fetch a single hotel by ID (public endpoint).
 * @param {number|string} id - Hotel ID.
 */
export const apiGetHotelById = (id) => {
    return apiFetch(`/api/hotels/${id}`);
};

/**
 * Get booking counts per room for a hotel (public).
 * Returns array of { room_id, booking_count }.
 */
export const apiGetHotelRoomBookingCounts = (hotelId, opts = {}) => {
    const params = new URLSearchParams();
    if (opts.startDate) params.set('start_date', opts.startDate);
    if (opts.endDate) params.set('end_date', opts.endDate);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return apiFetch(`/api/hotels/${hotelId}/rooms/booking-counts${qs}`);
};

/**
 * Create a room for a given hotel id.
 * @param {number} hotelId
 * @param {object} roomData
 */
export const apiCreateRoom = (hotelId, roomData) => {
    return authedRequest(`/api/hotels/${hotelId}/rooms`, 'POST', roomData);
};

/**
 * Update a room by id for a given hotel id.
 * @param {number} hotelId
 * @param {number} roomId
 * @param {object} updateData
 */
export const apiUpdateRoom = (hotelId, roomId, updateData) => {
    return authedRequest(`/api/hotels/${hotelId}/rooms/${roomId}`, 'PUT', updateData);
};

/**
 * Delete a room by id for a given hotel id.
 * @param {number} hotelId
 * @param {number} roomId
 */
export const apiDeleteRoom = (hotelId, roomId) => {
    return authedRequest(`/api/hotels/${hotelId}/rooms/${roomId}`, 'DELETE');
};

// --- Admin APIs ---
/**
 * Get all users with optional filters.
 * filters: { role?: 'User'|'Business', isVerified?: boolean }
 */
export const apiAdminGetUsers = (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.role) params.set('role', filters.role);
    if (typeof filters.isVerified === 'boolean') params.set('isVerified', String(filters.isVerified));
    const qs = params.toString();
    const url = qs ? `/api/admin/users?${qs}` : '/api/admin/users';
    return authedFetch(url);
};

/**
 * Update a user's status (role, verification, businessType).
 */
export const apiAdminUpdateUserStatus = (userId, updates) => {
    return authedRequest(`/api/admin/users/${userId}/status`, 'PATCH', updates);
};

/**
 * Get all support queries (admin), with optional status filter.
 */
export const apiAdminGetQueries = (status) => {
    const url = status ? `/api/admin/support/queries?status=${encodeURIComponent(status)}` : '/api/admin/support/queries';
    return authedFetch(url);
};

/**
 * Get a single query with messages by id (admin).
 */
export const apiAdminGetQueryById = (queryId) => {
    return authedFetch(`/api/admin/support/queries/${queryId}`);
};

/**
 * Add an admin message to a query.
 */
export const apiAdminAddMessage = (queryId, message) => {
    return authedRequest(`/api/admin/support/queries/${queryId}/messages`, 'POST', { message });
};

/**
 * Update a query status (Open, Closed, In Progress).
 */
export const apiAdminUpdateQueryStatus = (queryId, status) => {
    return authedRequest(`/api/admin/support/queries/${queryId}/status`, 'PATCH', { status });
};

/**
 * Delete a review by id (admin).
 */
export const apiAdminDeleteReview = (reviewId) => {
    return authedRequest(`/api/admin/reviews/${reviewId}`, 'DELETE');
};

/**
 * Get all reviews (admin).
 */
export const apiAdminGetReviews = () => {
    return authedFetch('/api/admin/reviews');
};

/**
 * Packages (admin): list, create, update, delete.
 */
export const apiGetPackages = (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.query) params.set('query', filters.query);
    if (filters.price) params.set('price', String(filters.price));
    if (filters.rating) params.set('rating', String(filters.rating));
    if (filters.nights) params.set('nights', String(filters.nights));
    const qs = params.toString();
    const url = qs ? `/api/packages?${qs}` : '/api/packages';
    return apiFetch(url);
};

/**
 * Fetch cabs with optional filters (public).
 * @param {object} filters - { query?: string, seats?: number, type?: string }
 * @returns {Promise<Array>} - List of cabs.
 */
export const apiGetCabs = (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.query) params.set('query', filters.query);
    if (filters.seats) params.set('seats', String(filters.seats));
    if (filters.type) params.set('type', String(filters.type));
    const qs = params.toString();
    const url = qs ? `/api/cabs?${qs}` : '/api/cabs';
    return apiFetch(url);
};

/**
 * Fetch a single package by its unique name slug.
 * Example: name 'Golden Triangle Delight' → slug 'Golden-Triangle-Delight'
 */
export const apiGetPackageByName = (packageNameSlug) => {
    const safeSlug = String(packageNameSlug || '').trim();
    return apiFetch(`/api/packages/${safeSlug}`);
};

/**
 * Fetch reviews for a specific service (e.g., 'Package', serviceId numeric).
 */
export const apiGetServiceReviews = (serviceType, serviceId) => {
    const type = String(serviceType || '');
    const id = Number(serviceId);
    return apiFetch(`/api/reviews/service/${type}/${id}`);
};

/**
 * Create a new review for a booking/service (authenticated).
 * @param {object} data - { service_type, service_id, booking_id?, rating, comment }
 */
export const apiCreateReview = (data) => {
    return authedRequest('/api/reviews', 'POST', data);
};

export const apiAdminCreatePackage = (data) => {
    return authedRequest('/api/packages', 'POST', data);
};

export const apiAdminUpdatePackage = (id, data) => {
    return authedRequest(`/api/packages/${id}`, 'PUT', data);
};

export const apiAdminDeletePackage = (id) => {
    return authedRequest(`/api/packages/${id}`, 'DELETE');
};

/**
 * Upload a package image and update the package (edit flow).
 */
export const apiAdminUploadPackageImage = (id, file) => {
    const token = getToken();
    const formData = new FormData();
    formData.append('image', file);
    return fetch(`/api/packages/${id}/upload-image`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
    }).then(handleResponse);
};

/**
 * Upload a package image (create flow) and get a URL back without DB update.
 */
export const apiAdminUploadPackageImageTemp = (file) => {
    const token = getToken();
    const formData = new FormData();
    formData.append('image', file);
    return fetch(`/api/packages/upload-image`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
    }).then(handleResponse);
};

/**
 * Upload multiple gallery images for a hotel and update DB (edit flow).
 * @param {number} id - Hotel ID
 * @param {File[]} files - Array of image files
 */
export const apiUploadHotelGallery = (id, files) => {
    const token = getToken();
    const formData = new FormData();
    (files || []).forEach((f) => formData.append('images', f));
    return fetch(`/api/hotels/${id}/upload-gallery`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
    }).then(handleResponse);
};

/**
 * Upload multiple gallery images (create flow) and get URLs back without DB update.
 * @param {File[]} files - Array of image files
 */
export const apiUploadHotelGalleryTemp = (files) => {
    const token = getToken();
    const formData = new FormData();
    (files || []).forEach((f) => formData.append('images', f));
    return fetch(`/api/hotels/upload-gallery`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
    }).then(handleResponse);
};