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

  const router = useRouter();

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
          avatarUrl: null,
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
   
<main className="w-full px-4 py-8 sm:py-12">
  <div className="mx-auto w-full max-w-md">
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className="flex w-full flex-col gap-4 rounded-2xl bg-white p-5 shadow-2xl sm:p-8"
    >
      <h1 className="text-2xl font-bold">
        {isSignUp ? "Registrati" : "Login"}
      </h1>

      {isSignUp && (
        <input
          onChange={(e) => setPhoneNumber(e.target.value)}
          value={phoneNumber}
          placeholder="Numero di telefono"
          type="tel"
          className="w-full border-b p-3 focus:outline-none focus:border-green-700"
        />
      )}

      <input
        onChange={(e) => setUsername(e.target.value)}
        value={username}
        placeholder="Username"
        autoComplete="username"
        className="w-full border-b p-3 focus:outline-none focus:border-green-700"
      />

      <input
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSubmit();
          }
        }}
        placeholder="Password"
        type="password"
        autoComplete={isSignUp ? "new-password" : "current-password"}
        className="w-full border-b p-3 focus:outline-none focus:border-green-700"
      />

      <div className="flex flex-col items-start gap-3 pt-3 sm:flex-row sm:items-center sm:flex-wrap">
        <button
          type="submit"
          className="w-full cursor-pointer rounded-xl bg-green-700 px-5 py-3 text-white transition hover:bg-green-800 sm:w-auto"
        >
          {isSignUp ? "Registrati" : "Login"}
        </button>

        <span className="text-sm sm:text-base">
          {isSignUp
            ? "Hai già un account?"
            : "Non hai ancora un account?"}
        </span>

        <button
          type="button"
          onClick={() => setIsSignUp((prev) => !prev)}
          className="cursor-pointer text-green-700 hover:underline"
        >
          {isSignUp ? "Login" : "Registrati"}
        </button>
      </div>
    </form>
  </div>
</main>

  );
}
