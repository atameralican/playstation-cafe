"use client";

import React from "react";
import { useGlobalLoading } from "@/components/useServiceHook/useServiceHook";
import LoaderDeplasman from "../ui/loaderDep";

const GlobalLoadingOverlay = () => {
  const { isLoading } = useGlobalLoading();

  if (!isLoading) return null;

  return <LoaderDeplasman visible={true} />; 
};

export default GlobalLoadingOverlay;