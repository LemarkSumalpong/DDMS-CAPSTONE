import { useQuery } from "@tanstack/react-query";
import { NotificationsAPI, NotificationType } from "../API";
import AppIcon from "../icons/appicon";
import DashboardIcon from "../icons/dashboardicon";
import { Button } from "./button";
import { useSidebar } from "./sidebar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import BellIcon from "../icons/bellicon";
import InformationIcon from "../icons/informationicon";
import Notification from "../Notification";

interface HeaderProps {
  text?: string;
  children?: React.ReactNode;
}

export default function Header({ text, children }: HeaderProps) {
  const { toggleSidebar } = useSidebar();
  const notifications = useQuery({
    queryKey: ["notifications"],
    queryFn: NotificationsAPI,
  });

  return (
    <div
  className="flex items-center justify-between absolute top-0 w-full"
  style={{ backgroundColor: '#1D2951', width: '100%' }}
>
  <Button onClick={() => toggleSidebar()} className="rounded-none">
    <DashboardIcon />
  </Button>

  <h5
    className="text-white font-semibold text-center shadow-md px-2 py-2 bg-navy-blue rounded-lg absolute right-20"
  >
    Digital Document Management System USTP CDO
  </h5>

  <div className="flex flex-row gap-1">
    <Popover>
      <PopoverTrigger>
        <BellIcon />
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col space-y-1.5 h-60 overflow-y-scroll">
          {notifications.data
            ? (notifications.data as NotificationType[]).map(
                (notification: NotificationType) => {
                  return <Notification notification={notification} />;
                }
              )
            : "Loading Notifications..."}
          {notifications.data &&
          !notifications.isError &&
          notifications.data.length == 0 ? (
            <div className="flex flex-row space-x-0.5 p-4 border-black border-4 align-middle">
              <InformationIcon size={32} />
              <p className="text-sm">No notifications!</p>
            </div>
          ) : (
            <></>
          )}
        </div>
      </PopoverContent>
    </Popover>

    <AppIcon size={32} color={"#FFFFFF"} />
    {text && <p className="text-lg text-muted-foreground">{text}</p>}
  </div>

  {children}
</div>
  );
}
