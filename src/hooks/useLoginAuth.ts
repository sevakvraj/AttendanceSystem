"use client";

import { useState, useEffect } from "react";

export function useLoginAuth() {
  const [pid, setPid] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isPidFocused, setIsPidFocused] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const err = params.get("error");
      if (err === "session_expired") {
        setError("Your session has expired or is invalid. Please log in again.");
      } else if (err === "unauthorized_admin") {
        setError("Access denied: Admin credentials required.");
      } else if (err === "student_unauthorized") {
        setError("Please log in to access the student portal.");
      }
    }
  }, []);

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const cleanInput = pid.trim();
    const cleanPwd = password.trim();

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: cleanInput,
          password: cleanPwd,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Authentication failed. Please verify your credentials.");
        return;
      }

      if (data.role === "admin") {
        window.location.href = "/admin";
      } else {
        // Store verified credentials in client cache
        localStorage.setItem("studentPid", data.user.pid);
        localStorage.setItem("studentName", data.user.name);
        if (data.user.email) localStorage.setItem("studentEmail", data.user.email);
        if (data.user.phone) localStorage.setItem("studentPhone", data.user.phone);

        window.location.href = "/student";
      }
    } catch (err) {
      console.error("Login request error:", err);
      setError("Failed to connect to authentication server. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    pid,
    setPid,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    toggleShowPassword,
    isPasswordFocused,
    setIsPasswordFocused,
    isPidFocused,
    setIsPidFocused,
    error,
    setError,
    isLoading,
    handleLogin,
  };
}
