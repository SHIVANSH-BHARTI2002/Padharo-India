import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StarIcon, MapPinIcon, ShieldCheckIcon, UsersIcon, CalendarDaysIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/solid';
import man from '../assets/man.png';
import cta from '../assets/cta-background.jpg';
import { apiGetGuideById, apiCreateBooking } from '../apiService';

// Guide details are now fetched from the backend by ID.

const GuideDetailsPage = () => {
    const navigate = useNavigate();
    const { guideId } = useParams();
    const [guide, setGuide] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [bookingType, setBookingType] = useState('Individual');
    const [groupOption, setGroupOption] = useState('Create');
    const [groupSize, setGroupSize] = useState(2);
    const [startDate, setStartDate] = useState('');
    const [numHours, setNumHours] = useState(4);

    // Defensive parser to handle arrays returned as JSON strings or comma-separated strings
    const ensureArray = (val) => {
        if (Array.isArray(val)) return val;
        if (typeof val === 'string') {
            // Try JSON.parse first, fallback to comma-split
            try {
                const parsed = JSON.parse(val);
                if (Array.isArray(parsed)) return parsed;
            } catch (_) { /* ignore */ }
            return val.split(',').map(s => s.trim()).filter(Boolean);
        }
        return [];
    };

    const handleGroupSizeChange = (amount) => {
        setGroupSize(prev => Math.max(2, prev + amount));
    };

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const data = await apiGetGuideById(guideId);
                if (!data) {
                    setError('Guide not found');
                    setGuide(null);
                    return;
                }
                const mapped = {
                    id: data.id,
                    name: `${data.guideFirstName || ''} ${data.guideLastName || ''}`.trim() || 'Unknown Guide',
                    coverImage: cta,
                    profileImage: data.image_url || man,
                    location: data.location || 'Unknown',
                    rating: data.reviewsData?.averageRating || 4.7,
                    reviews: data.reviewsData?.count || 0,
                    description: data.description_long || data.description_short || '',
                    // Handle arrays robustly in case backend sends JSON strings or comma-separated values
                    languages: ensureArray(data.languages ?? data.languages_json ?? data.language_json),
                    specialties: ensureArray(data.specialties ?? data.specialties_json ?? data.specialities_json),
                    // Backend provides placesCovered (placeholder for now); map robustly to UI 'places'
                    places: ensureArray(data.placesCovered ?? data.places),
                    tourTypes: data.tourTypes || ['Individual', 'Group'],
                    pricePerHour: data.price_per_hour || 0,
                    isVerified: !!data.is_verified,
                    gallery: Array.isArray(data.gallery) ? data.gallery : [cta],
                    testimonials: (data.reviewsData?.list || []).map(r => ({ name: r.userName || 'Guest', rating: r.rating || 5, comment: r.comment || '' }))
                };
                setGuide(mapped);
            } catch (e) {
                setError(e.message || 'Failed to load guide');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [guideId]);

    const finalPrice = bookingType === 'Group' && groupOption === 'Create'
        ? (guide?.pricePerHour || 0) * groupSize * numHours
        : (guide?.pricePerHour || 0) * numHours;

    if (loading) return <div className="text-center py-20">Loading...</div>;
    if (error) return <div className="text-center py-20 text-red-600">{error}</div>;
    if (!guide) return <div className="text-center py-20">Guide not found</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header with Cover Image */}
            <header className="relative h-96">
                <img src={guide.coverImage} alt="Cover" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full p-8 flex items-end space-x-6">
                    <div className="relative">
                        <img
                            src={guide.profileImage}
                            alt={guide.name}
                            className="h-40 w-40 rounded-full object-cover border-4 border-white shadow-lg"
                        />
                        {guide.isVerified && <ShieldCheckIcon className="absolute bottom-2 right-2 h-8 w-8 text-green-500 bg-white rounded-full p-1" title="Verified Guide" />}
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-white">{guide.name}</h1>
                        <div className="flex items-center text-gray-200 mt-2">
                            <MapPinIcon className="h-5 w-5 mr-2" />
                            <span>{guide.location}</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    {/* About Section */}
                    <section className="bg-white p-8 rounded-2xl shadow-md mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">About {guide.name}</h2>
                        <p className="text-gray-600 leading-relaxed">{guide.description}</p>
                    </section>

                    {/* Details Section */}
                    <section className="bg-white p-8 rounded-2xl shadow-md mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-lg font-semibold mb-3">Languages</h3>
                                <div className="flex flex-wrap gap-2">
                                    {(guide.languages || []).map(lang => <span key={lang} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">{lang}</span>)}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-3">Specialties</h3>
                                <div className="flex flex-wrap gap-2">
                                    {(guide.specialties || []).map(spec => <span key={spec} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">{spec}</span>)}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-3">Places Covered</h3>
                                <div className="flex flex-wrap gap-2">
                                    {(guide.places || []).map(place => <span key={place} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">{place}</span>)}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-3">Tour Types</h3>
                                <div className="flex flex-wrap gap-2">
                                    {(guide.tourTypes || []).map(type => <span key={type} className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">{type}</span>)}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Gallery Section */}
                    <section className="bg-white p-8 rounded-2xl shadow-md mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Gallery</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {guide.gallery.map((img, index) => (
                                <img key={index} src={img} alt={`Gallery image ${index + 1}`} className="w-full h-40 object-cover rounded-lg shadow-sm hover:scale-105 transition-transform duration-300" />
                            ))}
                        </div>
                    </section>

                    {/* Reviews Section */}
                    <section className="bg-white p-8 rounded-2xl shadow-md">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Reviews & Ratings</h2>
                        <div className="flex items-center mb-6">
                            <StarIcon className="h-8 w-8 text-yellow-400 mr-2" />
                            <span className="text-3xl font-bold">{guide.rating}</span>
                            <span className="text-gray-500 ml-2">({guide.reviews} reviews)</span>
                        </div>
                        <div className="space-y-6">
                            {guide.testimonials.map((testimonial, index) => (
                                <div key={index} className="border-t pt-6">
                                    <div className="flex items-center mb-2">
                                        <div className="flex items-center">
                                            {[...Array(testimonial.rating)].map((_, i) => <StarIcon key={i} className="h-5 w-5 text-yellow-400" />)}
                                        </div>
                                        <p className="ml-4 font-semibold">{testimonial.name}</p>
                                    </div>
                                    <p className="text-gray-600">"{testimonial.comment}"</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Sticky Booking Column */}
                <aside className="lg:sticky top-24 h-fit">
                    <div className="bg-white p-8 rounded-2xl shadow-lg border">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Book This Guide</h2>

                        <div className="space-y-4">
                            {/* Tour Type */}
                            <div>
                                <label className="font-semibold text-gray-700">Tour Type</label>
                                <div className="flex items-center mt-2 space-x-4">
                                    <button
                                        onClick={() => setBookingType('Individual')}
                                        className={`flex-1 py-2 border rounded-lg transition flex items-center justify-center space-x-2 ${bookingType === 'Individual' ? 'border-amber-500 bg-amber-50 text-amber-600' : 'border-gray-300 hover:bg-gray-100'}`}
                                    >
                                        <UsersIcon className="h-5 w-5" />
                                        <span>Individual</span>
                                    </button>
                                    <button
                                        onClick={() => setBookingType('Group')}
                                        className={`flex-1 py-2 border rounded-lg transition flex items-center justify-center space-x-2 ${bookingType === 'Group' ? 'border-amber-500 bg-amber-50 text-amber-600' : 'border-gray-300 hover:bg-gray-100'}`}
                                    >
                                        <UsersIcon className="h-5 w-5" />
                                        <span>Group</span>
                                    </button>
                                </div>
                            </div>

                            {/* Group Options */}
                            {bookingType === 'Group' && (
                                <div className="bg-gray-50 p-4 rounded-lg border">
                                    <div className="flex justify-center space-x-2 mb-4">
                                        <button onClick={() => setGroupOption('Create')} className={`px-4 py-1 text-sm rounded-full ${groupOption === 'Create' ? 'bg-amber-500 text-white' : 'bg-white'}`}>Create Group</button>
                                        <button onClick={() => setGroupOption('Join')} className={`px-4 py-1 text-sm rounded-full ${groupOption === 'Join' ? 'bg-amber-500 text-white' : 'bg-white'}`}>Join Group</button>
                                    </div>

                                    {groupOption === 'Create' && (
                                        <div>
                                            <label className="font-semibold text-gray-700 text-sm">Number of People</label>
                                            <div className="flex items-center justify-between mt-1">
                                                <button onClick={() => handleGroupSizeChange(-1)} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"><MinusIcon className="h-4 w-4" /></button>
                                                <span className="text-lg font-bold">{groupSize}</span>
                                                <button onClick={() => handleGroupSizeChange(1)} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"><PlusIcon className="h-4 w-4" /></button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Date Picker */}
                            <div>
                                <label className="font-semibold text-gray-700">Select Date</label>
                                <div className="relative mt-2">
                                    <CalendarDaysIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 transition-all duration-300" />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Green dates are available.</p>
                            </div>
                            {/* Hours Selector */}
                            <div>
                                <label className="font-semibold text-gray-700">Number of Hours</label>
                                <div className="flex items-center space-x-3 mt-2">
                                    <button onClick={() => setNumHours(Math.max(1, numHours - 1))} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"><MinusIcon className="h-4 w-4" /></button>
                                    <span className="text-lg font-bold">{numHours}</span>
                                    <button onClick={() => setNumHours(numHours + 1)} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"><PlusIcon className="h-4 w-4" /></button>
                                </div>
                            </div>

                            {/* Rate */}
                            <div className="text-center border-t pt-4">
                                <p className="text-sm text-gray-500">
                                    {bookingType === 'Group' && groupOption === 'Create' ? 'Final Price' : 'Starting From'}
                                </p>
                                <p className="text-3xl font-bold text-gray-900">
                                    ₹{finalPrice.toLocaleString()} <span className="text-lg font-normal text-gray-600">total</span>
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                if (!startDate || numHours <= 0) {
                                    alert('Please select a date and number of hours.');
                                    return;
                                }
                                navigate('/payment', {
                                    state: {
                                        service_type: 'Guide',
                                        service_id: guide.id,
                                        start_date: startDate,
                                        num_hours: numHours,
                                        price_per_hour: guide.pricePerHour,
                                        guide_name: guide.name,
                                        ui_total_price: finalPrice,
                                    },
                                });
                            }}
                            className="w-full mt-6 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold py-3 px-6 rounded-xl transform hover:scale-105 transition-all duration-300 shadow-lg"
                        >
                            Book Now
                        </button>
                    </div>
                </aside>
            </main>
        </div>
    );
};

export default GuideDetailsPage;