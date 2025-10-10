import React, { useState, useRef, useContext } from 'react'; // ADDED: useContext
import { AuthContext } from '../context/AuthContext'; // ADDED: AuthContext 

// 💡 Destructure the correct props passed from AuthModal: email, onSuccess, and onCancel
const OtpVerification = ({ email, onSuccess, onCancel }) => { 
    // ADDED: Hook into the context to get the verification function
    const { verifyOtp } = useContext(AuthContext); 
    
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [isVerifying, setIsVerifying] = useState(false); // To handle loading state
    const inputRefs = useRef([]);

    // --- Input Handlers (No change needed) ---
    const handleChange = (e, index) => {
        const value = e.target.value;
        if (isNaN(value)) return; 

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Move to next input
        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        // Move to previous input on backspace
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    // --- CRITICAL CHANGE: Hook up to API and onSuccess prop ---
    const handleSubmit = async () => {
        const fullOtp = otp.join("");
        if (fullOtp.length !== 6) return alert("Please enter the complete 6-digit OTP.");
        
        setIsVerifying(true);
        try {
            // 🔑 MODIFICATION: Replaced the placeholder api.post with the context function call
            await verifyOtp(email, fullOtp); 
            
            // Simulating a successful API response delay: (Removed as context handles API call now)
            // await new Promise(resolve => setTimeout(resolve, 1000));
            
            // 💡 2. On successful verification, call the onSuccess prop
            onSuccess(); 

        } catch (error) {
            // Handle error (show a local error message)
            // We use the message from the context error or a generic one
            const errorMessage = error.response?.data?.message || "OTP verification failed. Please check the code and try again.";
            alert(errorMessage);
            console.error("OTP verification error:", error);
            // setIsVerifying(false) is redundant if it's in finally, but kept for clarity

        } finally {
             // In a real app, loading stops here if onSuccess doesn't navigate away immediately
             setIsVerifying(false);
        }
    };

    return (
        <div className="w-full text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">OTP Verification</h2>
            <p className="text-gray-600 mb-8">
                {/* 💡 Use 'email' which is being passed from AuthModal */}
                Enter the OTP sent to <strong>{email}</strong>
            </p>

            <div className="flex justify-center gap-2 mb-8">
                {otp.map((data, index) => (
                    <input
                        key={index}
                        ref={el => inputRefs.current[index] = el}
                        type="text"
                        maxLength="1"
                        value={data}
                        onChange={(e) => handleChange(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        className="w-12 h-14 text-center text-2xl font-semibold border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300"
                    />
                ))}
            </div>

            <button
                onClick={handleSubmit}
                // Disable button during verification or if OTP is incomplete
                disabled={isVerifying || otp.join("").length !== 6} 
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold py-3 px-6 rounded-xl transform hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isVerifying ? 'Verifying...' : 'Verify OTP'}
            </button>
            
            {/* 💡 Add a Cancel/Go back button using the onCancel prop */}
            <p className="mt-4 text-sm text-gray-600">
                Wrong email?{' '}
                <button type="button" onClick={onCancel} className="text-red-600 font-semibold hover:underline">
                    Go Back/Cancel
                </button>
            </p>
            
            <p className="mt-2 text-sm text-gray-600">
                Didn't receive OTP? <a href="#" className="text-amber-600 font-semibold">Resend OTP</a>
            </p>
        </div>
    );
};

export default OtpVerification;