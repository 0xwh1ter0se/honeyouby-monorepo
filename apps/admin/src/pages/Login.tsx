import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Mail, Lock, Hexagon, UserCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../services/api';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useState('admin@honeyouby.com');
    const [password, setPassword] = useState('adminho12');
    const [role, setRole] = useState<'owner' | 'staff'>('owner');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Use real login - email and password
            await loginUser(username, password);
            // Verify session/role via profile fetch (optional but good practice)
            await login(username, role); // Update local context
            navigate('/');
        } catch (error) {
            console.error("Login failed", error);
            alert("Login failed. Please check your credentials.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FFFBF0] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-gold/10 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 -right-24 w-64 h-64 bg-yellow-200/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-orange-100/30 rounded-full blur-3xl"></div>

                {/* Floating Hexagons */}
                <Hexagon className="absolute top-20 left-[20%] text-gold/20 animate-float" size={40} strokeWidth={1} />
                <Hexagon className="absolute bottom-32 right-[15%] text-gold/20 animate-float-delayed" size={60} strokeWidth={1} />
                <Hexagon className="absolute top-1/2 left-[10%] text-gold/10" size={24} strokeWidth={1} />
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gold/10 w-full max-w-[1000px] min-h-[600px] flex overflow-hidden relative z-10 animate-fade-in">
                {/* Left Side - Visuals */}
                <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-gold to-orange-400 relative flex-col justify-between p-12 text-white overflow-hidden">
                    {/* Pattern Overlay */}
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 2px, transparent 2.5px)', backgroundSize: '30px 30px' }}></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-8">
                            {/* <div className="w-24 h-24 bg-white/20 rounded-xl backdrop-blur-sm flex items-center justify-center shadow-lg overflow-hidden">
                                <img src="/images/logo-ho-large.png" alt="HoneyOuby Logo" className="w-full h-full object-contain" />
                            </div> */}
                            <span className="font-bold text-lg tracking-wide opacity-90">HONEYOUBY ADMIN</span>
                        </div>
                        <h1 className="text-5xl font-extrabold leading-tight mb-6">
                            Manage your <br />
                            <span className="text-white/90">Sweet Empire</span>
                        </h1>
                        <p className="text-white/80 text-lg leading-relaxed max-w-sm">
                            Access your dashboard to track sales, manage inventory, and sweeten your business growth.
                        </p>
                    </div>

                    {/* Decorative Circles */}
                    <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full lg:w-1/2 p-12 flex flex-col justify-center relative">
                    <div className="lg:hidden absolute top-6 left-6 flex items-center gap-2">
                        {/* <div className="w-14 h-14 bg-gold rounded-xl flex items-center justify-center text-white shadow-md overflow-hidden">
                            <img src="/images/logo-ho-large.png" alt="Logo" className="w-full h-full object-contain" />
                        </div> */}
                        <span className="font-bold text-brown-dark">HoneyOuby</span>
                    </div>

                    <div className="max-w-sm mx-auto w-full">
                        <h2 className="text-3xl font-extrabold text-brown-dark mb-2">Welcome Back! 👋</h2>
                        <p className="text-gray-400 mb-8">Select your role to sign in.</p>

                        <form onSubmit={handleLogin} className="space-y-6">

                            {/* Role Selector */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div
                                    onClick={() => setRole('owner')}
                                    className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center gap-2 transition-all ${role === 'owner' ? 'border-gold bg-gold/5 text-brown-dark' : 'border-gray-100 text-gray-400 hover:border-gold/30'}`}
                                >
                                    <UserCircle2 size={32} className={role === 'owner' ? 'text-gold' : 'text-gray-300'} />
                                    <span className="font-bold text-sm">Owner/Admin</span>
                                </div>
                                <div
                                    onClick={() => setRole('staff')}
                                    className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center gap-2 transition-all ${role === 'staff' ? 'border-gold bg-gold/5 text-brown-dark' : 'border-gray-100 text-gray-400 hover:border-gold/30'}`}
                                >
                                    <UserCircle2 size={32} className={role === 'staff' ? 'text-gold' : 'text-gray-300'} />
                                    <span className="font-bold text-sm">Staff</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-brown-dark uppercase tracking-wider ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="email"
                                        placeholder="user@honeyouby.com"
                                        className="w-full bg-gray-50 border border-gray-100 text-brown-dark font-medium rounded-xl py-4 pl-12 pr-4 outline-none focus:bg-white focus:border-gold focus:ring-4 focus:ring-gold/10 transition-all placeholder:text-gray-300"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-brown-dark uppercase tracking-wider ml-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full bg-gray-50 border border-gray-100 text-brown-dark font-bold rounded-xl py-4 pl-12 pr-4 outline-none focus:bg-white focus:border-gold focus:ring-4 focus:ring-gold/10 transition-all placeholder:text-gray-300"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gold hover:bg-gold-dark text-white font-bold rounded-xl py-4 flex items-center justify-center gap-2 shadow-lg shadow-gold/30 hover:shadow-xl hover:shadow-gold/40 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                ) : (
                                    <>
                                        <span>Sign In as {role === 'owner' ? 'Owner' : 'Staff'}</span>
                                        <ArrowRight size={20} />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
