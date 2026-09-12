"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { findStudent } from "@/services/db";

export function useLoginAuth() {
  const router = useRouter();
  const [pid, setPid] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isPidFocused, setIsPidFocused] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const cleanInput = pid.trim();
    const cleanPwd = password.trim();

    try {
      const user: any = await findStudent(cleanInput);

      if (user) {
        const isPasswordMatch =
          user.password === cleanPwd ||
          user.password?.toUpperCase() === cleanPwd.toUpperCase();

        if (isPasswordMatch) {
          if (user.pid?.toUpperCase() === "ADMIN001") {
            router.push("/admin");
          } else {
            if (user.isBlocked) {
              setError("Admin blocked you. Please contact your class representative / admin.");
              return;
            }
            // Store student credentials in localStorage
            localStorage.setItem("studentPid", user.pid);
            localStorage.setItem("studentName", user.name);
            localStorage.setItem("studentEmail", user.email || "");
            localStorage.setItem("studentPhone", user.phone || "");
            router.push("/student");
          }
        } else {
          setError("Invalid password. (Default is your Student PID, e.g. MG26001)");
        }
      } else {
        setError("Account not found. Please enter a valid Student PID (e.g. MG26001).");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to connect to database. Please check your connection.");
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
