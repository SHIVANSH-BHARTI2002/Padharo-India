/* === Filename: src/pages/AdminDashboard.jsx === */
import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
    UsersIcon, 
    QuestionMarkCircleIcon, 
    ArchiveBoxIcon, 
    ChatBubbleLeftRightIcon, 
    ShieldCheckIcon, 
    TrashIcon, 
    PencilIcon, 
    XMarkIcon,
    PlusIcon,
    ArrowLeftIcon,
    InboxIcon,
    MagnifyingGlassIcon,
    WrenchScrewdriverIcon,
    UserCircleIcon // New icon for profile
} from '@heroicons/react/24/outline';
import defaultBanner from '../assets/cta-background.jpg'; // Using this as the admin banner

// --- Placeholder Data (Simulating API responses) ---
const allUsersData = [
    { id: 1, firstName: 'Rajesh', lastName: 'Kumar', email: 'rajesh.kumar@example.com', role: 'User', isVerified: true, businessType: null },
    { id: 2, firstName: 'Ramesh', lastName: 'Singh', email: 'ramesh.s@driver.padharoindia.com', role: 'Business', businessType: 'Cab', isVerified: true },
    { id: 3, firstName: 'Priya', lastName: 'Sharma', email: 'priya.sharma@guide.co', role: 'Business', businessType: 'Guide', isVerified: false },
    { id: 4, firstName: 'Amit', lastName: 'Patel', email: 'amit.patel@hotel.com', role: 'Business', businessType: 'Hotel', isVerified: true },
    { id: 5, firstName: 'New', lastName: 'User', email: 'new.user@gmail.com', role: 'User', isVerified: false, businessType: null },
];

const allPackagesData = [
    { id: 1, name: 'Golden Triangle Delight', nights: 6, price: 25000, places: ['Delhi', 'Agra', 'Jaipur'], included: ['Hotels', 'Transfers'], description: '...', image_url: '...' },
    { id: 2, name: 'Kerala Backwater Escape', nights: 7, price: 35000, places: ['Cochin', 'Munnar'], included: ['Houseboat'], description: '...', image_url: '...' },
];

const allQueriesData = [
    { id: 101, subject: 'Refund Request for Booking #C1A2B3', userEmail: 'rajesh.kumar@example.com', status: 'Open', messages: [{ sender: 'User', msg: 'I had to cancel, please refund.'}] },
    { id: 102, subject: 'Problem with Hotel Profile', userEmail: 'amit.patel@hotel.com', status: 'In Progress', messages: [{ sender: 'User', msg: 'I cannot update my rooms.'}, { sender: 'Admin', msg: 'Looking into it.'}] },
    { id: 103, subject: 'Question about package', userEmail: 'test@example.com', status: 'Closed', messages: [{ sender: 'User', msg: 'Is flight included?'}, {sender: 'Admin', msg: 'No.'}] },
];

const allReviewsData = [
    { id: 501, user: 'Amit S.', rating: 5, comment: "Very professional and polite driver. Clean car." },
    { id: 502, user: 'Priya K.', rating: 1, comment: "Horrible experience, bad driver." },
    { id: 503, user: 'Rajesh', rating: 4, comment: "The hotel in Jaipur was great." },
];
// --- End Placeholder Data ---


