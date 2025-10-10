// components/GlobalLoadingOverlay.tsx
"use client";

import React from "react";
import { useGlobalLoading } from "@/components/useServiceHook/useServiceHook";
import { Loader2 } from "lucide-react";
import LoaderDeplasman from "../ui/loaderDep";

const GlobalLoadingOverlay = () => {
  const { loadings, isLoading } = useGlobalLoading();

  if (!isLoading) return null;

  return (
    <>
       <LoaderDeplasman/>
    </>
  );
};

export default GlobalLoadingOverlay;