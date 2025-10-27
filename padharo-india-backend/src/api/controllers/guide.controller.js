import Guide from '../models/guide.model.js';
// Import Review model later

/**
 * Controller to get a list of verified guides based on query filters.
 */
export const getAllGuides = async (req, res, next) => {
  try {
    // Extract filters from query parameters matching GuideSearchBox
    const filters = {
        query: req.query.query || '',        // Search by city or guide name
        language: req.query.language || '',
        specialty: req.query.specialty || '',
        // sort: req.query.sort || '' // Add if implementing sorting
    };

    const guides = await Guide.findAll(filters);

    // TODO: Add rating calculation/retrieval for each guide if needed for the list view

    res.status(200).json(guides);
  } catch (error) {
    console.error("Error in getAllGuides:", error);
    next(error);
  }
};

/**
 * Controller to get details of a single guide by ID.
 */
export const getGuideById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const guideDetail = await Guide.findById(id);

    if (!guideDetail) {
      return res.status(404).json({ message: 'Guide not found' });
    }

    res.status(200).json(guideDetail);
  } catch (error) {
    console.error(`Error in getGuideById (id: ${req.params.id}):`, error);
    next(error);
  }
};

/**
 * Controller to create a new guide profile (Placeholder - requires auth/role).
 */
// ... imports ...
export const createGuide = async (req, res, next) => {
    try {
        // --- MODIFIED ---
        const guideUserId = req.user.id;
        // --- END MODIFIED ---

        const languages = Array.isArray(req.body.languages) ? req.body.languages : [];
        const specialties = Array.isArray(req.body.specialties) ? req.body.specialties : [];

        const guideData = {
            ...req.body,
            guide_user_id: guideUserId,
            languages: languages,
            specialties: specialties
        };

        const newGuideId = await Guide.create(guideData);
        res.status(201).json({ message: 'Guide profile created successfully', guideId: newGuideId });

    } catch (error) {
        console.error("Error in createGuide:", error);
        next(error);
    }
};
// ... rest of file ...

// --- Add other controller functions as needed (updateGuide, verifyGuide (Admin), etc.) ---