// --- Main Admin Dashboard Component ---
const AdminDashboard = () => {
    const { user } = useAuth();
    const [activeSection, setActiveSection] = useState('users');

    const sidebarNavItems = [
        // --- NEW "My Profile" Tab ---
        { name: 'Admin Profile', icon: UserCircleIcon, section: 'profile' },
        { name: 'User Management', icon: UsersIcon, section: 'users' },
        { name: 'Support Queries', icon: QuestionMarkCircleIcon, section: 'queries' },
        { name: 'Package Management', icon: ArchiveBoxIcon, section: 'packages' },
        { name: 'Review Moderation', icon: ChatBubbleLeftRightIcon, section: 'reviews' },
    ];
    
    // In a real app, you'd have a check here:
    // if (!user || user.role !== 'Admin') {
    //     return <p className="pt-24 text-center">Access Denied.</p>;
    // }

    // Stats for the banner
    const stats = {
        totalUsers: allUsersData.length,
        openQueries: allQueriesData.filter(q => q.status === 'Open').length,
        totalPackages: allPackagesData.length
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* --- Header with Banner --- */}
            <header className="relative mb-16 md:mb-20">
                <div
                    className="h-64 md:h-80 bg-cover bg-center"
                    style={{ backgroundImage: `url(${defaultBanner})` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                </div>
                
                {/* Header Content */}
                <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between pb-6">
                        {/* Left Side: Profile */}
                        <div className="flex items-end">
                            <div className="h-32 w-32 md:h-40 md:w-40 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-sm border-4 border-white shadow-lg -mb-10 sm:-mb-12">
                                <ShieldCheckIcon className="h-20 w-20 text-white" />
                            </div>
                            <div className="ml-6 mb-1 md:mb-2">
                                <h1 className="text-2xl md:text-3xl font-bold text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.5)]">Admin Dashboard</h1>
                                <p className="text-gray-200 [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]">Welcome, {user?.firstName || 'Admin'}</p>
                            </div>
                        </div>
                        {/* Right Side: Stats */}
                        <div className="mt-4 sm:mt-0 sm:mb-2 flex gap-4">
                            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg text-center">
                                <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
                                <p className="text-xs text-gray-200">Total Users</p>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg text-center">
                                <p className="text-2xl font-bold text-white">{stats.openQueries}</p>
                                <p className="text-xs text-gray-200">Open Queries</p>
                            </div>
                             <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg text-center">
                                <p className="text-2xl font-bold text-white">{stats.totalPackages}</p>
                                <p className="text-xs text-gray-200">Packages</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* --- Main Content --- */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-16 md:-mt-20">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                
                    {/* Left Column: Navigation */}
                    <aside className="lg:col-span-1 space-y-8 sticky top-24">
                        <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-200">
                            <nav className="space-y-2">
                                {sidebarNavItems.map((item) => (
                                    <button
                                        key={item.name}
                                        onClick={() => setActiveSection(item.section)}
                                        className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-300 ${
                                            activeSection === item.section
                                                ? 'bg-amber-500 text-white shadow-md'
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

                    {/* Right Column: Management Tabs */}
                    <div className="lg:col-span-3 space-y-8">
                        {activeSection === 'profile' && <AdminProfile />}
                        {activeSection === 'users' && <UserManagement />}
                        {activeSection === 'queries' && <SupportQueries />}
                        {activeSection === 'packages' && <PackageManagement />}
                        {activeSection === 'reviews' && <ReviewManagement />}
                    </div>
                </div>
            </main>
        </div>
    );
};

// --- 1. Admin Profile Component (NEW) ---
const AdminProfile = () => {
    const { user } = useAuth();
    // API: PUT /api/user/profile
    
    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        mobile: user?.mobile || ''
    });
    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // SIMULATE: PUT /api/user/profile with formData
        alert('Admin profile updated (Simulated). In a real app, this would also update the AuthContext.');
    };

    return (
        <div className="animate-fade-in bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Admin Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">First Name</label>
                        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Last Name</label>
                        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                    <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
                <button type="submit" className="px-6 py-2 bg-amber-500 text-white font-semibold rounded-lg shadow-md hover:bg-amber-600">
                    Save Changes
                </button>
            </form>
        </div>
    );
};


// --- 2. User Management Component ---
const UserManagement = () => {
    // API: GET /api/admin/users?role=...&isVerified=...
    // API: PATCH /api/admin/users/:userId/status
    
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState(''); // '', 'User', 'Business'
    const [statusFilter, setStatusFilter] = useState(''); // '', 'true', 'false'
    const [editingUser, setEditingUser] = useState(null); // User for the modal
    
    const filteredUsers = useMemo(() => {
        return allUsersData.filter(user => {
            const matchesSearch = user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                  user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                  user.email.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesRole = !roleFilter || user.role === roleFilter;
            const matchesStatus = !statusFilter || String(user.isVerified) === statusFilter;
            return matchesSearch && matchesRole && matchesStatus;
        });
    }, [searchQuery, roleFilter, statusFilter]);

    const handleSaveUser = (userId, newStatus) => {
        // SIMULATE: PATCH /api/admin/users/:userId/status { ...newStatus }
        alert(`User ${userId} updated (Simulated): ${JSON.stringify(newStatus)}`);
        setEditingUser(null);
    };

    return (
        <div className="animate-fade-in bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6">User Management</h2>
            
            {/* Filter Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="relative md:col-span-3">
                    <input 
                        type="text" 
                        placeholder="Search by name or email..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:ring-amber-500"
                    />
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                </div>
                <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="w-full border rounded-lg shadow-sm py-2 px-3 focus:ring-amber-500">
                    <option value="">All Roles</option>
                    <option value="User">User</option>
                    <option value="Business">Business</option>
                    <option value="Admin">Admin</option>
                </select>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full border rounded-lg shadow-sm py-2 px-3 focus:ring-amber-500">
                    <option value="">All Statuses</option>
                    <option value="true">Verified</option>
                    <option value="false">Not Verified</option>
                </select>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredUsers.map(user => (
                            <tr key={user.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.role} {user.businessType && `(${user.businessType})`}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {user.isVerified ? (
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Verified</span>
                                    ) : (
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Not Verified</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button onClick={() => setEditingUser(user)} className="flex items-center gap-1 text-blue-600 hover:text-blue-900">
                                        <WrenchScrewdriverIcon className="h-4 w-4" /> Manage
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {editingUser && <UserEditModal user={editingUser} onClose={() => setEditingUser(null)} onSave={handleSaveUser} />}
        </div>
    );
};

// --- Sub-component: User Edit Modal ---
const UserEditModal = ({ user, onClose, onSave }) => {
    const [role, setRole] = useState(user.role);
    const [businessType, setBusinessType] = useState(user.businessType || '');
    const [isVerified, setIsVerified] = useState(user.isVerified);

    const handleSubmit = () => {
        onSave(user.id, {
            role,
            businessType: role === 'Business' ? businessType : null,
            isVerified
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="relative bg-white w-full max-w-lg p-6 rounded-2xl shadow-lg space-y-4">
                <h3 className="text-xl font-semibold">Manage User: {user.firstName}</h3>
                <button onClick={onClose} type="button" className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><XMarkIcon className="h-6 w-6" /></button>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Role</label>
                        <select value={role} onChange={(e) => setRole(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                            <option value="User">User</option>
                            <option value="Business">Business</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>
                    {role === 'Business' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Business Type</label>
                            <select value={businessType} onChange={(e) => setBusinessType(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                <option value="">(None)</option>
                                <option value="Cab">Cab</option>
                                <option value="Hotel">Hotel</option>
                                <option value="Guide">Guide</option>
                            </select>
                        </div>
                    )}
                    <div className="flex items-center">
                        <input id="isVerified" type="checkbox" checked={isVerified} onChange={(e) => setIsVerified(e.target.checked)} className="h-4 w-4 text-amber-600 border-gray-300 rounded" />
                        <label htmlFor="isVerified" className="ml-2 block text-sm text-gray-900">Is Verified</label>
                    </div>
                </div>

                <button onClick={handleSubmit} className="px-6 py-2 bg-amber-500 text-white font-semibold rounded-lg shadow-md hover:bg-amber-600">Save Changes</button>
            </div>
        </div>
    );
};


// --- 3. Support Queries Component ---
const SupportQueries = () => {
    const [statusFilter, setStatusFilter] = useState('Open');
    const [selectedQuery, setSelectedQuery] = useState(null);
    const [reply, setReply] = useState('');

    const filteredQueries = useMemo(() => {
        if (statusFilter === '') return allQueriesData;
        return allQueriesData.filter(q => q.status === statusFilter);
    }, [statusFilter]);
    
    const handleSelectQuery = (query) => setSelectedQuery(query);
    const handleReply = () => {
        alert(`Reply sent: "${reply}"`);
        setSelectedQuery(prev => ({...prev, status: 'In Progress', messages: [...prev.messages, { sender: 'Admin', msg: reply}]}));
        setReply('');
    };
    const handleCloseTicket = () => {
        alert(`Ticket ${selectedQuery.id} closed.`);
        setSelectedQuery(prev => ({...prev, status: 'Closed'}));
    };

    if (selectedQuery) {
        return <QueryDetail query={selectedQuery} onReply={handleReply} onCloseTicket={handleCloseTicket} setReply={setReply} reply={reply} onBack={() => setSelectedQuery(null)} />
    }

    return (
        <div className="animate-fade-in bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Support Queries</h2>
            
            <div className="flex space-x-2 mb-4">
                {['Open', 'In Progress', 'Closed', 'All'].map(status => (
                    <button 
                        key={status} 
                        onClick={() => setStatusFilter(status === 'All' ? '' : status)}
                        className={`px-4 py-2 rounded-lg font-medium text-sm ${statusFilter === status || (status === 'All' && statusFilter === '') ? 'bg-amber-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50 border'}`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            <div className="space-y-2">
                {filteredQueries.map(query => (
                    <div key={query.id} onClick={() => handleSelectQuery(query)} className="p-4 border-b hover:bg-gray-50 cursor-pointer">
                        <div className="flex justify-between">
                            <p className="font-semibold text-gray-800">{query.subject}</p>
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${query.status === 'Open' ? 'bg-red-100 text-red-800' : (query.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800')}`}>{query.status}</span>
                        </div>
                        <p className="text-sm text-gray-500">From: {query.userEmail}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- QueryDetail sub-component ---
const QueryDetail = ({ query, onReply, onCloseTicket, setReply, reply, onBack }) => (
    <div className="animate-fade-in">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"><ArrowLeftIcon className="h-4 w-4" /> Back</button>
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold mb-2">{query.subject}</h2>
            <p className="text-sm text-gray-500 mb-4">From: {query.userEmail} | Status: {query.status}</p>
            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto border-t border-b py-4">
                {query.messages.map((msg, index) => (
                    <div key={index} className={`p-4 rounded-lg ${msg.sender === 'Admin' ? 'bg-blue-50 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                        <p className="font-semibold text-sm">{msg.sender}</p>
                        <p>{msg.msg}</p>
                    </div>
                ))}
            </div>
            {query.status !== 'Closed' && (
                <div>
                    <h3 className="text-lg font-semibold mb-2">Your Reply</h3>
                    <textarea value={reply} onChange={(e) => setReply(e.target.value)} rows="4" className="w-full p-2 border rounded-md shadow-sm" placeholder="Type your response..."></textarea>
                    <div className="mt-4 flex justify-between">
                        <button onClick={onReply} disabled={!reply} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:opacity-50">Send Reply</button>
                        <button onClick={onCloseTicket} className="px-6 py-2 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700">Close Ticket</button>
                    </div>
                </div>
            )}
        </div>
    </div>
);

// --- 4. Package Management Component ---
const PackageManagement = () => {
    const [showForm, setShowForm] = useState(false);
    const [currentPackage, setCurrentPackage] = useState(null);
    const handleEdit = (pkg) => { setCurrentPackage(pkg); setShowForm(true); };
    const handleDelete = (pkgId) => { if (window.confirm('...')) { alert(`Package ${pkgId} deleted (Simulated)`); }};
    const handleSave = (formData) => {
        if (currentPackage) { alert(`Package ${currentPackage.id} updated (Simulated)`); } 
        else { alert(`New package "${formData.name}" created (Simulated)`); }
        setShowForm(false); setCurrentPackage(null);
    };

    if (showForm) {
        return <PackageForm pkg={currentPackage} onSave={handleSave} onCancel={() => { setShowForm(false); setCurrentPackage(null); }} />
    }
    return (
        <div className="animate-fade-in bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Package Management</h2>
                <button onClick={() => { setCurrentPackage(null); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600">
                    <PlusIcon className="h-5 w-5" /> Add New
                </button>
            </div>
            <div className="space-y-2">
                {allPackagesData.map(pkg => (
                    <div key={pkg.id} className="p-4 border-b flex justify-between items-center">
                        <div>
                            <p className="font-semibold">{pkg.name} ({pkg.nights} Nights)</p>
                            <p className="text-sm text-green-700 font-bold">₹{pkg.price.toLocaleString()}</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => handleEdit(pkg)} className="p-2 text-blue-500 hover:bg-blue-100 rounded-full"><PencilIcon className="h-5 w-5" /></button>
                            <button onClick={() => handleDelete(pkg.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-full"><TrashIcon className="h-5 w-5" /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- PackageForm sub-component ---
const PackageForm = ({ pkg, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: pkg?.name || '', nights: pkg?.nights || '', price: pkg?.price || '',
        description: pkg?.description || '', image_url: pkg?.image_url || '',
        places: pkg?.places?.join(', ') || '', included: pkg?.included?.join(', ') || ''
    });
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };

    return (
        <div className="animate-fade-in">
            <button onClick={onCancel} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"><ArrowLeftIcon className="h-4 w-4" /> Back</button>
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg space-y-4">
                <h2 className="text-2xl font-bold mb-4">{pkg ? 'Edit Package' : 'Create New Package'}</h2>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Package Name" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                <div className="grid grid-cols-2 gap-4">
                    <input type="number" name="nights" value={formData.nights} onChange={handleChange} placeholder="Nights" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                    <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price (₹)" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                </div>
                <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" rows="3" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
                <input type="text" name="image_url" value={formData.image_url} onChange={handleChange} placeholder="Image URL" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                <input type="text" name="places" value={formData.places} onChange={handleChange} placeholder="Places (comma-separated)" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                <input type="text" name="included" value={formData.included} onChange={handleChange} placeholder="What's Included (comma-separated)" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                <button type="submit" className="px-6 py-2 bg-amber-500 text-white font-semibold rounded-lg shadow-md hover:bg-amber-600">Save Package</button>
            </form>
        </div>
    );
};

// --- 5. Review Management Component ---
const ReviewManagement = () => {
    // API: DELETE /api/admin/reviews/:reviewId
    const [searchQuery, setSearchQuery] = useState('');
    
    const filteredReviews = useMemo(() => {
        return allReviewsData.filter(review => 
            review.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
            review.comment.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);
    
    const handleDelete = (reviewId) => {
        // SIMULATE: DELETE /api/admin/reviews/:reviewId
        if (window.confirm('Are you sure you want to delete this review?')) {
            alert(`Review ${reviewId} deleted (Simulated)`);
            // Here you would refetch or update state
        }
    };
    
    return (
        <div className="animate-fade-in bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Review Moderation</h2>
            
            <div className="relative mb-6">
                <input 
                    type="text" 
                    placeholder="Search by user or comment..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:ring-amber-500"
                />
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
            </div>

            <div className="space-y-4">
                {filteredReviews.map(review => (
                    <div key={review.id} className="p-4 border-b flex justify-between items-start">
                        <div className="pr-4">
                            <p className="font-semibold">{review.user} 
                                <span className={`ml-2 ${review.rating < 3 ? 'text-red-500' : 'text-green-500'}`}>
                                    ({review.rating} ★)
                                </span>
                            </p>
                            <p className="text-sm text-gray-600 italic">"{review.comment}"</p>
                        </div>
                        <button onClick={() => handleDelete(review.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-full flex-shrink-0">
                            <TrashIcon className="h-5 w-5" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};


export default AdminDashboard;