import Package from '../models/package.model.js';
// Import Review model later

/**
 * Controller to get a list of packages based on query filters.
 */
export const getAllPackages = async (req, res, next) => {
  try {
    // Extract filters from query parameters matching PackageSearchBox
    const filters = {
        query: req.query.query || '',
        price: req.query.price || '', // Max price
        rating: req.query.rating || '', // Min rating
        nights: req.query.nights || '', // Max nights (or range if implemented)
        // sort: req.query.sort || '' // Add if implementing sorting
    };

    const packages = await Package.findAll(filters);

    // TODO: Add rating calculation/retrieval for each package if needed for list view

    res.status(200).json(packages);
  } catch (error) {
    console.error("Error in getAllPackages:", error);
    next(error);
  }
};

/**
 * Controller to get details of a single package by its name (from URL param).
 */
export const getPackageByName = async (req, res, next) => {
  try {
    const { packageName } = req.params; // e.g., 'Golden-Triangle-Delight'
    const packageDetail = await Package.findByName(packageName);

    if (!packageDetail) {
      return res.status(404).json({ message: 'Package not found' });
    }

    res.status(200).json(packageDetail);
  } catch (error) {
    console.error(`Error in getPackageByName (name: ${req.params.packageName}):`, error);
    next(error);
  }
};

/**
 * Controller to create a new package (Placeholder - requires Admin role likely).
 */
export const createPackage = async (req, res, next) => {
    // !! IMPORTANT: Add authentication and role checking middleware (likely Admin) !!

    try {
        // Ensure arrays for JSON fields
        const places = Array.isArray(req.body.places) ? req.body.places : [];
        const included = Array.isArray(req.body.included) ? req.body.included : [];
        // const itinerary = Array.isArray(req.body.itinerary) ? req.body.itinerary : [];
        // const galleryUrls = Array.isArray(req.body.galleryUrls) ? req.body.galleryUrls : [];


        const packageData = {
            ...req.body,
            places: places,
            included: included
            // itinerary: itinerary,
            // galleryUrls: galleryUrls
        };

        const newPackageId = await Package.create(packageData);
        res.status(201).json({ message: 'Package created successfully', packageId: newPackageId });

    } catch (error) {
         // Handle duplicate name error from model
        if (error.message === 'Package name already exists.') {
            return res.status(409).json({ message: error.message });
        }
        console.error("Error in createPackage:", error);
        next(error);
    }
};

// --- Add other controller functions as needed (updatePackage, deletePackage) ---