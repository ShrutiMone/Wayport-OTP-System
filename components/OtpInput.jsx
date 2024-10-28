"use client";
import { useState, useRef, useEffect } from "react";

export default function OTPInput() {
  const [otp, setOtp] = useState(new Array(4).fill(""));
  const [isComplete, setIsComplete] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [shake, setShake] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const inputRefs = useRef([]);

  const handleChange = (element, index) => {
    const value = element.value.replace(/[^0-9]/g, "");
    if (value) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (index < 3) inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    const newOtp = [...otp];

    switch (e.key) {
      case "Backspace":
        if (newOtp[index] === "") {
          if (index > 0) inputRefs.current[index - 1].focus();
        } else {
          newOtp[index] = "";
          setOtp(newOtp);
        }
        break;

      case "Delete":
        newOtp[index] = "";
        setOtp(newOtp);
        break;

      case "ArrowLeft":
        if (index > 0) inputRefs.current[index - 1].focus();
        break;

      case "ArrowRight":
        if (index < 3) inputRefs.current[index + 1].focus();
        break;

      default:
        break;
    }
  };

  const handlePaste = (e) => {
    const pastedOtp = e.clipboardData.getData("Text").slice(0, 4).split("");
    if (pastedOtp.length === 4 && pastedOtp.every((char) => !isNaN(char))) {
      setOtp(pastedOtp);
      setIsComplete(true);
    }
  };

  const handleVerify = (enteredOtp) => {
    const correctOtp = "1234"; // Assuming the correct OTP to be 1234
    if (enteredOtp === correctOtp) {
        setIsVerified(true);
        setTimeout(() =>alert("OTP Verified!"), 10);
    } else {
      setShake(true);
      setIsError(true);
      setTimeout(() => setShake(false), 500); // Stop shake after 500ms
      setTimeout(() => setIsError(false), 10000); // Reset red borders after 10 seconds
      startTimer();
    }
  };

  const startTimer = () => {
    setIsDisabled(true);
    setTimeLeft(10); // Reset timer to 10 seconds
    setTimeout(() => setOtp(new Array(4).fill("")), 10000); // Clear OTP fields
  };

  useEffect(() => {
    if (otp.every((digit) => digit !== "") && !isDisabled) {
      handleVerify(otp.join(""));
    }
  }, [otp, isDisabled]);

  useEffect(() => {
    if (isDisabled) {
      const countdown = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(countdown);
            setIsDisabled(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [isDisabled]);

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className={`flex space-x-4 ${shake ? "animate-shake" : ""}`}>
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            maxLength="1"
            value={digit}
            onChange={(e) => handleChange(e.target, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={(e) => handlePaste(e)}
            className={`w-12 h-12 text-center border rounded focus:outline-none focus:ring-2 ${
              isError ? "border-red-500" : "border-gray-300 focus:ring-[#165858]"
            }`}
          />
        ))}
      </div>

      {isError && <h3 className="text-red-500 font-semibold">Enter correct OTP</h3>}

      <button
        disabled={!isComplete || isDisabled}
        className={`px-4 py-2 mt-4 font-semibold text-white rounded ${
          otp.every((digit) => digit !== "") && !isDisabled
            ? "bg-[#008080] hover:bg-[#165858]"
            : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        {isDisabled ? `Resend in ${timeLeft}s` : isVerified? "OTP Verified" : "Verify"}
      </button>
    </div>
  );
}
