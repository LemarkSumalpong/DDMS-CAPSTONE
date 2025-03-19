import { ResetPasswordConfirmAPI } from "@/components/API";
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
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
export default function ResetPasswordConfirmPage() {
  const { uid, token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [user, setUser] = useState({
    password: "",
    confirm_password: "",
  });
  return (
    <div className="flex h-screen w-full items-center justify-center p-4">
      <Card className="w-[420px]">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription className="text-red-600">{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Password</Label>
                <Input
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setUser({ ...user, password: e.target.value })
                  }
                  type="password"
                  id="password"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Confirm Password</Label>
                <Input
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setUser({ ...user, confirm_password: e.target.value })
                  }
                  type="password"
                  id="password"
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col justify-center space-y-2">
          <div className="flex flex-row justify-center space-x-2">
            <Button
              onClick={async () => {
                if (!uid || !token) {
                  setError("Invalid URL");
                  return;
                }
                if (user.password != user.confirm_password) {
                  setError("Passwords do not match");
                  return;
                }
                if (!user.password || !user.confirm_password) {
                  setError("No password entered");
                  return;
                }
                const status = await ResetPasswordConfirmAPI({
                  uid: uid || "",
                  token: token || "",
                  new_password: user.password,
                });

                if (status[0] === true) {
                  await dispatch(auth_toggle());
                  navigate("/");
                  toast("Password reset successfully. Please log in", {
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
                  toast.error(String(status[1]), {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                  });
                  setError(String(status[1]));
                }
              }}
            >
              Submit
            </Button>
            <Button onClick={() => navigate("/")}>Cancel</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
