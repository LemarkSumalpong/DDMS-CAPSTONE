import {
  UpdateType,
  UserAPI,
  UserUpdateAPI,
  UserUpdatePasswordAPI,
} from "@/components/API";
import PersonIcon from "@/components/icons/personicon";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { DialogClose } from "@radix-ui/react-dialog";

export default function ProfilePage() {
  const user = useQuery({ queryKey: ["user"], queryFn: UserAPI });
  const [edited_user, setEditedUser] = useState<UpdateType>({
    first_name: "",
    last_name: "",
    birthday: "",
    sex: "",
  });
  const [password, setPassword] = useState({
    new_password: "",
    confirm_new_password: "",
    current_password: "",
  });
  const queryClient = useQueryClient();
  const password_mutation = useMutation({
    mutationFn: async () => {
      const data = await UserUpdatePasswordAPI(password);
      if (data[0] != true) {
        return Promise.reject(new Error(JSON.stringify(data[1])));
      }
      return data;
    },
    onSuccess: () => {
      toast(`Password updated successfully`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    },
    onError: () => {
      toast.error(`Invalid password specified`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    },
  });
  const update_mutation = useMutation({
    mutationFn: async () => {
      const data = await UserUpdateAPI(edited_user);
      if (data[0] != true) {
        return Promise.reject(new Error(JSON.stringify(data[1])));
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      toast(`Updated successfully`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    },
    onError: (error) => {
      toast.error(`An error has occured: ${String(error)}`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    },
  });
  return (
     <div
      className="flex flex-col h-screen w-full overflow-y-scroll items-center bg-gray-100 py-8">
      <div className="w-full max-w-3xl px-6">
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
              <PersonIcon size={64} />
            </div>
            <p className="text-2xl font-bold text-gray-800">{user.data?.full_name}</p>
            <p className="text-sm text-gray-500">{user.data?.email}</p>
          </div>
          <Accordion type="single" collapsible className="mt-6">
            <AccordionItem value="user_info">
              <AccordionTrigger>User Information</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2 text-gray-700">
                  <li>
                    <span className="font-bold">Email:</span>
                     {user.data?.email}
                  </li>
                  <li>
                    <span className="font-bold">First Name:</span>
                     {user.data?.first_name}
                  </li>
                  <li>
                    <span className="font-bold">Last Name:</span> 
                    {user.data?.last_name}
                  </li>
                  <li>
                    <span className="font-bold">Sex:</span>
                     {user.data?.sex}
                  </li>
                  <li>
                   <span className="font-bold">Role: </span> 
                   {user.data?.role}
                  </li>
                  <li>
                    <span className="font-bold"> Age: </span>
                     {user.data?.age}
                  </li>
                  <li> 
                    <span className="font-bold">Birthday: </span>
                    {user.data?.birthday}
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full mb-4"
              onClick={() => {
                setEditedUser({
                  ...edited_user,
                  first_name: user.data?.first_name || "",
                last_name: user.data?.last_name || "",
                birthday: user.data?.birthday || "",
                sex: user.data?.sex || "",
                });
              }}
            >
              Edit Profile
            </Button>
          </DialogTrigger>
          <DialogContent>
            <Card className="w-full max-w-lg">
              <CardHeader>
                <CardTitle>Update Your Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <form>
                  <div className="space-y-4">
                    <div className="flex flex-col">
                      <Label htmlFor="first_name">First Name</Label>
                      <Input
                        id="first_name"
                        value={edited_user.first_name}
                        onChange={(e) =>
                          setEditedUser({
                            ...edited_user,
                            first_name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="flex flex-col">
                      <Label htmlFor="last_name">Last Name</Label>
                      <Input
                        id="last_name"
                        value={edited_user.last_name}
                        onChange={(e) =>
                          setEditedUser({
                            ...edited_user,
                            last_name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="flex flex-col">
                      <Label htmlFor="sex">Sex</Label>
                      <Select
                        value={edited_user.sex}
                        onValueChange={(value) =>
                          setEditedUser({ ...edited_user, sex: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col">
                      <Label htmlFor="birthday">Birthday</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                           <Button
                          variant={"outline"}
                          className={cn(
                            "w-[280px] justify-start text-left font-normal",
                            !user.data?.birthday && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {edited_user.birthday ? (
                            format(edited_user.birthday, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                          <input
                            type="date"
                            className="p-2 border rounded w-full"
                            onChange={(e) =>
                              setEditedUser({
                                ...edited_user,
                                birthday: e.target.value,
                              })
                            }
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={() => update_mutation.mutate()}>Save</Button>
              </CardFooter>
            </Card>
          </DialogContent>
        </Dialog>
  
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              Update Password
            </Button>
          </DialogTrigger>
          <DialogContent>
            <Card className="w-full max-w-lg">
              <CardHeader>
                <CardTitle>Update Password</CardTitle>
              </CardHeader>
              <CardContent>
                <form>
                  <div className="space-y-4">
                    <div className="flex flex-col">
                      <Label>Old Password</Label>
                      <Input
                        type="password"
                        onChange={(e) =>
                          setPassword({
                            ...password,
                            current_password: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="flex flex-col">
                      <Label>New Password</Label>
                      <Input
                        type="password"
                        onChange={(e) =>
                          setPassword({
                            ...password,
                            new_password: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="flex flex-col">
                      <Label>Confirm New Password</Label>
                      <Input
                        type="password"
                        onChange={(e) =>
                          setPassword({
                            ...password,
                            confirm_new_password: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-end">
              <DialogClose asChild>
                <Button
                  onClick={() => {
                    if (
                      !password.current_password ||
                      !password.new_password ||
                      !password.confirm_new_password
                    ) {
                      toast.error(`No password provided`, {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                      });
                    } else if (
                      password.new_password != password.confirm_new_password
                    ) {
                      toast.error(`New passwords do not match`, {
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
                      password_mutation.mutate();
                    }
                  }}
                >
                  Save
                </Button>
              </DialogClose>
              </CardFooter>
            </Card>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  ); 
}
