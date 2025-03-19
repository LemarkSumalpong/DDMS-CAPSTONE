import React from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
interface ErrorPageProps {
  statusCode?: number;
  errorMessage?: string;
  title?: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({
  statusCode = 400,
  errorMessage = "An error has occured",
  title = `Error ${statusCode}`,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-full items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">{title}</h1>
        <p className="text-2xl text-gray-600 mb-8">{errorMessage}</p>
        <Button onClick={() => navigate("/dashboard")}>Return</Button>
      </div>
    </div>
  );
};

export default ErrorPage;
