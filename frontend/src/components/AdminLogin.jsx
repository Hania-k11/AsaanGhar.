import React, { useState } from 'react';
import { Shield, Lock, Mail, Home, Sparkles, ArrowRight, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { useAuth } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState({ email: false, password: false });
  const [isLoading, setIsLoading] = useState(false);
  const { loginadmin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulated login - replace with actual implementation
    const result = await loginadmin(email, password);
    //const result = { success: true, message: 'Admin Login successful' };
    
    setIsLoading(false);
    
    if (!result.success) {
      setError(result.message);
    } else {
      setSuccess("Admin Login successful");
      setTimeout(() => {
        navigate('/admin-panel');
        console.log('Navigating to admin panel...');
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 right-10 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl animate-pulse opacity-40"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-700 opacity-40"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000 opacity-30"></div>
      </div>

      {/* Enhanced grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,.04)_2px,transparent_2px),linear-gradient(90deg,rgba(16,185,129,.04)_2px,transparent_2px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-emerald-400 rounded-full animate-ping opacity-20"></div>
        <div className="absolute top-3/4 right-1/4 w-2 h-2 bg-teal-400 rounded-full animate-ping opacity-20 delay-500"></div>
        <div className="absolute bottom-1/3 left-2/3 w-2 h-2 bg-emerald-500 rounded-full animate-ping opacity-20 delay-1000"></div>
      </div>

      <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-12 w-full max-w-lg border-2 border-emerald-100/50 hover:border-emerald-200 hover:shadow-emerald-200/30 transition-all duration-700 group">
        {/* Premium glow effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-700"></div>
        
        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-emerald-400 rounded-tl-3xl opacity-20"></div>
        <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-emerald-400 rounded-br-3xl opacity-20"></div>
        
        <div className="relative text-center mb-12">
          <div className="relative inline-block mb-8">
            {/* Multiple animated rings */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 rounded-full blur-2xl opacity-50 animate-pulse"></div>
            <div className="absolute -inset-4 border-4 border-emerald-200/40 rounded-full animate-spin" style={{ animationDuration: '8s' }}></div>
            <div className="absolute -inset-3 border-2 border-emerald-300/60 rounded-full animate-pulse"></div>
            
            <div className="relative bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 rounded-full w-24 h-24 flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/40 group-hover:shadow-emerald-500/60 transition-shadow duration-500">
              <Home className="w-12 h-12 text-white group-hover:scale-110 transition-transform duration-500" />
            </div>
            
            {/* Enhanced sparkle decorations */}
            <div className="absolute -top-3 -right-3 animate-bounce">
              <Sparkles className="w-7 h-7 text-yellow-400 drop-shadow-lg" />
            </div>
            <div className="absolute -bottom-2 -left-2 animate-bounce delay-300">
              <Sparkles className="w-5 h-5 text-emerald-400 drop-shadow-lg" />
            </div>
            <div className="absolute top-0 left-0 animate-ping">
              <div className="w-3 h-3 bg-teal-400 rounded-full opacity-75"></div>
            </div>
          </div>
          
          <h1 className="text-4xl font-black bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 bg-clip-text text-transparent mb-3 tracking-tight">
            Asaan Ghar
          </h1>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-emerald-600 animate-pulse" />
            <p className="text-gray-700 font-bold text-lg">Admin Portal</p>
            <Shield className="w-5 h-5 text-emerald-600 animate-pulse" />
          </div>
          <p className="text-gray-500 text-sm">Secured & Protected Access</p>
        </div>

        <div className="space-y-7">
          <div className="space-y-3">
            <label className="block text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
              <div className="p-1.5 bg-emerald-100 rounded-lg">
                <Mail className="w-4 h-4 text-emerald-600" />
              </div>
              Email Address
            </label>
            <div className="relative group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setIsFocused({ ...isFocused, email: true })}
                onBlur={() => setIsFocused({ ...isFocused, email: false })}
                className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 text-gray-800 placeholder-gray-400 font-medium shadow-sm hover:border-emerald-300 hover:shadow-md"
                placeholder="admin@asaanghar.com"
                required
              />
              {isFocused.email && (
                <>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 blur-md -z-10 animate-pulse"></div>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
              <div className="p-1.5 bg-emerald-100 rounded-lg">
                <Lock className="w-4 h-4 text-emerald-600" />
              </div>
              Password
            </label>
            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setIsFocused({ ...isFocused, password: true })}
                onBlur={() => setIsFocused({ ...isFocused, password: false })}
                className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 text-gray-800 placeholder-gray-400 font-medium shadow-sm hover:border-emerald-300 hover:shadow-md pr-12"
                placeholder="Enter your secure password"
                required
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors duration-200"
                type="button"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              {isFocused.password && (
                <>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 blur-md -z-10 animate-pulse"></div>
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 -translate-x-8">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  </div>
                </>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-300 text-red-700 px-5 py-4 rounded-2xl text-sm font-bold flex items-center gap-3 animate-pulse shadow-lg shadow-red-200/50">
              <div className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
              {error}
            </div>
          )}

          {success && (
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-300 text-emerald-700 px-5 py-4 rounded-2xl text-sm font-bold flex items-center gap-3 animate-pulse shadow-lg shadow-emerald-200/50">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              {success}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="relative w-full group overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-70 group-hover:opacity-100 animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 text-white py-5 px-6 rounded-2xl font-black text-lg hover:shadow-2xl hover:shadow-emerald-500/40 transition-all duration-500 flex items-center justify-center gap-3 group-hover:scale-[1.02] active:scale-[0.98] overflow-hidden">
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              
              {isLoading ? (
                <>
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <Shield className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                  <span>Access Admin Portal</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                </>
              )}
            </div>
          </button>
        </div>

        <div className="mt-10 text-center space-y-3">
          <div className="flex items-center justify-center gap-3">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent"></div>
            <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50"></div>
              <span>SECURED CONNECTION</span>
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50"></div>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;