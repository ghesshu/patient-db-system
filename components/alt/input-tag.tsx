"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { RiErrorWarningFill } from "react-icons/ri";

interface InputProps {
  label: string;
  type?: "text" | "password" | "textarea" | "number" | "select" | "date"; // Added "select" type
  value?: string | number;
  onChange?: any;
  error?: string;
  className?: string;
  disabled?: boolean;
  max?: any;
  name?: string;
  placeholder?: string;
  options?: { label: string; value: string }[]; // Added options prop for select
}

const Input: React.FC<InputProps> = ({
  label,
  type = "text",
  value,
  onChange,
  error,
  className,
  disabled,
  max,
  name,
  placeholder,
  options, // Added options prop
}) => {
  const [isLabelActive, setIsLabelActive] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  useEffect(() => {
    if (value) {
      setIsLabelActive(true);
    } else {
      setIsLabelActive(false);
    }
  }, [value]);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap- w-full">
        <label className={cn("dark:text-white text-sm text-black text-left")}>
          {label} <span className="text-red-500">*</span>
        </label>

        {type === "textarea" ? (
          <textarea
            name={name}
            disabled={disabled}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onFocus={() => setIsLabelActive(true)}
            onBlur={() => {
              if (!value) {
                setIsLabelActive(false);
              }
            }}
            className={cn(
              "w-full p-4 border rounded-sm focus:outline-none focus:border-green-500 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 dark:border-neutral-700 dark:focus:border-green-500 bg-white pt-4 mt-[0.2rem] resize-none dark:bg-transparent dark:text-white text-black",
              className,
              { "border-red-500": error }
            )}
          />
        ) : type === "select" ? (
          <select
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={cn(
              "w-full p-4  border-[1px] rounded-sm focus:outline-none focus:border-green-500 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 dark:border-neutral-700 dark:focus:border-green-500   mt-[0.2rem] bg-white dark:bg-transparent text-black dark:text-white",
              className,
              { "border-red-500": error }
            )}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={isPasswordVisible && type === "password" ? "text" : type}
            name={name}
            disabled={disabled}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            max={max}
            onFocus={() => setIsLabelActive(true)}
            onBlur={() => {
              if (!value) {
                setIsLabelActive(false);
              }
            }}
            className={cn(
              "w-full p-4  border-[1px] rounded-sm focus:outline-none focus:border-green-500 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 dark:border-neutral-700 dark:focus:border-green-500   mt-[0.2rem] bg-white dark:bg-transparent text-black dark:text-white",
              className,
              { "border-red-500": error }
            )}
          />
        )}

        {type === "password" && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          >
            {isPasswordVisible ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </button>
        )}
      </div>

      <div className="h-[1rem]">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="h-[1rem] text-[0.7rem] text-red-700 flex items-center gap-1 pt-1"
          >
            <p className="text-sm">
              <RiErrorWarningFill />
            </p>{" "}
            <p>{error}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Input;
