"use client";

import React, { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

const NewPasswordComponent = () => {
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const supabase = createClientComponentClient();
  const router = useRouter();

  const validatePassword = (pwd: string) => {
    if (pwd.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return false;
    }
    setErrorMessage("");
    return true;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pwd = e.target.value;
    setPassword(pwd);
    if (validatePassword(pwd)) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  };

  const handlePasswordRepeatChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const pwd = e.target.value;
    setPasswordRepeat(pwd);
    if (validatePassword(pwd)) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  };

  async function handlePasswordUpdate() {
    if (password !== passwordRepeat) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    const {error} = await supabase.auth.updateUser({ password: password });
    if (error) {
      setErrorMessage(error.message);
      return;
    } else {
      router.push("/login?message=Password updated. Please log in with the new password")
    }
  }

  return (
    <div className='p-6 space-y-4 md:space-y-6 sm:p-8 max-w-md w-full'>
      <div>
        <label htmlFor="password">New Password:</label>
        <input
          type="password"
          name="password"
          id="password"
          onChange={handlePasswordChange}
          placeholder="type new password"
          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
        />
      </div>
      <div>
        <label htmlFor="password">Repeat Password:</label>
        <input
          type="password"
          name="passwordRepeat"
          id="passwordRepeat"
          onChange={handlePasswordRepeatChange}
          placeholder="repeat new password"
          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
        />
      </div>
      <button
        className="w-full bg-pink-300 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        onClick={handlePasswordUpdate}
      >
        Update Password
      </button>
      {!isValid && <p style={{ color: "red" }}>{errorMessage}</p>}
      {isValid && <p style={{ color: "green" }}>Password is valid!</p>}
    </div>
  );
};

export default NewPasswordComponent;
