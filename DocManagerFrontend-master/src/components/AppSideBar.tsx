"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
// import { Button } from "./ui/button";
import { useSidebar } from "@/components/ui/sidebar";
// import { useNavigate } from "react-router";
import { Separator } from "./ui/separator";
import { useQuery } from "@tanstack/react-query";
import {
  planning_roles,
  setAccessToken,
  setRefreshToken,
  staff_roles,
  head_roles,
  UserAPI,
  admin_roles,
} from "./API";
import BookIcon from "./icons/bookicon";
import DashboardIcon from "./icons/dashboardicon";
import { Button } from "./ui/button";
import AppIcon from "./icons/appicon";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./plugins/redux/Store";
import PersonIcon from "./icons/personicon";
import LogoutIcon from "./icons/logouticon";
import { toast } from "react-toastify";
import { auth_toggle } from "./plugins/redux/slices/AuthSlice";
import DocumentIcon from "./icons/documenticon";
import AddIcon from "./icons/addicon";

export default function AppSidebar() {
  const user = useQuery({ queryKey: ["user"], queryFn: UserAPI });
  const dispatch = useDispatch();
  const authenticated = useSelector((state: RootState) => state.auth.value);
  const { toggleSidebar } = useSidebar();
  const navigate = useNavigate();

  
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex flex-row gap-2 items-center">
          <AppIcon size={64} />
          <div className="flex flex-col gap-2 items-start">
            <p className=" text-white text-center text-2xl font-bold">DDMS</p>
          </div>
        </div>
        <Button onClick={() => toggleSidebar()}>
          <DashboardIcon />
        </Button>
        <Separator />
        <div className="flex flex-row items-center gap-1">

          <p className="text-sm text-center sm:text-left font-bold  uppercase">
             {user.data?.role}: <span className=" text-sm font-thin">{user.data?.last_name}</span> 
          </p>
        </div>
        <Separator />
      </SidebarHeader>
      <SidebarContent className="space-y-1">
        {authenticated ? (
          <>
            <Button onClick={() => navigate("/dashboard/")} 
            className=" w-full bg-transparent border-0 hover:bg-opacity-20 p-2"
            >
              <div className="flex flex-row items-center w-full gap-1">
                <DashboardIcon />
                <span>Dashboard</span>
              </div>
            </Button>
          </>
        ) : (
          <></>
        )}
        {user.data && user.data.role == "client" ? (
          <>
            <p className="text-sm text-center sm:text-left font-bold">
             Manage Documents
            </p>
            <Button
              onClick={() => navigate("/requests/list")}
              className=" w-full bg-transparent border-0 hover:bg-opacity-20 p-2"
            >
              <div className="flex flex-row items-center w-full gap-1">
                <DocumentIcon />
                <span>Document Requested</span>
              </div>
            </Button>
            <Button
              onClick={() => navigate("/authorization_requests/list")}
              className=" w-full bg-transparent border-0 hover:bg-opacity-20 p-2"
            >
              <div className="flex flex-row items-center w-full gap-1">
                <DocumentIcon />
                <span>Authentication Requested</span>
              </div>
            </Button>
            <Button
              onClick={() => navigate("/requests/create")}
              className=" w-full bg-transparent border-0 hover:bg-opacity-20 p-2"
            >
              <div className="flex flex-row items-center w-full gap-1">
                <AddIcon />
                <span>New Document Request</span>
              </div>
            </Button>
            <Button
              onClick={() => navigate("/authorization_requests/create")}
              className=" w-full bg-transparent border-0 hover:bg-opacity-20 p-2"
            >
              <div className="flex flex-row items-center w-full gap-1">
                <AddIcon />
                <span>New Authentication Request</span>
              </div>
            </Button>
            <Button
              onClick={() => navigate("/questionnaires/create/")}
               className=" w-full bg-transparent border-0 hover:bg-opacity-20 p-2"
            >
              <div className="flex flex-row items-center w-full gap-1">
                <AddIcon />
                <span>New Feedback Survey Entry</span>
              </div>
            </Button>
          </>
        ) : (
          <></>
        )}
        {user.data && staff_roles.includes(user.data.role) ? (
          <>
            <p className="text-base text-center sm:text-left font-bold">
              Staff Actions
            </p>
            {admin_roles.includes(user.data.role) ? (
              <Button
                onClick={() => navigate("/users/list/")}
                 className=" w-full bg-transparent border-0 hover:bg-opacity-20 p-2"
              >
                <div className="flex flex-row items-center w-full gap-1">
                  <PersonIcon />
                  <span>Manage Users </span>
                </div>
              </Button>
            ) : (
              <></>
            )}
            {head_roles.includes(user.data.role) ? (
              <>
                <Button
                  onClick={() => navigate("/documents/list/head/")}
                  className=" w-full bg-transparent border-0 hover:bg-opacity-20 p-2"
                >
                  <div className="flex flex-row items-center w-full gap-1">
                    <BookIcon />
                    <span>Documents Uploaded</span>
                  </div>
                </Button>
                <Button
                  onClick={() => navigate("/requests/list/head/")}
                  className=" w-full bg-transparent border-0 hover:bg-opacity-20 p-2"
                >
                  <div className="flex flex-row items-center w-full gap-1">
                    <DocumentIcon />
                    <span>Document Requested</span>
                  </div>
                </Button>
                <Button
                  onClick={() => navigate("/authorization_requests/list/head/")}
                  className=" w-full bg-transparent border-0 hover:bg-opacity-20 p-2"
                >
                  <div className="flex flex-row items-center w-full gap-1">
                    <DocumentIcon />
                    <span>Authentication Requested</span>
                  </div>
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => navigate("/requests/list/staff/")}
                   className=" w-full bg-transparent border-0 hover:bg-opacity-20 p-2"
                >
                  <div className="flex flex-row items-center w-full gap-1">
                    <DocumentIcon />
                    <span>Document Requested</span>
                  </div>
                </Button>
                <Button
                  onClick={() =>
                    navigate("/authorization_requests/list/staff/")
                  }
                  className=" w-full bg-transparent border-0 hover:bg-opacity-20 p-2"
                >
                  <div className="flex flex-row items-center w-full gap-1">
                    <DocumentIcon />
                    <span>Authentication Requested</span>
                  </div>
                </Button>
                <Button
                  onClick={() => navigate("/documents/list/staff/")}
                   className=" w-full bg-transparent border-0 hover:bg-opacity-20 p-2"
                >
                  <div className="flex flex-row items-center w-full gap-1">
                    <BookIcon />
                    <span>Documents Uploaded</span>
                  </div>
                </Button>
              </>
            )}
            <Button
              onClick={() => navigate("/documents/upload/")}
              className=" w-full bg-transparent border-0 hover:bg-opacity-20 p-2"
            >
              <div className="flex flex-row items-center w-full gap-1">
                <AddIcon />
                <span>Upload Document</span>
              </div>
            </Button>
          </>
        ) : (
          <></>
        )}
        {user.data && planning_roles.includes(user.data.role) ? (
          <>
            <Button
              onClick={() => navigate("/questionnaires/list/")}
              className=" w-full bg-transparent border-0 hover:bg-opacity-20 p-2">
    
              <div className="flex flex-row items-center w-full gap-1">
                <DocumentIcon />
                <span>View Questionnaires</span>
              </div>
            </Button>
          </>
        ) : (
          <></>
        )}
     <Separator/>
     <p className="text-base text-center sm:text-left font-bold">
              Account
            </p>
        {authenticated ? (
          <>
            <Button onClick={() => navigate("/profile/")} 
            className=" w-full bg-transparent border-0 hover:bg-opacity-20 p-2">
              <div className="flex flex-row items-center w-full gap-1">
                <PersonIcon />
                <span>Profile</span>
              </div>
            </Button>
            <Button
              onClick={async () => {
                navigate("/");
                await dispatch(auth_toggle());
                await setAccessToken("");
                await setRefreshToken("");
                toast("Logged out", {
                  position: "top-right",
                  autoClose: 2000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "light",
                });
              }}
              className="bg-transparent border-0 hover:bg-opacity-20 p-2"
            >
              <div className="flex flex-row items-center w-full gap-1">
                <LogoutIcon />
                <span >Logout</span>
              </div>
            </Button>
          </>
        ) : (
          <></>
        )}
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-gray-200 text-center text-xs text-gray-500">
        © 2025 DDMS, Central Records
      </SidebarFooter> 
    </Sidebar>
  );
}
