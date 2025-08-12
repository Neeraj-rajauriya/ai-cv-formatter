"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
console.log("Api url is",process.env.NEXT_PUBLIC_API_URL);
export default function Home() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false); // Default false for light mode

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const api_url=process.env.NEXT_PUBLIC_API_URL
  console.log("api url is",api_url);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      console.log("Try block");
      const url = isLogin
        ? `${process.env.NEXT_PUBLIC_API_URL}/users/login`
        : `${process.env.NEXT_PUBLIC_API_URL}/users/register`;

      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : formData;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      localStorage.setItem("token", data.token);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${
      darkMode 
        ? "dark bg-gray-900" 
        : "bg-gradient-to-br from-amber-50 to-rose-50"
    }`}>
      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className="fixed top-4 right-4 z-50 p-2 rounded-full bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
        aria-label="Toggle dark mode"
      >
        {darkMode ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-amber-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        )}
      </button>

      {/* Header */}
      <header className={`py-4 shadow-sm ${
        darkMode ? "bg-gray-800 border-b border-gray-700" : "bg-white"
      }`}>
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <Image
              src="/title.png"
              alt="Exclusive Household Staff"
              width={180}
              height={60}
              className="h-12 w-auto"
              priority
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center"
          >
            <Image
              src="/title_2.png"
              alt="Exclusive Household Staff"
              width={180}
              height={60}
              className="h-12 w-auto"
              priority
            />
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className={`rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl ${
            darkMode
              ? "bg-gray-800 border border-gray-700"
              : "bg-white border border-gray-100"
          }`}>
            {/* Tabs */}
            <div className={`flex border-b ${
              darkMode ? "border-gray-700" : "border-gray-200"
            }`}>
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-4 px-6 font-medium text-center transition-all duration-300 ${
                  isLogin
                    ? darkMode
                      ? "bg-gray-700 text-white"
                      : "bg-gray-100 text-gray-900"
                    : darkMode
                    ? "text-gray-300 hover:bg-gray-700"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-4 px-6 font-medium text-center transition-all duration-300 ${
                  !isLogin
                    ? darkMode
                      ? "bg-gray-700 text-white"
                      : "bg-gray-100 text-gray-900"
                    : darkMode
                    ? "text-gray-300 hover:bg-gray-700"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                Register
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`overflow-hidden rounded-lg ${
                      darkMode
                        ? "bg-red-900/20 border-l-4 border-red-500"
                        : "bg-red-50 border-l-4 border-red-500"
                    }`}
                  >
                    <p className={`p-4 ${
                      darkMode ? "text-red-300" : "text-red-700"
                    }`}>
                      {error}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <label className={`block text-sm font-medium mb-1 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg focus:ring-2 outline-none transition-all duration-200 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500"
                        : "border-gray-200 focus:ring-rose-300 focus:border-rose-300"
                    }`}
                    required
                  />
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label className={`block text-sm font-medium mb-1 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg focus:ring-2 outline-none transition-all duration-200 ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500"
                      : "border-gray-200 focus:ring-rose-300 focus:border-rose-300"
                  }`}
                  required
                />
              </motion.div>

              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className={`block text-sm font-medium mb-1 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg focus:ring-2 outline-none transition-all duration-200 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500"
                        : "border-gray-200 focus:ring-rose-300 focus:border-rose-300"
                    }`}
                    required={!isLogin}
                  />
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className={`block text-sm font-medium mb-1 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}>
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg focus:ring-2 outline-none transition-all duration-200 ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500"
                      : "border-gray-200 focus:ring-rose-300 focus:border-rose-300"
                  }`}
                  required
                  minLength="6"
                />
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70 ${
                  darkMode
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gradient-to-r from-rose-500 to-amber-500 text-white"
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : isLogin ? (
                  "Login"
                ) : (
                  "Register"
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className={`py-4 ${
        darkMode
          ? "bg-gray-800 border-t border-gray-700"
          : "bg-white border-t"
      }`}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className={`text-sm ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}>
            &copy; {new Date().getFullYear()} Exclusive Household Staff. All
            rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
// 'use client';
// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { motion } from 'framer-motion';
// import Image from 'next/image';

// export default function Home() {
//   const router = useRouter();
//   const [isLogin, setIsLogin] = useState(true);
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     phone: ''
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };
//   const api_url = process.env.NEXT_PUBLIC_API_URL;
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       const url = isLogin 
//         ? `${api_url}/users/login` 
//         : `${api_url}/users/register`;
      
