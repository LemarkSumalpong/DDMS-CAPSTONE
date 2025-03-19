import { ResetPasswordAPI } from "@/components/API";
import { auth_toggle } from "@/components/plugins/redux/slices/AuthSlice";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
export default function ResetPasswordPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  return (
    <div className="flex h-screen w-full items-center justify-center p-4">
      <Card className="w-[420px]">
        <CardHeader>
          <CardTitle>Recover your Account</CardTitle>
          <CardDescription>
            Enter the email address you used when you signed up for your
            account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Email</Label>
                <Input
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                  id="email"
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center space-x-2">
          <Button
            onClick={async () => {
              const status = await ResetPasswordAPI(email);
              if (status === true) {
                await dispatch(auth_toggle());
                toast("Password reset link has been sent to your email", {
                  position: "top-right",
                  autoClose: 2000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "light",
                });
              } else {
                toast.error("An error occured", {
                  position: "top-right",
                  autoClose: 2000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "light",
                });
              }
            }}
          >
            Send Reset Link
          </Button>
          <Button onClick={() => navigate("/")}>Cancel</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
