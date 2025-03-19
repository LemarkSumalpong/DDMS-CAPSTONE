import { RegisterAPI, RegisterType } from "@/components/API";
import { auth_toggle } from "@/components/plugins/redux/slices/AuthSlice";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [user, setUser] = useState<RegisterType>({
    first_name: "",
    last_name: "",
    email: "",
    sex: "",
    birthday: "",
    password: "",
    confirm_password: "",
  });

  return (
     <div className="flex h-screen w-full items-center justify-center p-4">  
      <Card className="w-[420px]">
        <CardHeader>
          <img className="mx-auto w-10 h-auto sm:block hidden" src="/src/components/images/icon1.png" alt="Login" />
        <h2 className="mt-6 text-center text-3xl leading-9 font-extrabold text-gray-900">
            Create a new account
        </h2>
          <CardDescription className="text-red-600">{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">First Name</Label>
                <Input
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setUser({ ...user, first_name: e.target.value })
                  }
                  id="first_name"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Last Name</Label>
                <Input
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setUser({ ...user, last_name: e.target.value })
                  }
                  id="last_name"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Email</Label>
                <Input
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setUser({ ...user, email: e.target.value })
                  }
                  id="username"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="framework">Sex</Label>
                <Select
                  defaultValue={user.sex}
                  value={user.sex}
                  onValueChange={(value) => setUser({ ...user, sex: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !user.birthday && "text-muted-foreground"
                      )}
                    >
                      <Label htmlFor="framework">Birthdate</Label>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {user.birthday ? (
                        format(user.birthday, "PPP")
                      ) : (
                        
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <input
                      type="date"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setUser({ ...user, birthday: e.target.value })
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
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
        <CardFooter className="flex justify-center space-x-2">
          <Button onClick={() => navigate("/")}>Cancel</Button>
          <Button
            onClick={async () => {
              if (user.password != user.confirm_password) {
                setError("Passwords do not match");
                return;
              }
              const status = await RegisterAPI(user);
              if (status[0] === true) {
                await dispatch(auth_toggle());
                navigate("/");
                toast(
                  "Registration success! Please check your email to activate",
                  {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                  }
                );
              } else {
                setError(String(status[1]));
              }
            }}
          >
            Register
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}