//       const payload = isLogin 
//         ? { email: formData.email, password: formData.password }
//         : formData;

//       const response = await fetch(url, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(payload),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || 'Something went wrong');
//       }

//       localStorage.setItem('token', data.token);
//       router.push('/dashboard');
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-gradient-to-br from-amber-50 to-rose-50">
//       {/* Minimal Header */}
//       <header className="bg-white shadow-sm py-4">
//         <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
//           <motion.div 
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//             className="flex items-center"
//           >
//             <Image
//               src="/title.png"
//               alt="Exclusive Household Staff"
//               width={180}
//               height={60}
//               className="h-12 w-auto"
//               priority
//             />
//           </motion.div>
//           <motion.div 
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: 0.2 }}
//             className="flex items-center"
//           >
//             <Image
//               src="/title_2.png"
//               alt="Exclusive Household Staff"
//               width={180}
//               height={60}
//               className="h-12 w-auto"
//               priority
//             />
//           </motion.div>
//         </div>
//       </header>

//       {/* Animated Main Content */}
//       <main className="flex-grow flex items-center justify-center p-4">
//         <motion.div 
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.5 }}
//           className="w-full max-w-md"
//         >
//           <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100 transform transition-all hover:shadow-2xl">
//             {/* Elegant Tabs */}
//             <div className="flex border-b">
//               <button
//                 onClick={() => setIsLogin(true)}
//                 className={`flex-1 py-4 px-6 font-medium text-center transition-all duration-300 ${
//                   isLogin 
//                     ? 'bg-gradient-to-r from-rose-100 to-amber-100 text-rose-600 font-semibold' 
//                     : 'text-gray-500 hover:bg-gray-50'
//                 }`}
//               >
//                 Login
//               </button>
//               <button
//                 onClick={() => setIsLogin(false)}
//                 className={`flex-1 py-4 px-6 font-medium text-center transition-all duration-300 ${
//                   !isLogin 
//                     ? 'bg-gradient-to-r from-rose-100 to-amber-100 text-rose-600 font-semibold' 
//                     : 'text-gray-500 hover:bg-gray-50'
//                 }`}
//               >
//                 Register
//               </button>
//             </div>

//             {/* Form with Enhanced Animations */}
//             <form onSubmit={handleSubmit} className="p-8 space-y-6">
//               {error && (
//                 <motion.div 
//                   initial={{ opacity: 0, scale: 0.9 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded"
//                 >
//                   <p>{error}</p>
//                 </motion.div>
//               )}

//               {!isLogin && (
//                 <motion.div
//                   initial={{ opacity: 0, x: -10 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ delay: 0.1 }}
//                 >
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
//                   <input
//                     type="text"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-rose-300 outline-none transition-all duration-200"
//                     required
//                   />
//                 </motion.div>
//               )}

//               <motion.div
//                 initial={{ opacity: 0, x: -10 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: 0.2 }}
//               >
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-rose-300 outline-none transition-all duration-200"
//                   required
//                 />
//               </motion.div>

//               {!isLogin && (
//                 <motion.div
//                   initial={{ opacity: 0, x: -10 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ delay: 0.3 }}
//                 >
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
//                   <input
//                     type="tel"
//                     name="phone"
//                     value={formData.phone}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-rose-300 outline-none transition-all duration-200"
//                     required={!isLogin}
//                   />
//                 </motion.div>
//               )}

//               <motion.div
//                 initial={{ opacity: 0, x: -10 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: 0.4 }}
//               >
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
//                 <input
//                   type="password"
//                     name="password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-rose-300 outline-none transition-all duration-200"
//                     required
//                     minLength="6"
//                 />
//               </motion.div>

//               <motion.button
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-gradient-to-r from-rose-500 to-amber-500 text-white py-3 px-4 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70"
//               >
//                 {loading ? (
//                   <span className="flex items-center justify-center">
//                     <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                     Processing...
//                   </span>
//                 ) : isLogin ? 'Login' : 'Register'}
//               </motion.button>
//             </form>
//           </div>
//         </motion.div>
//       </main>

//       {/* Minimal Footer */}
//       <footer className="bg-white border-t py-4">
//         <div className="max-w-7xl mx-auto px-4 text-center">
//           <p className="text-gray-500 text-sm">
//             &copy; {new Date().getFullYear()} Exclusive Household Staff. All rights reserved.
//           </p>
//         </div>
//       </footer>
//     </div>
//   );
// }
