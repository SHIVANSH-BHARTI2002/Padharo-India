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
                errorMessage = errorData.message || errorMessage;
            } catch (e) {
                // JSON parsing failed even though header said it was JSON
                errorMessage = "Failed to parse backend error response.";
            }
        } else {
             // No JSON content, maybe plain text?
             try {
                const textError = await response.text();
                if (textError) errorMessage = textError;
             } catch(e) { /* ignore */ }
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
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
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
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(handleResponse);
};