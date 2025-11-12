import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StarIcon, MapPinIcon, CalendarDaysIcon, PlusIcon, MinusIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import heroImg from '../assets/hawa-mahal.jpg';
import { apiGetPackageByName } from '../apiService';

const PackageDetailsPage = () => {
    const { packageId } = useParams();
    const navigate = useNavigate();
    const [pkg, setPkg] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [numberOfPeople, setNumberOfPeople] = useState(2);
    const [startDate, setStartDate] = useState('');

    useEffect(() => {
        let cancelled = false;
        (async () => {
            setLoading(true);
            setError('');
            try {
                const data = await apiGetPackageByName(packageId);
                const mapped = {
                    id: data.id,
                    name: data.name,
                    coverImage: data.image_url || heroImg,
                    gallery: Array.isArray(data.gallery) && data.gallery.length > 0 ? data.gallery : [data.image_url || heroImg],
                    places: Array.isArray(data.places) ? data.places : [],
                    included: Array.isArray(data.included) ? data.included : [],
                    nights: data.nights || 0,
                    description: data.description || '',
                    pricePerPerson: Number(data.price) || 0,
                    rating: typeof data.reviewsData?.averageRating === 'number' ? data.reviewsData.averageRating.toFixed(1) : '—',
                    reviews: data.reviewsData?.count || 0,
                    testimonials: (data.reviewsData?.list || []).map(r => ({
                        name: `${r.userFirstName ?? ''}${r.userLastName ? ' ' + r.userLastName : ''}`.trim() || 'Guest',
                        rating: r.rating || 5,
                        comment: r.comment || ''
                    }))
                };
                if (!cancelled) setPkg(mapped);
            } catch (e) {
                if (!cancelled) setError(e.message || 'Failed to load package');
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, [packageId]);


    const handlePeopleChange = (amount) => {
        setNumberOfPeople(prev => Math.max(1, prev + amount));
    };

    const finalPrice = (pkg?.pricePerPerson || 0) * numberOfPeople;

    if (loading) return <div className="text-center py-20">Loading...</div>;
    if (error) return <div className="text-center py-20 text-red-600">{error}</div>;
    if (!pkg) return <div className="text-center py-20">Package not found</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header with Cover Image */}
            <header className="relative h-96">
                <img src={pkg.coverImage} alt="Cover" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full p-8">
                    <h1 className="text-4xl lg:text-5xl font-bold text-white">{pkg.name}</h1>
                    <div className="flex items-center text-gray-200 mt-2">
                        <MapPinIcon className="h-5 w-5 mr-2" />
                        <span>{(pkg.places || []).join(' • ')}</span>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    {/* About Section */}
                    <section className="bg-white p-8 rounded-2xl shadow-md mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">About the Package</h2>
                        <p className="text-gray-600 leading-relaxed">{pkg.description}</p>
                    </section>

                    {/* Trip Details Section (places & included) */}
                    <section className="bg-white p-8 rounded-2xl shadow-md mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Trip Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-lg font-semibold mb-3">Places Covered</h3>
                                <div className="flex flex-wrap gap-2">
                                    {(pkg.places || []).map(place => (
                                        <span key={place} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">{place}</span>
                                    ))}
                                    {(!pkg.places || pkg.places.length === 0) && (
                                        <p className="text-gray-500">Places information will be available soon.</p>
                                    )}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-3">What's Included</h3>
                                <div className="space-y-2">
                                    {(pkg.included || []).map((item, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <CheckCircleIcon className="h-5 w-5 text-green-500" />
                                            <span className="text-gray-700 font-medium">{item}</span>
                                        </div>
                                    ))}
                                    {(!pkg.included || pkg.included.length === 0) && (
                                        <p className="text-gray-500">Inclusions will be listed soon.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Gallery Section */}
                    <section className="bg-white p-8 rounded-2xl shadow-md mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Gallery</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {pkg.gallery.map((img, index) => (
                                <img key={index} src={img} alt={`Gallery image ${index + 1}`} className="w-full h-40 object-cover rounded-lg shadow-sm hover:scale-105 transition-transform duration-300" />
                            ))}
                        </div>
                    </section>

                    {/* Reviews Section */}
                    <section className="bg-white p-8 rounded-2xl shadow-md">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Reviews & Ratings</h2>
                        <div className="flex items-center mb-6">
                            <StarIcon className="h-8 w-8 text-yellow-400 mr-2" />
                            <span className="text-3xl font-bold">{pkg.rating}</span>
                            <span className="text-gray-500 ml-2">({pkg.reviews} reviews)</span>
                        </div>
                        <div className="space-y-6">
                            {(pkg.testimonials || []).map((testimonial, index) => (
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
                            {(!pkg.testimonials || pkg.testimonials.length === 0) && (
                                <p className="text-gray-500">No reviews yet.</p>
                            )}
                        </div>
                    </section>
                </div>

                {/* Sticky Booking Column */}
                <aside className="lg:sticky top-24 h-fit">
                    <div className="bg-white p-8 rounded-2xl shadow-lg border">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Book This Package</h2>

                        <div className="space-y-6">
                            {/* Number of People */}
                            <div>
                                <label className="font-semibold text-gray-700">Number of People</label>
                                <div className="flex items-center justify-between mt-2 border rounded-lg p-2">
                                    <button onClick={() => handlePeopleChange(-1)} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"><MinusIcon className="h-4 w-4" /></button>
                                    <span className="text-lg font-bold">{numberOfPeople}</span>
                                    <button onClick={() => handlePeopleChange(1)} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"><PlusIcon className="h-4 w-4" /></button>
                                </div>
                            </div>

                            {/* Date Picker */}
                            <div>
                                <label className="font-semibold text-gray-700">Select Date</label>
                                <div className="relative mt-2">
                                    <CalendarDaysIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 transition-all duration-300"
                                    />
                                </div>
                            </div>

                            {/* Rate */}
                            <div className="text-center border-t pt-4">
                                <p className="text-sm text-gray-500">Total Price</p>
                                <p className="text-3xl font-bold text-gray-900">
                                    ₹{finalPrice.toLocaleString()}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                if (!startDate) {
                                    alert('Please select a start date.');
                                    return;
                                }
                                navigate('/payment', {
                                    state: {
                                        service_type: 'Package',
                                        service_id: pkg.id,
                                        start_date: startDate,
                                        num_guests: numberOfPeople,
                                        package_price: pkg.pricePerPerson,
                                        package_name: pkg.name,
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

export default PackageDetailsPage;