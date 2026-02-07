import { useState, useEffect } from 'react';
import { User, Bell, Shield, Palette, Smartphone, Globe, LogOut, Save } from 'lucide-react';
import { getProfile, updateProfile, changePassword, logoutUser } from '../services/api';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        phone: '',
        image: '',
        role: ''
    });
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // Preferences State (Persisted)
    const [preferences, setPreferences] = useState({
        language: localStorage.getItem('settings_language') || 'English',
        mobileView: localStorage.getItem('settings_mobileView') === 'true',
        darkMode: localStorage.getItem('theme') === 'dark',
        notifications: {
            orders: localStorage.getItem('notif_orders') !== 'false',
            stock: localStorage.getItem('notif_stock') !== 'false',
            reports: localStorage.getItem('notif_reports') !== 'false',
            promo: localStorage.getItem('notif_promo') !== 'false'
        }
    });

    // Password State
    const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });

    useEffect(() => {
        const loadProfile = async () => {
            setLoading(true);
            try {
                const data = await getProfile();
                setProfile({
                    name: data.name || '',
                    email: data.email || '',
                    phone: data.phone || '', // New field
                    image: data.image || '',
                    role: data.role || ''
                });
            } catch (error) {
                console.error("Failed to load profile", error);
            } finally {
                setLoading(false);
            }
        };
        loadProfile();
    }, []);

    // Handle Preferences Changes
    const updatePreference = (key: string, value: any) => {
        if (key === 'darkMode') {
            if (value) {
                document.documentElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            } else {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
            }
        } else if (key === 'language') {
            localStorage.setItem('settings_language', value);
        } else if (key === 'mobileView') {
            localStorage.setItem('settings_mobileView', String(value));
        }

        setPreferences(prev => ({ ...prev, [key]: value }));
    };

    const updateNotification = (key: string, value: boolean) => {
        localStorage.setItem(`notif_${key}`, String(value));
        setPreferences(prev => ({
            ...prev,
            notifications: { ...prev.notifications, [key]: value }
        }));
    };

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await updateProfile({
                name: profile.name,
                phone: profile.phone,
            });
            alert('Profile updated successfully!');
        } catch (error) {
            alert('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.new !== passwordData.confirm) {
            alert("New passwords do not match");
            return;
        }

        try {
            await changePassword(passwordData.current, passwordData.new);
            alert("Password updated successfully!");
            setPasswordData({ current: '', new: '', confirm: '' });
        } catch (error: any) {
            console.error(error);
            alert(error.message || "Failed to change password");
        }
    };

    const handleLogout = async () => {
        try {
            await logoutUser();
            localStorage.removeItem('isAuthenticated');
            window.location.href = '/login';
        } catch (error) {
            console.error("Logout failed", error);
            // Force redirect anyway
            localStorage.removeItem('isAuthenticated');
            window.location.href = '/login';
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 animate-slide-up">
                        <h2 className="text-xl font-bold text-brown-dark mb-6">Profile Information</h2>
                        {loading ? (
                            <div className="text-center py-10 text-gray-400">Loading profile...</div>
                        ) : (
                            <>
                                <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
                                    <div className="relative group cursor-pointer">
                                        <img
                                            src={profile.image || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=128&h=128"}
                                            alt="Profile"
                                            className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover transition-transform group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Palette className="text-white" size={20} />
                                        </div>
                                    </div>
                                    <div className="text-center md:text-left">
                                        <h3 className="text-2xl font-bold text-brown-dark">{profile.name || 'User'}</h3>
                                        <p className="text-gray-400 font-medium capitalize">{profile.role || 'Member'}</p>
                                        <p className="text-sm text-gold-dark font-bold mt-1">{profile.email}</p>
                                    </div>
                                </div>

                                <form onSubmit={handleProfileSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name</label>
                                        <input
                                            type="text"
                                            value={profile.name}
                                            onChange={e => setProfile({ ...profile, name: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-brown-dark font-bold focus:outline-none focus:border-gold focus:ring-4 focus:ring-gold/10 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
                                        <input
                                            type="email"
                                            value={profile.email}
                                            disabled
                                            className="w-full bg-gray-100 border border-gray-100 rounded-xl px-4 py-3 text-gray-500 font-bold cursor-not-allowed"
                                        />
                                        <p className="text-[10px] text-gray-400 pl-1">Contact admin to change email</p>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phone</label>
                                        <input
                                            type="tel"
                                            value={profile.phone}
                                            onChange={e => setProfile({ ...profile, phone: e.target.value.replace(/\D/g, '') })}
                                            placeholder="+62..."
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-brown-dark font-bold focus:outline-none focus:border-gold focus:ring-4 focus:ring-gold/10 transition-all"
                                        />
                                    </div>
                                    <div className="md:col-span-2 flex justify-end pt-4">
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="flex items-center gap-2 px-8 py-3 bg-gold text-white font-bold rounded-xl shadow-lg shadow-gold/30 hover:bg-gold-dark transition-all disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
                                        >
                                            <Save size={18} />
                                            {saving ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                );
            case 'security':
                return (
                    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 animate-slide-up">
                        <h2 className="text-xl font-bold text-brown-dark mb-6">Security Settings</h2>
                        <div className="bg-blue-50 text-blue-700 px-4 py-3 rounded-xl mb-6 text-sm font-medium">
                            Protect your account with a strong password. We recommend using at least 8 characters.
                        </div>
                        <form onSubmit={handlePasswordChange} className="space-y-5 max-w-lg">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Current Password</label>
                                <input
                                    type="password"
                                    value={passwordData.current}
                                    onChange={e => setPasswordData({ ...passwordData, current: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-brown-dark font-bold focus:outline-none focus:border-gold focus:ring-4 focus:ring-gold/10 transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">New Password</label>
                                <input
                                    type="password"
                                    value={passwordData.new}
                                    onChange={e => setPasswordData({ ...passwordData, new: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-brown-dark font-bold focus:outline-none focus:border-gold focus:ring-4 focus:ring-gold/10 transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={passwordData.confirm}
                                    onChange={e => setPasswordData({ ...passwordData, confirm: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-brown-dark font-bold focus:outline-none focus:border-gold focus:ring-4 focus:ring-gold/10 transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                            <div className="flex justify-end pt-4">
                                <button type="submit" className="px-8 py-3 bg-gold text-white font-bold rounded-xl shadow-lg shadow-gold/30 hover:bg-gold-dark transition-all hover:scale-[1.02] active:scale-[0.98]">
                                    Update Password
                                </button>
                            </div>
                        </form>
                    </div>
                );
            case 'notifications':
                return (
                    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 animate-slide-up">
                        <h2 className="text-xl font-bold text-brown-dark mb-6">Notification Preferences</h2>
                        <div className="space-y-4">
                            {[
                                { id: 'orders', label: 'Order Updates', desc: 'Get notified when new orders arrive' },
                                { id: 'stock', label: 'Low Stock Alerts', desc: 'Alert when product stock is running low' },
                                { id: 'reports', label: 'Daily Reports', desc: 'Receive daily sales summary at closing' },
                                { id: 'promo', label: 'Promotional Emails', desc: 'Updates about new features and tips' }
                            ].map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl transition-colors hover:bg-gray-100">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm transition-colors ${preferences.notifications[item.id as keyof typeof preferences.notifications] ? 'bg-gold text-white' : 'bg-white text-gray-400'}`}>
                                            <Bell size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-brown-dark text-sm">{item.label}</h4>
                                            <p className="text-xs text-gray-400">{item.desc}</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => updateNotification(item.id, !preferences.notifications[item.id as keyof typeof preferences.notifications])}
                                        className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${preferences.notifications[item.id as keyof typeof preferences.notifications] ? 'bg-gold' : 'bg-gray-300'}`}
                                    >
                                        <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full shadow-sm transition-transform duration-300 ${preferences.notifications[item.id as keyof typeof preferences.notifications] ? 'translate-x-6' : 'translate-x-0'}`} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'appearance':
                return (
                    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 animate-slide-up">
                        <h2 className="text-xl font-bold text-brown-dark mb-6">System Preferences</h2>
                        <div className="space-y-4">
                            {/* Language */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-brown-dark shadow-sm">
                                        <Globe size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-brown-dark text-sm">Language</h4>
                                        <p className="text-xs text-gray-400">Select interface language</p>
                                    </div>
                                </div>
                                <select
                                    value={preferences.language}
                                    onChange={(e) => updatePreference('language', e.target.value)}
                                    className="bg-white border text-sm font-bold text-brown-dark border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-gold/20"
                                >
                                    <option>English</option>
                                    <option>Bahasa Indonesia</option>
                                </select>
                            </div>

                            {/* Mobile View */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-brown-dark shadow-sm">
                                        <Smartphone size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-brown-dark text-sm">Mobile View</h4>
                                        <p className="text-xs text-gray-400">Enable POS view on mobile</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => updatePreference('mobileView', !preferences.mobileView)}
                                    className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${preferences.mobileView ? 'bg-gold' : 'bg-gray-300'}`}
                                >
                                    <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full shadow-sm transition-transform duration-300 ${preferences.mobileView ? 'translate-x-6' : 'translate-x-0'}`} />
                                </button>
                            </div>


                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1 text-xs text-gray-400 font-medium">
                        <span>Admin</span>
                        <span>›</span>
                        <span className="text-gold-dark">Settings</span>
                    </div>
                    <h1 className="text-3xl font-extrabold text-brown-dark">Settings</h1>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Sidebar Menu */}
                <div className="md:col-span-1">
                    <div className="bg-white rounded-[2rem] p-4 shadow-sm border border-gray-100 sticky top-8">
                        <nav className="space-y-1">
                            {[
                                { id: 'profile', icon: User, label: 'Profile' },
                                { id: 'notifications', icon: Bell, label: 'Notifications' },
                                { id: 'security', icon: Shield, label: 'Security' },
                                { id: 'appearance', icon: Palette, label: 'Appearance' },
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 font-bold rounded-xl transition-all duration-200 ${activeTab === item.id
                                        ? 'bg-gold/10 text-gold-dark translate-x-1 shadow-md shadow-gold/5'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-brown-dark'
                                        }`}
                                >
                                    <item.icon size={18} /> {item.label}
                                </button>
                            ))}

                            <hr className="border-gray-100 my-2" />
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 font-bold rounded-xl transition-colors"
                            >
                                <LogOut size={18} /> Log Out
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Content Area */}
                <div className="md:col-span-3 space-y-8">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default Settings;
