/* === Filename: src/api/controllers/support.controller.js === */
import SupportModel from '../models/support.model.js';

/**
 * Controller to create a new support query.
 */
export const createQuery = async (req, res, next) => {
    try {
        const userId = req.user.id; // From authenticateToken
        const { subject, message } = req.body;

        if (!subject || !message) {
            return res.status(400).json({ message: 'Subject and message are required.' });
        }

        const newQueryId = await SupportModel.createQuery(userId, subject, message);
        res.status(201).json({ message: 'Support query created successfully', queryId: newQueryId });

    } catch (error) {
        console.error("Error in createQuery controller:", error);
        next(error);
    }
};

/**
 * Controller to get all support queries for the authenticated user.
 */
export const getUserQueries = async (req, res, next) => {
    try {
        const userId = req.user.id; //
        const queries = await SupportModel.findQueriesByUserId(userId);
        res.status(200).json(queries);
    } catch (error) {
        console.error("Error in getUserQueries controller:", error);
        next(error);
    }
};

/**
 * Controller to get a specific query and its messages for the user.
 */
export const getQueryById = async (req, res, next) => {
    try {
        const userId = req.user.id; //
        const { queryId } = req.params;

        // 1. Check ownership
        const query = await SupportModel.findQueryById(queryId);
        if (!query) {
            return res.status(404).json({ message: 'Query not found.' });
        }
        if (query.user_id !== userId) {
            return res.status(403).json({ message: 'Forbidden: You do not own this query.' });
        }

        // 2. Get messages
        const messages = await SupportModel.findMessagesByQueryId(queryId);

        res.status(200).json({ query, messages });

    } catch (error) {
        console.error("Error in getQueryById controller:", error);
        next(error);
    }
};

/**
 * Controller for a user to add a message to their own query.
 */
export const addUserMessage = async (req, res, next) => {
    try {
        const userId = req.user.id; //
        const { queryId } = req.params;
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ message: 'Message is required.' });
        }

        // 1. Check ownership and status
        const query = await SupportModel.findQueryById(queryId);
        if (!query) {
            return res.status(404).json({ message: 'Query not found.' });
        }
        if (query.user_id !== userId) {
            return res.status(403).json({ message: 'Forbidden: You do not own this query.' });
        }
        if (query.status === 'Closed') {
            return res.status(400).json({ message: 'Cannot add message: This query is closed.' });
        }

        // 2. Add the message
        const newMessageId = await SupportModel.addMessage(queryId, userId, message);
        res.status(201).json({ message: 'Message added successfully', messageId: newMessageId });

    } catch (error) {
        console.error("Error in addUserMessage controller:", error);
        next(error);
    }
};