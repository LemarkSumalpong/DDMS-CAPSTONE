import { LoginAPI } from "@/components/API";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [user, setUser] = useState({
    email: "",
    password: "",
    remember: true,
  });
  
  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
       <div className="container mx-auto px-6 py-16 lg:py-20">
        <div className="flex flex-col items-center lg:flex-row lg:items-start lg:justify-start lg:gap-x-12 ">
         <div className="lg:w-1/2 mb-8 lg:mb-0 text-center lg:text-left">
           <h1 className="text-blue-600 dark:text-gray-300 md:text-lg">
            Welcome back to Central Records
           </h1>
           <h1 className="mt-4 text-2xl font-medium text-gray-800 capitalize lg:text-3xl dark:text-white">
            Login to your account
           </h1>
           <img
            className="mx-auto w-full max-w-[400px] h-auto object-contain"
            src="/src/components/images/DDMS.png"
            alt="Login"
          />
        </div>
                      
          <Card className="w-[400px] p-4">
        <CardHeader>
          <CardTitle className="text-blue-600 text-center mb-4">Sign in</CardTitle>
          <CardDescription className="text-red-600">{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
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
                <Label htmlFor="name">Password</Label>
                <Input
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setUser({ ...user, password: e.target.value })
                  }
                  type="password"
                  id="password"
                />
              </div>
            </div>
          </form>
        </CardContent>
        <div className="flex items-center justify-between px-4 mt-2 mb-4">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={user.remember}
              onClick={() => setUser({ ...user, remember: !user.remember })}
              />
              <p>Remember me</p>
          </div>
        <a
          className="font-medium text-blue-600 hover:text-blue-500 hover:cursor-pointer"
          onClick={() => navigate("/reset_password/")}
          >
        Forgot Password
       </a>
      </div>
        

        <CardFooter className="flex flex-col gap-4 items-center">
            <button className="group relative w-[250px] flex justify-center py-2 px-10 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={async () => {
                const status = await LoginAPI(user, user.remember);
                if (status === true) {
                  await dispatch(auth_toggle());
                  navigate("/dashboard/");
                  toast("Logged in", {
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
                  setError("Invalid login");
                }
              }}
            >
              Sign in
            </button>

            <div className="mt-6">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-gray-100 text-gray-500">
                            Or
                        </span>
                    </div>
                </div>
            
            <div className="mt-9">
            <Button className="group relative w-[250px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500" 
            onClick={() => navigate("/register/")}>Create an Account</Button>
            </div>

          </div>
        </CardFooter>
      </Card>

    </div>
    <div className="px-4 pt-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8">
  <div className="grid gap-10 row-gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
    <div className="sm:col-span-2">
      <a href="/" aria-label="Go home" title="DDMS" className="inline-flex items-center">
      <img src="src/components/images/icon1.png" alt="Home Icon" className="w-4 h-4" />
        <span className="ml-2 text-xl font-bold tracking-wide text-gray-800 uppercase">University Of Science and Technology</span>
      </a>
      <div className="mt-6 lg:max-w-sm">
        <p className="text-sm text-gray-800">
        Welcome to our Digital Document Management System. Here, you can easily request and access the documents you need. Simply submit a request, and our system will ensure that your documents are retrieved quickly and securely. Manage and track all your document requests with ease.
        </p>
        <p className="mt-4 text-sm text-gray-800">
          if you have issue during the run, feel free to contact.
        </p>
      </div>
    </div>
    <div className="space-y-2 text-sm">
      <p className="text-base font-bold tracking-wide text-gray-900">Contacts</p>
      <div className="flex">
        <p className="mr-1 text-gray-800">Phone:</p>
        <a href="tel:850-123-5021" aria-label="Our phone" title="Our phone" className="transition-colors duration-300 text-deep-purple-accent-400 hover:text-deep-purple-800">850-123-5021</a>
      </div>
      <div className="flex">
        <p className="mr-1 text-gray-800">Email:</p>
        <a href="mailto:info@lorem.mail" aria-label="Our email" title="Our email" className="transition-colors duration-300 text-deep-purple-accent-400 hover:text-deep-purple-800">drakeescarda13@gmail.com</a>
      </div>
      <div className="flex">
        <p className="mr-1 text-gray-800">Address:</p>
        <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer" aria-label="Our address" title="Our address" className="transition-colors duration-300 text-deep-purple-accent-400 hover:text-deep-purple-800">
        Claro M. Recto Avenue, Lapasan, Cagayan de Oro City, 9000 Misamis Oriental
        </a>
      </div>
    </div>
    <div>
      <span className="text-base font-bold tracking-wide text-gray-900">Social</span>
      <div className="flex items-center mt-1 space-x-3">
        <a href="/" className="text-gray-500 transition-colors duration-300 hover:text-deep-purple-accent-400">
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-5">
            <path
              d="M24,4.6c-0.9,0.4-1.8,0.7-2.8,0.8c1-0.6,1.8-1.6,2.2-2.7c-1,0.6-2,1-3.1,1.2c-0.9-1-2.2-1.6-3.6-1.6 c-2.7,0-4.9,2.2-4.9,4.9c0,0.4,0,0.8,0.1,1.1C7.7,8.1,4.1,6.1,1.7,3.1C1.2,3.9,1,4.7,1,5.6c0,1.7,0.9,3.2,2.2,4.1 C2.4,9.7,1.6,9.5,1,9.1c0,0,0,0,0,0.1c0,2.4,1.7,4.4,3.9,4.8c-0.4,0.1-0.8,0.2-1.3,0.2c-0.3,0-0.6,0-0.9-0.1c0.6,2,2.4,3.4,4.6,3.4 c-1.7,1.3-3.8,2.1-6.1,2.1c-0.4,0-0.8,0-1.2-0.1c2.2,1.4,4.8,2.2,7.5,2.2c9.1,0,14-7.5,14-14c0-0.2,0-0.4,0-0.6 C22.5,6.4,23.3,5.5,24,4.6z"
            ></path>
          </svg>
        </a>
        <a href="/" className="text-gray-500 transition-colors duration-300 hover:text-deep-purple-accent-400">
          <svg viewBox="0 0 30 30" fill="currentColor" className="h-6">
            <circle cx="15" cy="15" r="4"></circle>
            <path
              d="M19.999,3h-10C6.14,3,3,6.141,3,10.001v10C3,23.86,6.141,27,10.001,27h10C23.86,27,27,23.859,27,19.999v-10   C27,6.14,23.859,3,19.999,3z M15,21c-3.309,0-6-2.691-6-6s2.691-6,6-6s6,2.691,6,6S18.309,21,15,21z M22,9c-0.552,0-1-0.448-1-1   c0-0.552,0.448-1,1-1s1,0.448,1,1C23,8.552,22.552,9,22,9z"
            ></path>
          </svg>
        </a>
        <a href="/" className="text-gray-500 transition-colors duration-300 hover:text-deep-purple-accent-400">
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-5">
            <path
              d="M22,0H2C0.895,0,0,0.895,0,2v20c0,1.105,0.895,2,2,2h11v-9h-3v-4h3V8.413c0-3.1,1.893-4.788,4.659-4.788 c1.325,0,2.463,0.099,2.795,0.143v3.24l-1.918,0.001c-1.504,0-1.795,0.715-1.795,1.763V11h4.44l-1,4h-3.44v9H22c1.105,0,2-0.895,2-2 V2C24,0.895,23.105,0,22,0z"
            ></path>
          </svg>
        </a>
      </div>
    </div>
  </div>
  <div className="flex flex-col-reverse justify-between pt-5 pb-10 border-t lg:flex-row">
    <p className="text-sm text-gray-600">
      © Copyright 2024 Central Records DDMS. All rights reserved.
    </p>
      <ul className="flex flex-col mb-3 space-y-2 lg:mb-0 sm:space-y-0 sm:space-x-5 sm:flex-row">
        <li>
          <a href="/" className="text-sm text-gray-600 transition-colors duration-300 hover:text-deep-purple-accent-400">F.A.Q</a>
          </li>
           <li>
          <a href="/" className="text-sm text-gray-600 transition-colors duration-300 hover:text-deep-purple-accent-400">Privacy Policy</a>
          </li>
          <li>
          <a href="/" className="text-sm text-gray-600 transition-colors duration-300 hover:text-deep-purple-accent-400">Terms &amp; Conditions</a>
         </li>
         </ul>
        </div>
      </div>
    </div>
  </div>  
  );
}
