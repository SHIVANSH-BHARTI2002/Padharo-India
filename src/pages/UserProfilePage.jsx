import React, { useEffect, useMemo, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiGetUserBookings, apiCancelBooking, apiGetUserReviews, apiGetUserQueries, apiCreateReview, apiUploadUserAvatar } from '../apiService';
import {
    UserIcon,
    BriefcaseIcon,
    StarIcon,
    CreditCardIcon,
    QuestionMarkCircleIcon,
    ArrowLeftOnRectangleIcon,
    PencilIcon,
    CameraIcon,
    XCircleIcon // Import icon for cancel button
} from '@heroicons/react/24/outline';

// Placeholder images - replace with user-specific data
import defaultBanner from '../assets/cta-background.jpg'; // Ensure this path is correct
import defaultAvatar from '../assets/man.png'; // Ensure this path is correct

const UserProfilePage = () => {
    const [activeSection, setActiveSection] = useState('profile');
    const { user, logout, updateUser } = useAuth();
    const userName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Guest' : 'Guest';
    const userEmail = user?.email || '';

    // Data state per section
    const [bookings, setBookings] = useState([]);
    const [bookingsLoading, setBookingsLoading] = useState(false);
    const [bookingsError, setBookingsError] = useState('');

    // Inline review forms per booking: { [bookingId]: { open, rating, comment, submitting, error } }
    const [reviewForms, setReviewForms] = useState({});

    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const [reviewsError, setReviewsError] = useState('');

    const [queries, setQueries] = useState([]);
    const [queriesLoading, setQueriesLoading] = useState(false);
    const [queriesError, setQueriesError] = useState('');

    const sidebarNavItems = [
        { name: 'Profile Settings', icon: UserIcon, section: 'profile' },
        { name: 'Booking History', icon: BriefcaseIcon, section: 'bookings' },
        { name: 'My Reviews', icon: StarIcon, section: 'reviews' },
        { name: 'Payment History', icon: CreditCardIcon, section: 'payments' },
        { name: 'My Queries', icon: QuestionMarkCircleIcon, section: 'queries' },
        { name: 'Logout', icon: ArrowLeftOnRectangleIcon, section: 'logout' },
    ];

    const handleSectionClick = (section) => {
        setActiveSection(section);
        // Handle logout click
        if (section === 'logout') {
            logout();
        }
    };

    // Cancel booking via API
    const handleCancelBooking = async (bookingId) => {
        if (!bookingId) return;
        if (!window.confirm(`Are you sure you want to cancel booking ${bookingId}?`)) return;
        try {
            await apiCancelBooking(bookingId);
            // Refresh bookings after cancellation
            await fetchBookings();
        } catch (e) {
            alert(e?.message || 'Failed to cancel booking.');
        }
    };

    const toggleReviewForm = (bookingId, open = undefined) => {
        setReviewForms(prev => {
            const current = prev[bookingId] || { open: false, rating: 5, comment: '' };
            return {
                ...prev,
                [bookingId]: { ...current, open: open ?? !current.open, error: '' }
            };
        });
    };

    const updateReviewDraft = (bookingId, patch) => {
        setReviewForms(prev => {
            const current = prev[bookingId] || { open: true, rating: 5, comment: '' };
            return { ...prev, [bookingId]: { ...current, ...patch } };
        });
    };

    const submitReview = async (booking) => {
        if (!booking?.id) return;
        const draft = reviewForms[booking.id] || { rating: 5, comment: '' };
        const ratingNum = Number(draft.rating || 0);
        if (!(ratingNum >= 1 && ratingNum <= 5)) {
            updateReviewDraft(booking.id, { error: 'Please select a rating between 1 and 5.' });
            return;
        }
        try {
            updateReviewDraft(booking.id, { submitting: true, error: '' });
            await apiCreateReview({
                service_type: booking.service_type,
                service_id: booking.service_id,
                booking_id: booking.id,
                rating: ratingNum,
                comment: String(draft.comment || '').trim()
            });
            // Refresh "My Reviews" list to reflect the new review
            await fetchReviews();
            // Close form and reset
            setReviewForms(prev => ({
                ...prev,
                [booking.id]: { open: false, rating: 5, comment: '', submitting: false, error: '' }
            }));
            alert('Review submitted successfully!');
        } catch (e) {
            updateReviewDraft(booking.id, { submitting: false, error: e?.message || 'Failed to submit review.' });
        }
    };

    const fetchBookings = async () => {
        if (!user) return;
        setBookingsLoading(true);
        setBookingsError('');
        try {
            const data = await apiGetUserBookings();
            setBookings(Array.isArray(data) ? data : []);
        } catch (e) {
            setBookingsError(e?.message || 'Failed to load bookings');
        } finally {
            setBookingsLoading(false);
        }
    };

    const fetchReviews = async () => {
        if (!user) return;
        setReviewsLoading(true);
        setReviewsError('');
        try {
            const data = await apiGetUserReviews();
            setReviews(Array.isArray(data) ? data : []);
        } catch (e) {
            setReviewsError(e?.message || 'Failed to load reviews');
        } finally {
            setReviewsLoading(false);
        }
    };

    const fetchQueries = async () => {
        if (!user) return;
        setQueriesLoading(true);
        setQueriesError('');
        try {
            const data = await apiGetUserQueries();
            setQueries(Array.isArray(data) ? data : []);
        } catch (e) {
            setQueriesError(e?.message || 'Failed to load queries');
        } finally {
            setQueriesLoading(false);
        }
    };

    // Lazy load per section on first visit
    useEffect(() => {
        if (!user) return; // require auth
        if (activeSection === 'bookings' && bookings.length === 0 && !bookingsLoading) {
            fetchBookings();
        } else if (activeSection === 'reviews' && reviews.length === 0 && !reviewsLoading) {
            fetchReviews();
        } else if (activeSection === 'queries' && queries.length === 0 && !queriesLoading) {
            fetchQueries();
        }
    }, [activeSection, user]);

    // Payment history derived from bookings
    const payments = useMemo(() => {
        return (bookings || []).map(b => ({
            id: b.id,
            amount: Number(b.total_price || 0),
            date: b.booking_date || b.start_date,
            serviceType: b.service_type,
        }));
    }, [bookings]);


    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header with Banner and Profile Picture */}
            <header className="relative mb-16 md:mb-20"> {/* Added margin-bottom */}
                {/* Banner Image */}
                <div
                    className="h-64 md:h-80 bg-cover bg-center relative"
                    style={{ backgroundImage: `url(${defaultBanner})` }}
                >
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>

                    {/* Profile Info positioned over the banner */}
                    <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-end pb-6">
                            {/* Profile Picture */}
                            <div className="relative -mb-10 md:-mb-16"> {/* Adjust negative margin */}
                                <img
                                    className="h-32 w-32 md:h-40 md:w-40 rounded-full object-cover border-4 border-white shadow-lg"
                                    src={user?.profileImageUrl || defaultAvatar}
                                    alt="Profile"
                                />
                                <label htmlFor="avatar-input" className="cursor-pointer absolute bottom-2 right-2 bg-white/80 backdrop-blur-sm text-gray-800 p-2 rounded-full hover:bg-white transition shadow-md">
                                    <PencilIcon className="h-5 w-5" />
                                    <span className="sr-only">Change profile picture</span>
                                </label>
                                <input
                                    id="avatar-input"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        try {
                                            const res = await apiUploadUserAvatar(file);
                                            if (res && res.user) {
                                                updateUser(res.user);
                                            }
                                        } catch (err) {
                                            alert(err?.message || 'Failed to upload profile picture.');
                                        } finally {
                                            e.target.value = '';
                                        }
                                    }}
                                />
                            </div>
                            {/* User Name and Email */}
                            <div className="ml-6 mb-1 md:mb-2"> {/* Adjust bottom margin */}
                                <h1 className="text-2xl md:text-3xl font-bold text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.5)]">{userName}</h1>
                                <p className="text-gray-200 [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]">{userEmail}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content with Sidebar */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-16 md:-mt-20"> {/* Adjusted negative top margin */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start"> {/* Use items-start */}

                    {/* Sidebar */}
                    <aside className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24"> {/* Adjust top value if navbar height changes */}
                            <nav className="space-y-2">
                                {sidebarNavItems.map((item) => (
                                    <button
                                        key={item.name}
                                        onClick={() => handleSectionClick(item.section)}
                                        className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-300 ${activeSection === item.section
                                            ? 'bg-amber-500 text-white shadow-lg'
                                            : 'text-gray-700 hover:bg-gray-100 hover:text-amber-600'
                                            }`}
                                    >
                                        <item.icon className="h-5 w-5 mr-3" />
                                        <span className="font-medium">{item.name}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* Content Area */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-2xl shadow-md min-h-[400px] p-8">
                            {/* Render content based on activeSection */}
                            {activeSection === 'profile' && (
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h2>
                                    {!user && (
                                        <p className="text-sm text-red-600 mb-4">You are not logged in. Please log in to view your profile.</p>
                                    )}

                                    {/* Account Details */}
                                    {user && (
                                        <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="p-4 border rounded-lg bg-gray-50">
                                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Basic Info</h3>
                                                <div className="space-y-1 text-sm text-gray-700">
                                                    <p><span className="font-medium">First Name:</span> {user.firstName || '-'}</p>
                                                    <p><span className="font-medium">Last Name:</span> {user.lastName || '-'}</p>
                                                    <p><span className="font-medium">Email:</span> {user.email || '-'}</p>
                                                    <p><span className="font-medium">Mobile:</span> {user.mobile || '-'}</p>
                                                </div>
                                            </div>
                                            <div className="p-4 border rounded-lg bg-gray-50">
                                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Account Type</h3>
                                                <div className="space-y-1 text-sm text-gray-700">
                                                    <p><span className="font-medium">User Type:</span> {user.userType || 'User'}</p>
                                                    {user.userType === 'Business' && (
                                                        <p><span className="font-medium">Business Type:</span> {user.businessType || '-'}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {/* Example Form Structure */}
                                    <form className="space-y-4 mt-4">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                                            <input type="text" id="name" defaultValue={userName} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm" />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                            <input type="email" id="email" defaultValue={userEmail} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm" />
                                        </div>
                                        <button type="submit" className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600">Save Changes</button>
                                    </form>
                                </div>
                            )}
                            {activeSection === 'bookings' && (
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Booking History</h2>
                                    {!user && (
                                        <p className="text-sm text-red-600 mb-4">You are not logged in. Please log in to view bookings.</p>
                                    )}
                                    {bookingsLoading && <p className="text-gray-600">Loading your bookings...</p>}
                                    {bookingsError && <p className="text-red-600">{bookingsError}</p>}

                                    {(bookings || []).length === 0 && !bookingsLoading && !bookingsError && (
                                        <p className="text-gray-600">No bookings yet.</p>
                                    )}

                                    {(bookings || []).map((b) => {
                                        const format = (d) => d ? new Date(d).toLocaleString() : '-';
                                        const title = (() => {
                                            switch (b.service_type) {
                                                case 'Guide':
                                                    return `Guide - ${[b.guide_firstName, b.guide_lastName].filter(Boolean).join(' ') || 'Unknown'}`;
                                                case 'Cab':
                                                    return `Cab - ${b.cab_model || 'Unknown'}${b.cab_plate_number ? ` (${b.cab_plate_number})` : ''}`;
                                                case 'Hotel':
                                                    return `Hotel - ${b.hotel_name || 'Unknown'}${b.room_type ? ` (${b.room_type})` : ''}`;
                                                case 'Package':
                                                    return `Package - ${b.package_name || 'Unknown'}`;
                                                default:
                                                    return `${b.service_type} Booking`;
                                            }
                                        })();
                                        const showCancel = ['Confirmed', 'Pending'].includes(b.status);
                                        const canReview = ['Confirmed', 'Completed'].includes(b.status);
                                        const rf = reviewForms[b.id] || { open: false, rating: 5, comment: '', submitting: false, error: '' };
                                        return (
                                            <div key={b.id} className="mb-6 p-4 border rounded-lg bg-gray-50">
                                                <div className="flex flex-col sm:flex-row justify-between gap-4">
                                                    <div>
                                                        <p className="font-semibold">{title}</p>
                                                        <p className="text-sm text-gray-600">Start: {format(b.start_date)}{b.end_date ? ` | End: ${format(b.end_date)}` : ''}</p>
                                                        {b.num_hours ? (<p className="text-sm text-gray-600">Hours: {b.num_hours}</p>) : null}
                                                        <p className="text-sm text-gray-600">Booking ID: #{b.id}</p>
                                                        <p className={`text-sm font-medium ${b.status === 'Cancelled' ? 'text-red-600' : 'text-green-600'}`}>Status: {b.status}</p>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <p className="font-semibold">₹ {Number(b.total_price || 0).toFixed(2)}</p>
                                                        {showCancel && (
                                                            <button
                                                                onClick={() => handleCancelBooking(b.id)}
                                                                className="flex items-center gap-1 px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-md hover:bg-red-600 transition duration-200"
                                                            >
                                                                <XCircleIcon className="h-4 w-4" />
                                                                Cancel
                                                            </button>
                                                        )}
                                                        {canReview && (
                                                            <button
                                                                onClick={() => toggleReviewForm(b.id)}
                                                                className="flex items-center gap-1 px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-md hover:bg-amber-600 transition duration-200"
                                                            >
                                                                <PencilIcon className="h-4 w-4" />
                                                                {rf.open ? 'Close Review' : 'Write Review'}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                                {rf.open && (
                                                    <div className="mt-4 border-t pt-4 space-y-3">
                                                        <div className="flex items-center gap-3">
                                                            <label className="text-sm font-medium text-gray-700">Rating</label>
                                                            <select
                                                                className="border rounded-md px-2 py-1 text-sm"
                                                                value={rf.rating}
                                                                onChange={(e) => updateReviewDraft(b.id, { rating: e.target.value })}
                                                            >
                                                                {[1,2,3,4,5].map(n => (
                                                                    <option key={n} value={n}>{n} ★</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700">Comment</label>
                                                            <textarea
                                                                className="mt-1 w-full border rounded-md px-3 py-2 text-sm focus:border-amber-500 focus:ring-amber-500"
                                                                rows={3}
                                                                placeholder="Share your experience..."
                                                                value={rf.comment}
                                                                onChange={(e) => updateReviewDraft(b.id, { comment: e.target.value })}
                                                            />
                                                        </div>
                                                        {rf.error && <p className="text-sm text-red-600">{rf.error}</p>}
                                                        <div className="flex gap-3">
                                                            <button
                                                                disabled={rf.submitting}
                                                                onClick={() => submitReview(b)}
                                                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                                                            >
                                                                {rf.submitting ? 'Submitting...' : 'Submit Review'}
                                                            </button>
                                                            <button
                                                                onClick={() => toggleReviewForm(b.id, false)}
                                                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                            {activeSection === 'reviews' && (
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">My Reviews</h2>
                                    {!user && (
                                        <p className="text-sm text-red-600 mb-4">You are not logged in. Please log in to view reviews.</p>
                                    )}
                                    {reviewsLoading && <p className="text-gray-600">Loading your reviews...</p>}
                                    {reviewsError && <p className="text-red-600">{reviewsError}</p>}
                                    {(reviews || []).length === 0 && !reviewsLoading && !reviewsError && (
                                        <p className="text-gray-600">No reviews yet.</p>
                                    )}
                                    {(reviews || []).map((r) => (
                                        <div key={r.id} className="border-t pt-4 mt-4">
                                            <p className="font-semibold">{r.service_type} - {r.service_name || 'Unknown'}</p>
                                            <p className="text-sm text-gray-600">Rating: {'★'.repeat(Math.max(1, Math.min(5, Number(r.rating || 0))))}</p>
                                            {r.comment ? (<p className="text-sm text-gray-600">{r.comment}</p>) : null}
                                            <p className="text-xs text-gray-500">Reviewed on {r.review_date ? new Date(r.review_date).toLocaleDateString() : '-'}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {activeSection === 'payments' && (
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment History</h2>
                                    {!user && (
                                        <p className="text-sm text-red-600 mb-4">You are not logged in. Please log in to view payments.</p>
                                    )}
                                    {(payments || []).length === 0 && (
                                        <p className="text-gray-600">No payments yet.</p>
                                    )}
                                    {(payments || []).map((p) => (
                                        <div key={p.id} className="border-t pt-4 mt-4 flex justify-between">
                                            <div>
                                                <p className="font-semibold">Booking ID: #{p.id}</p>
                                                <p className="text-sm text-gray-600">{p.serviceType} | Date: {p.date ? new Date(p.date).toLocaleDateString() : '-'}</p>
                                            </div>
                                            <p className="font-semibold">₹ {Number(p.amount || 0).toFixed(2)}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {activeSection === 'queries' && (
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">My Queries</h2>
                                    {!user && (
                                        <p className="text-sm text-red-600 mb-4">You are not logged in. Please log in to view queries.</p>
                                    )}
                                    {queriesLoading && <p className="text-gray-600">Loading your queries...</p>}
                                    {queriesError && <p className="text-red-600">{queriesError}</p>}
                                    {(queries || []).length === 0 && !queriesLoading && !queriesError && (
                                        <p className="text-gray-600">No queries yet.</p>
                                    )}
                                    {(queries || []).map((q) => (
                                        <div key={q.id} className="border-t pt-4 mt-4">
                                            <p className="font-semibold">{q.subject}</p>
                                            <p className="text-sm text-gray-600">Status: {q.status}</p>
                                            <p className="text-xs text-gray-500">Created on {q.created_at ? new Date(q.created_at).toLocaleString() : '-'}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UserProfilePage;