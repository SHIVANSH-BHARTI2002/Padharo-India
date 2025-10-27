import Cab from '../models/cab.model.js';
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

    const cabs = await Cab.findAll(filters);

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
    const cab = await Cab.findById(id);

    if (!cab) {
      return res.status(404).json({ message: 'Cab not found' });
    }

    // TODO: Fetch and attach reviews and driver rating/experience more explicitly if needed
    // The model currently joins basic driver info. Add review fetching here or in model.

    res.status(200).json(cab);
  } catch (error) {
    console.error(`Error in getCabById (id: ${req.params.id}):`, error); // Log the error
    next(error);
  }
};

/**
 * Controller to create a new cab (Placeholder - requires auth/role).
 */
// ... imports ...
export const createCab = async (req, res, next) => {
    try {
        // --- MODIFIED ---
        // Get driver ID from the authenticated user object attached by middleware
        const driverUserId = req.user.id;
        // --- END MODIFIED ---

        const cabData = { ...req.body, driver_user_id: driverUserId };

        // Basic validation (more robust validation should be in the route definition)
        // ... (keep validation or rely solely on route validation) ...

        const newCabId = await Cab.create(cabData);
        res.status(201).json({ message: 'Cab created successfully', cabId: newCabId });

    } catch (error) {
        // ... (keep error handling) ...
        console.error("Error in createCab:", error);
        next(error);
    }
};
// ... rest of file ...

// --- Add other controller functions as needed ---
// export const updateCabAvailability = async (req, res, next) => { ... };
// export const updateCab = async (req, res, next) => { ... };
// export const deleteCab = async (req, res, next) => { ... };