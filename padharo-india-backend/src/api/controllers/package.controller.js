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
export const updatePackage = async (req, res, next) => {
    try {
        const packageId = parseInt(req.params.id); // Get ID from param for update/delete
        const updateData = req.body;

        if (isNaN(packageId)) {
            return res.status(400).json({ message: 'Invalid Package ID.' });
        }

        // Handle array inputs for JSON fields
        if (updateData.places && !Array.isArray(updateData.places)) {
             return res.status(400).json({ message: 'Places must be an array.' });
        }
        if (updateData.included && !Array.isArray(updateData.included)) {
             return res.status(400).json({ message: 'Included items must be an array.' });
        }
        // Add similar checks for itinerary, galleryUrls if implemented

        const success = await Package.update(packageId, updateData);

        if (!success) {
            // Check if it actually exists
             const pkg = await Package.findById(packageId); // Need findById if not already existing
             if (!pkg) {
                return res.status(404).json({ message: 'Package not found.' });
             } else {
                 return res.status(200).json({ message: 'No fields updated or update failed.' });
             }
        }

        // Fetch by Name requires the name, let's just return success or fetch by ID if needed
        // For consistency, might need Package.findById(id)
        res.status(200).json({ message: 'Package updated successfully' }); // Or return updated package data

    } catch (error) {
        if (error.message === 'Package name already exists.') {
            return res.status(409).json({ message: error.message });
        }
        console.error(`Error in updatePackage controller (id: ${req.params.id}):`, error);
        next(error);
    }
};

/**
 * Controller to delete a package. Requires Admin role.
 */
export const deletePackage = async (req, res, next) => {
    try {
        const packageId = parseInt(req.params.id);

        if (isNaN(packageId)) {
            return res.status(400).json({ message: 'Invalid Package ID.' });
        }

        const success = await Package.deleteById(packageId);

        if (!success) {
            return res.status(404).json({ message: 'Package not found.' });
        }

        res.status(200).json({ message: 'Package deleted successfully.' });

    } catch (error) {
        if (error.message.startsWith('Cannot delete package:')) {
             return res.status(409).json({ message: error.message }); // Conflict
         }
        console.error(`Error in deletePackage controller (id: ${req.params.id}):`, error);
        next(error);
    }
};