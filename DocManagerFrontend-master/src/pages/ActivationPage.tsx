import { ActivationAPI } from "@/components/API";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";

export default function ActivationPage() {
  const { uid, token } = useParams();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("Activating your account...");
  const navigate = useNavigate();
  useEffect(() => {
    if (uid && token) {
      ActivationAPI({ uid, token }).then((response) => {
        if (response) {
          setMessage("Activation successful");
          toast("Activation successful", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          toast("Please login to continue", {
            position: "top-right",
            autoClose: 6000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          setTimeout(() => {
            navigate("/");
          });
        } else {
          setError("Invalid activation link provided");
        }
      });
    }
    if (!uid || !token) {
      setError("Missing uid or token");
      setMessage("");
    }
  }, [uid, token, navigate]);
  return (
    <div className="flex h-screen w-full items-center justify-center p-4">
      <p className="text-red-500">{error}</p>
      {message}
    </div>
  );
}
