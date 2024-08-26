"use client";
import React, { useState } from "react";
import Input from "./input-tag";
import { Button } from "../ui/button";
import { signIn } from "next-auth/react";
import { toast, ToastContainer } from "react-toastify";

const Authlogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pload, setPload] = useState(false);

  const handleLoginClick = async () => {
    setPload(true);
    // toast.error("Password is required");

    if (!password) {
      // toast.error("Password is required");
      setPload(false);
      return;
    }

    try {
      const sign: any = await signIn("credentials", {
        redirect: false,
        email: email,
        password: password,
        callbackUrl:"/dashboard",
      });

      if (sign.ok) {
        window.location.href = sign.url;
      } else {
        toast.error(sign ? sign.error : "An unexpected error occurred.");
      }

      console.log(sign);
    } catch (e: any) {
      toast.error(e.message || e.error || "An unexpected error occurred.");
      throw e;
    } finally {
      setPload(false);
    }
  };

  return (
    <div>
      {/* <ToastContainer position="top-right" /> */}
      <Input
        label="Email address"
        type="email"
        value={email}
        onChange={(e: any) => setEmail(e.target.value)}
        disabled={pload}
      />
      <div className="">
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e: any) => setPassword(e.target.value)}
          disabled={pload}
        />
      </div>

      <div className="mt-[1rem]">
        <Button
          variant="default"
          className="h-[52px] w-full rounded-lg "
          onClick={handleLoginClick}
          disabled={!password || pload || !email}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default Authlogin;
