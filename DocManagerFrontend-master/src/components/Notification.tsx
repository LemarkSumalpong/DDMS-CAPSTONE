import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "./ui/accordion";
import { NotificationDeleteAPI, NotificationType } from "./API";
import AlertIcon from "./icons/alerticon";
import InformationIcon from "./icons/informationicon";
import { Button } from "./ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

type props = {
  notification: NotificationType;
};
export default function Notification(props: props) {
  const queryClient = useQueryClient();
  const delete_mutation = useMutation({
    mutationFn: async (id: number) => {
      const data = await NotificationDeleteAPI(id);
      if (data[0] != true) {
        return Promise.reject(new Error(JSON.stringify(data[1])));
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error: string) => {
      toast(
        `An error occured. Unable to dismiss notification ${String(error)}`,
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
    },
  });
  return (
    <div className="flex flex-row space-x-0.5 p-4 border-black border-4 align-bottom">
      <div className="flex-9 justify-center">
        {props.notification.type == "info" ? (
          <InformationIcon size={32} />
        ) : (
          <AlertIcon size={32} />
        )}
      </div>
      <div key={props.notification.id} className="flex flex-col flex-1">
        {props.notification.content.length > 16 ? (
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-sm">
                {props.notification.content.slice(0, 16)}...
              </AccordionTrigger>
              <AccordionContent className="text-sm">
                {props.notification.content}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ) : (
          <p className="text-sm">{props.notification.content}</p>
        )}

        <p className="text-xs">{props.notification.timestamp}</p>
        <Button onClick={() => delete_mutation.mutate(props.notification.id)}>
          Dismiss
        </Button>
      </div>
    </div>
  );
}
