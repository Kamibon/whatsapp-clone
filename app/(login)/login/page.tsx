"use client";
import React, { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useAppDispatch, useAppSelector } from "@/app/_redux/store";
import { createUser } from "@/app/_redux/userSlice";
import { useRouter } from "next/navigation";

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const usersState = useAppSelector((state) => state.user);

  const dispatch = useAppDispatch();

  const router = useRouter()

  const login = async () => {
    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (res?.ok) {
      router.replace("/");
    } else {
      alert("Credenziali non valide");
    }
  };

  async function handleSubmit() {
    if (isSignUp) {
      dispatch(
        createUser({
          username: username,
          password: password,
          displayName: username,
          phoneNumber: phoneNumber,
        }),
      );
    } else login();
  }

  useEffect(() => {
    if (usersState.createUserStatus === "success") {
      login();
    }
    if (usersState.createUserStatus === "failed") {
      alert("Signup failed");
    }
  }, [usersState.createUserStatus]);

  return (
    <div className="min-h-screen mt-[-10%] lg:mt-[-5%] flex justify-center fixed px-4 w-full z-20">
      <div className=" h-150 flex flex-row z-20 w-full">
        <div className=" bg-white flex flex-col gap-3 justify-start  px-3 py-4 rounded-2xl shadow-2xl w-full">
          <span className="font-bold text-2xl">
            {isSignUp ? "Registrati" : "Login"}
          </span>
          {isSignUp && (
            <input
              onChange={(e) => setPhoneNumber(e.target.value)}
              value={phoneNumber}
              placeholder="Numero di telefono"
              className=" border-b focus:outline-none focus:ring-0 p-2"
            />
          )}
          <input
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            placeholder="Username"
            className=" border-b focus:outline-none focus:ring-0 p-2"
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Password"
            type="password"
            className=" border-b focus:outline-none focus:ring-0 p-2"
          />
          <div className=" flex items-center gap-4 py-4">
            <button
              onClick={() => {
                handleSubmit();
              }}
              className="cursor-pointer px-4 py-2 bg-green-700 hover:bg-green-800 rounded-2xl text-white"
            >
              {isSignUp ? "Registrati" : "Login"}
            </button>
            <span className="text-base">
              {isSignUp ? "Hai già un account?" : "Non hai ancora un account?"}
            </span>
            <span
              onClick={() => setIsSignUp((prev) => !prev)}
              className="text-base cursor-pointer text-green-700"
            >
              {isSignUp ? "Login" : "Registrati"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
