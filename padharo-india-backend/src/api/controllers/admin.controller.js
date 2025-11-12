/* === Filename: src/api/controllers/admin.controller.js === */
import User from '../models/user.model.js'; //
import SupportModel from '../models/support.model.js';
import Review from '../models/review.model.js'; //

// --- User Management ---

/**
 * (Admin) Get all users, with optional filters.
 */
export const getAllUsers = async (req, res, next) => {
    try {
        const filters = {};
        if (req.query.role) filters.role = req.query.role; // e.g., 'Business'
        if (req.query.isVerified) filters.isVerified = req.query.isVerified === 'true';

        const users = await User.findAllUsersWithStatus(filters);
        res.status(200).json(users);
    } catch (error) {
        console.error("Error in getAllUsers admin controller:", error);
        next(error);
    }
};

/**
 * (Admin) Update a user's verification status or role.
 */
export const updateUserStatus = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { isVerified, role, businessType } = req.body;

        const statusData = {};
        if (isVerified !== undefined) statusData.isVerified = isVerified;
        if (role) statusData.role = role;
        if (businessType) statusData.businessType = businessType; // Allow changing type

        if (Object.keys(statusData).length === 0) {
            return res.status(400).json({ message: 'No valid status fields provided.' });
        }

        // Add logic to also verify the Guide/Hotel profile if isVerified is true
        // (This part is complex and depends on your exact schema, e.g., setting guides.is_verified)
        // For example:
        // if (statusData.isVerified === true && role === 'Business' && businessType === 'Guide') {
        //    await Guide.setVerifiedByUserId(userId, true);
        // }

        const success = await User.updateUserStatus(userId, statusData);
        if (!success) {
            return res.status(404).json({ message: 'User not found or update failed.' });
        }

        res.status(200).json({ message: 'User status updated successfully.' });
    } catch (error) {
        console.error("Error in updateUserStatus admin controller:", error);
        next(error);
    }
};

// --- Support Ticket Management ---

/**
 * (Admin) Get all support queries, filterable by status.
 */
export const getAllQueries = async (req, res, next) => {
    try {
        const { status } = req.query; // e.g., 'Open'
        const queries = await SupportModel.findAllQueries(status);
        res.status(200).json(queries);
    } catch (error) {
        console.error("Error in getAllQueries admin controller:", error);
        next(error);
    }
};

/**
 * (Admin) Get a specific query and all its messages.
 */
export const getQueryById = async (req, res, next) => {
    try {
        const { queryId } = req.params;
        const query = await SupportModel.findQueryById(queryId);
        if (!query) {
            return res.status(404).json({ message: 'Query not found.' });
        }
        const messages = await SupportModel.findMessagesByQueryId(queryId);
        res.status(200).json({ query, messages });
    } catch (error) {
        console.error("Error in getQueryById admin controller:", error);
        next(error);
    }
};

/**
 * (Admin) Add a reply message to any support query.
 */
export const addAdminMessage = async (req, res, next) => {
    try {
        const adminUserId = req.user.id; // Admin's user ID
        const { queryId } = req.params;
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ message: 'Message is required.' });
        }

        // Check if query exists
        const query = await SupportModel.findQueryById(queryId);
        if (!query) {
            return res.status(404).json({ message: 'Query not found.' });
        }

        // Add the message as the admin user
        const newMessageId = await SupportModel.addMessage(queryId, adminUserId, message);

        // Optional: Re-open the ticket if it was closed
        if (query.status === 'Closed') {
            await SupportModel.updateQueryStatus(queryId, 'In Progress');
        }

        res.status(201).json({ message: 'Admin reply added successfully', messageId: newMessageId });
    } catch (error) {
        console.error("Error in addAdminMessage controller:", error);
        next(error);
    }
};

/**
 * (Admin) Update a query's status (e.g., close it).
 */
export const updateQueryStatus = async (req, res, next) => {
    try {
        const { queryId } = req.params;
        const { status } = req.body; // e.g., 'Closed', 'In Progress'

        if (!status) {
            return res.status(400).json({ message: 'Status is required.' });
        }

        const success = await SupportModel.updateQueryStatus(queryId, status);
        if (!success) {
            return res.status(404).json({ message: 'Query not found or update failed.' });
        }

        res.status(200).json({ message: `Query status updated to ${status}.` });
    } catch (error) {
        console.error("Error in updateQueryStatus admin controller:", error);
        next(error);
    }
};

// --- Content Management (Example: Deleting a Review) ---

/**
 * (Admin) Delete any review by its ID.
 */
export const deleteReview = async (req, res, next) => {
    try {
        const { reviewId } = req.params;

        const success = await Review.deleteById(reviewId); // Using the new method
        if (!success) {
            return res.status(404).json({ message: 'Review not found.' });
        }

        res.status(200).json({ message: 'Review deleted successfully.' });
    } catch (error) {
        console.error("Error in deleteReview admin controller:", error);
        next(error);
    }
};

// --- Review Moderation ---
/**
 * (Admin) Get all reviews with user info.
 */
export const getAllReviews = async (req, res, next) => {
    try {
        const reviews = await Review.findAllWithUser();
        res.status(200).json(reviews);
    } catch (error) {
        console.error("Error in getAllReviews admin controller:", error);
        next(error);
    }
};