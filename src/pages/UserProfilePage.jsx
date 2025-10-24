import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
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
    const [userName, setUserName] = useState('Rajesh Kumar'); // Placeholder
    const [userEmail, setUserEmail] = useState('rajesh.kumar@example.com'); // Placeholder

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
            console.log('User logged out');
            // Add actual logout logic here
        }
    };

    // Placeholder function for cancel booking action
    const handleCancelBooking = (bookingId) => {
        // Add confirmation logic here
        if (window.confirm(`Are you sure you want to cancel booking ${bookingId}?`)) {
            console.log(`Cancelling booking ${bookingId}`);
            // Add actual API call to cancel the booking here
            alert(`Booking ${bookingId} cancelled (simulated).`);
        }
    };


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
                                    src={defaultAvatar}
                                    alt="Profile"
                                />
                                <button className="absolute bottom-2 right-2 bg-white/80 backdrop-blur-sm text-gray-800 p-2 rounded-full hover:bg-white transition shadow-md">
                                    <PencilIcon className="h-5 w-5" />
                                    <span className="sr-only">Change profile picture</span>
                                </button>
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
                                        className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-300 ${
                                            activeSection === item.section
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
                                    <p>Form to edit user details (Name, Email, Password) would go here.</p>
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
                                    
                                    {/* Example Current Booking */}
                                    <div className="mb-8 p-4 border rounded-lg bg-blue-50 border-blue-200">
                                         <h3 className="text-lg font-semibold text-blue-800 mb-2">Current Bookings</h3>
                                        <div className="border-t border-blue-200 pt-4 mt-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                            <div>
                                                <p className="font-semibold">Cab Booking - Toyota Innova</p>
                                                <p className="text-sm text-gray-600">Date: 2025-10-26 | Time: 10:00 AM</p>
                                                <p className="text-sm text-gray-600">Booking ID: #C1A2B3</p>
                                                <p className="text-sm text-green-600 font-medium">Status: Confirmed</p>
                                            </div>
                                            <button 
                                                onClick={() => handleCancelBooking('#C1A2B3')}
                                                className="flex items-center gap-1 px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-md hover:bg-red-600 transition duration-200"
                                            >
                                                <XCircleIcon className="h-4 w-4"/>
                                                Cancel Booking
                                            </button>
                                        </div>
                                    </div>

                                    {/* Example Past Booking */}
                                     <div className="mb-4">
                                         <h3 className="text-lg font-semibold text-gray-700 mb-2">Past Bookings</h3>
                                        <div className="border-t pt-4 mt-2">
                                            <p className="font-semibold">Hotel Stay - Taj Palace, Mumbai</p>
                                            <p className="text-sm text-gray-600">Dates: 2025-09-10 to 2025-09-12</p>
                                            <p className="text-sm text-gray-500">Status: Completed</p>
                                        </div>
                                        {/* Add more past bookings */}
                                     </div>
                                </div>
                            )}
                             {activeSection === 'reviews' && (
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">My Reviews</h2>
                                    <p>A list of reviews submitted by the user would go here.</p>
                                     {/* Example Review Item */}
                                     <div className="border-t pt-4 mt-4">
                                        <p className="font-semibold">Review for Golden Triangle Tour</p>
                                        <p className="text-sm text-gray-600">Rating: ★★★★★</p>
                                        <p className="text-sm text-gray-600">"Amazing experience, highly recommended!"</p>
                                    </div>
                                </div>
                            )}
                             {activeSection === 'payments' && (
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment History</h2>
                                    <p>A list of past transactions would go here.</p>
                                     {/* Example Payment Item */}
                                     <div className="border-t pt-4 mt-4 flex justify-between">
                                        <div>
                                            <p className="font-semibold">Booking ID: #12345</p>
                                            <p className="text-sm text-gray-600">Date: 2025-10-15</p>
                                        </div>
                                        <p className="font-semibold">₹ 25,000</p>
                                    </div>
                                </div>
                            )}
                             {activeSection === 'queries' && (
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">My Queries</h2>
                                    <p>A list of support queries or messages would go here.</p>
                                    {/* Example Query Item */}
                                     <div className="border-t pt-4 mt-4">
                                        <p className="font-semibold">Query regarding Cab Booking #67890</p>
                                        <p className="text-sm text-gray-600">Status: Resolved</p>
                                        <button className="text-sm text-amber-600 hover:underline mt-1">View Details</button>
                                    </div>
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