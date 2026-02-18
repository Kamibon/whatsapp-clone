"use client";
import React, { useState } from "react";
import { signIn } from "next-auth/react";

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit() {
    if (isSignUp) return;

    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (res?.ok) {
      window.location.href = "/chat";
    } else {
      alert("Credenziali non valide");
    }
  }

  return (
    <div className="min-h-screen mt-[-10%] flex justify-center fixed px-4 w-full z-20">
      <div className=" h-150 flex flex-row z-20 w-full">
        <div className=" bg-white flex flex-col gap-3 justify-start h-[40%] px-3 py-4 shadow-2xl w-full">
          <span className="font-bold text-2xl">
            {isSignUp ? "Registrati" : "Login"}
          </span>
          <input
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Numero di telefono"
            className=" border-b focus:outline-none focus:ring-0 p-1"
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            className=" border-b focus:outline-none focus:ring-0 p-1"
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
