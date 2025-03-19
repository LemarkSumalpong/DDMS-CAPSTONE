import { Navigate } from "react-router";
import { UserAPI, head_roles } from "./API";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import LoadingPage from "@/pages/LoadingPage";

type props = {
  children: React.ReactNode;
};

export default function HeadOnlyPage(props: props) {
  const user = useQuery({ queryKey: ["user"], queryFn: UserAPI });

  if (user.isLoading) {
    return <LoadingPage />;
  }

  if (user.isFetched && user.data && head_roles.includes(user.data.role)) {
    return props.children;
  } else {
    toast.error("You are not authorized to view this page.");
    return <Navigate to="/dashboard/" />;
  }
}
