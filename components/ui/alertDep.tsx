"use client";

import {  ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const showAlert = (msg: string, type: "success" | "error" = "success") => {
  if (type === "success") toast.success(msg, { theme: "colored", progress: undefined, });
  else toast.error(msg, { theme: "colored" ,progress: undefined,});
};

export default function ToastProvider() {
  return <ToastContainer position="bottom-right" />;
}