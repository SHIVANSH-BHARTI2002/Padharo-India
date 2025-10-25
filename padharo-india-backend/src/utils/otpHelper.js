// Basic Mock OTP Generation and Sending
const sendOtpService = async (mobile, otp) => {
    console.log(`--- MOCK OTP SERVICE ---`);
    console.log(`Sending OTP ${otp} to ${mobile}`);
    // Replace with actual SMS sending code (e.g., Twilio)
    console.log(`--- END MOCK OTP SERVICE ---`);
    return true; // Assume success for mock
};

const generateOtp = (length = 6) => {
    let otp = '';
    for (let i = 0; i < length; i++) {
        otp += Math.floor(Math.random() * 10);
    }
    return otp;
};

export { generateOtp, sendOtpService };