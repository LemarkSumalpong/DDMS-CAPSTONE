import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";

export default function LoadingPage() {
  const navigate = useNavigate();
  return (
    <div className="flex h-screen w-full items-center justify-center p-4">
      <div className="text-center">
        <p className="text-2xl text-gray-600 mb-8">Loading - Sit tight!</p>
        <Button onClick={() => navigate("/dashboard")}>Return</Button>
      </div>
    </div>
  );
}
