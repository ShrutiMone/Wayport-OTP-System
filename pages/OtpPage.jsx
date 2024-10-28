import React from 'react'
import OTPInput from '@/components/OtpInput';

const OtpPage = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="p-8 bg-white shadow-lg rounded">
            <h2 className="mb-6 text-2xl font-semibold text-center text-[#165858]">Enter OTP</h2>
            <OTPInput />
          </div>
        </div>
      );
}

export default OtpPage