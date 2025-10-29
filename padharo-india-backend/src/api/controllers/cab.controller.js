/* === Filename: padharo-india-backend/src/api/controllers/cab.controller.js === */
import Cab from '../models/cab.model.js'; //
// Import Review model later if fetching reviews within getCabById

/**
 * Controller to get a list of available cabs based on query filters.
 */
export const getAllCabs = async (req, res, next) => {
  try {
    // Extract filters from query parameters matching CabSearchBox state
    const filters = {
        query: req.query.query || '',
        seats: req.query.seats || '',
        type: req.query.type || '',
        // sort: req.query.sort || '' // Add if implementing sorting
    };

    const cabs = await Cab.findAll(filters); //

    // TODO: Add rating calculation/retrieval for each cab if needed for the list view

    res.status(200).json(cabs);
  } catch (error) {
    console.error("Error in getAllCabs:", error); // Log the error
    next(error); // Pass error to the global error handler
  }
};

/**
 * Controller to get details of a single cab by ID.
 */
export const getCabById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cab = await Cab.findById(id); //

    if (!cab) {
      return res.status(404).json({ message: 'Cab not found' });
    }

    // Reviews are now fetched within Cab.findById

    res.status(200).json(cab);
  } catch (error) {
    console.error(`Error in getCabById (id: ${req.params.id}):`, error); // Log the error
    next(error); //
  }
};

/**
 * Controller to create a new cab. Requires auth/role.
 */
export const createCab = async (req, res, next) => {
    try {
        // Get driver ID from the authenticated user object attached by middleware
        const driverUserId = req.user.id; // From authenticateToken

        const cabData = { ...req.body, driver_user_id: driverUserId };

        const newCabId = await Cab.create(cabData); //
        res.status(201).json({ message: 'Cab created successfully', cabId: newCabId });

    } catch (error) {
        console.error("Error in createCab:", error);
        next(error); //
    }
};

/**
 * Controller to update an existing cab. Requires authentication and ownership.
 */
export const updateCab = async (req, res, next) => {
    try {
        const cabId = parseInt(req.params.id); // Get cab ID from URL parameter
        const driverUserId = req.user.id; // Get authenticated user's ID
        const updateData = req.body; // Get update data from request body

        // Basic check for valid ID
        if (isNaN(cabId)) {
            return res.status(400).json({ message: 'Invalid Cab ID.' });
        }

        // Remove driver_user_id from updateData if present, cannot change owner
        delete updateData.driver_user_id;

        const success = await Cab.update(cabId, updateData, driverUserId); //

        if (!success) {
             // Check if cab exists at all to differentiate 404 from 403 (optional extra query)
             const ownerId = await Cab.findOwnerId(cabId); //
             if (ownerId === null) {
                 return res.status(404).json({ message: 'Cab not found.' });
             } else {
                 console.warn(`Update operation returned false for cab ${cabId} by user ${driverUserId}, but cab exists.`);
                 return res.status(200).json({ message: 'No fields updated or update failed for other reasons.' });
             }
        }

        // Fetch updated cab data to return
        const updatedCab = await Cab.findById(cabId); //
        res.status(200).json({ message: 'Cab updated successfully', cab: updatedCab });

    } catch (error) {
        // Handle specific errors from the model
        if (error.message.startsWith('Forbidden:')) { // Error thrown by Cab.update
            return res.status(403).json({ message: error.message });
        }
        console.error(`Error in updateCab controller (id: ${req.params.id}):`, error);
        next(error); // Pass other errors to the global error handler
    }
};

/**
 * Controller to delete a cab. Requires authentication and ownership.
 */
export const deleteCab = async (req, res, next) => {
    try {
        const cabId = parseInt(req.params.id);
        const driverUserId = req.user.id; //

        if (isNaN(cabId)) {
            return res.status(400).json({ message: 'Invalid Cab ID.' });
        }

        const success = await Cab.deleteById(cabId, driverUserId); //

        if (!success) {
             const ownerId = await Cab.findOwnerId(cabId); //
             if (ownerId === null) {
                 return res.status(404).json({ message: 'Cab not found.' });
             } else {
                 // If it exists but delete failed, assume forbidden based on model logic
                 return res.status(403).json({ message: 'Forbidden: User does not own this cab.' });
             }
        }

        res.status(200).json({ message: 'Cab deleted successfully.' }); // 200 OK or 204 No Content are suitable

    } catch (error) {
         // Handle specific errors from the model
        if (error.message.startsWith('Forbidden:')) { // Error thrown by Cab.deleteById
            return res.status(403).json({ message: error.message });
        }
         if (error.message.startsWith('Cannot delete cab:')) { // Error thrown by Cab.deleteById
             return res.status(409).json({ message: error.message }); // Conflict
         }
        console.error(`Error in deleteCab controller (id: ${req.params.id}):`, error);
        next(error); //
    }
};