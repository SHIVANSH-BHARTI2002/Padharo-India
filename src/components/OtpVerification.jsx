import React, { useState, useRef } from 'react';

const OtpVerification = ({ mobileNumber }) => {
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const inputRefs = useRef([]);

    const handleChange = (e, index) => {
        const value = e.target.value;
        if (isNaN(value)) return; // Only allow numbers

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

    const handleSubmit = () => {
        alert(`Verifying OTP: ${otp.join("")}`);
    };

    return (
        <div className="w-full text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">OTP Verification</h2>
            <p className="text-gray-600 mb-8">
                Enter the OTP sent to <strong>{mobileNumber}</strong>
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
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold py-3 px-6 rounded-xl transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
                Verify OTP
            </button>
            <p className="mt-4 text-sm text-gray-600">
                Didn't receive OTP? <a href="#" className="text-amber-600 font-semibold">Resend OTP</a>
            </p>
        </div>
    );
};

export default OtpVerification;