import {
  AdminUserUpdateType,
  UserDeleteAPI,
  UsersAPI,
  UserType,
  AdminUserUpdateAPI,
} from "@/components/API";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import LoadingPage from "./LoadingPage";
import ErrorPage from "./ErrorPage";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
  TableFooter,
} from "@/components/ui/table";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export default function AdminUsersPage() {
  const [search_term, setSearchTerm] = useState("");
  const queryClient = useQueryClient();
  const users = useQuery({
    queryKey: ["users"],
    queryFn: UsersAPI,
  });
  const [selected_user, setSelectedUser] = useState<AdminUserUpdateType>({
    role: "",
  });
  const delete_mutation = useMutation({
    mutationFn: async (id: number) => {
      const data = await UserDeleteAPI(id);
      if (data[0] != true) {
        return Promise.reject(new Error(JSON.stringify(data[1])));
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast(`User deleted successfuly`, {
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
      toast(`An error occured. Unable to delete user ${String(error)}`, {
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
    mutationFn: async (id: number) => {
      const data = await AdminUserUpdateAPI(id, selected_user);
      if (data[0] != true) {
        return Promise.reject(new Error(JSON.stringify(data[1])));
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast(`User updated successfuly`, {
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
      toast(
        `An error occured while trying to updating the user ${String(error)}`,
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
  if (users.isLoading || !users.data) {
    return <LoadingPage />;
  }
  if (users.isError) {
    return (
      <ErrorPage
        statusCode={400}
        errorMessage="Failed to fetch users. Please try again later."
      />
    );
  }

  return (
    <div className="flex h-screen w-full bg-gray-100 p-6">
    <div className="container mx-auto max-w-full bg-white border rounded-lg shadow-lg flex flex-col">
    <div className="flex justify-between p-3 space-x-4 bg-white shadow-md rounded-md">
    <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 flex-1">
          Manage User
      </h1>
      <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="name">Search</Label>
            <Input
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchTerm(e.target.value)
              }
                placeholder="Search..."
                className="px-4 py-2 border border-navy-300 rounded-full bg-white text-sm text-navy-700 placeholder-navy-400 
                focus:outline-none focus:ring-2 focus:ring-navy-600 focus:border-navy-600 transition-all duration-300 shadow-sm hover:shadow-md"
            />
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-hidden scrollbar-hide flex flex-col" 
        style={{ minHeight: "calc(100vh - 150px)" }}>
      <div className="overflow-auto scrollbar-hide"> 
      <Table className="w-full">
        <TableHeader className="sticky top-0 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <TableRow>
            <TableHead className="text-center text-white text-sm cursor-pointer">ID</TableHead>
            <TableHead className="text-center text-white text-sm cursor-pointer">Email</TableHead>
            <TableHead className="text-center text-white text-sm cursor-pointer">Full Name</TableHead>
            <TableHead className="text-center text-white text-sm cursor-pointer">Actions</TableHead>
            <TableHead className="text-center text-white text-sm cursor-pointer">Role</TableHead>
            <TableHead className="text-center text-white text-sm cursor-pointer" >Sex</TableHead>
            <TableHead className="text-center text-white text-sm cursor-pointer">Birthday</TableHead>
            <TableHead className="text-center text-white text-sm cursor-pointer">Age</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.data
            .filter(
              (user: UserType) =>
                search_term.includes(String(user.id)) ||
                user.username ||
                "".toLowerCase().includes(search_term.toLowerCase()) ||
                user.email ||
                "".toLowerCase().includes(search_term.toLowerCase()) ||
                user.first_name ||
                "".toLowerCase().includes(search_term.toLowerCase()) ||
                user.last_name ||
                "".toLowerCase().includes(search_term.toLowerCase()) ||
                user.full_name
                  .toLowerCase()
                  .includes(search_term.toLowerCase()) ||
                user.role ||
                "".toLowerCase().includes(search_term.toLowerCase()) ||
                user.sex ||
                "".toLowerCase().includes(search_term.toLowerCase()) ||
                search_term.includes(String(user.age))
            )
            .map((user: UserType) => (
              <TableRow key={user.id}>
                <TableCell className="text-center text-sm">
                  {user.id}
                </TableCell>
                <TableCell  className="text-center text-sm">{user.email}</TableCell>
                <TableCell  className="text-center text-sm">{user.full_name}</TableCell>
                <TableCell  className="text-center text-sm">
                  <div className="flex-col space-x-1.5">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          onClick={() =>
                            setSelectedUser({
                              role: user.role,
                            })
                          }
                        >
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px] sm:max-h-[640px] overflow-y-scroll">
                        <DialogHeader>
                          <DialogTitle>Edit User</DialogTitle>
                          <DialogDescription>
                            Make changes to the user here. Click save when
                            you're done.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col space-y-1.5">
                          <Label htmlFor="name">Role</Label>
                          <Select
                            defaultValue={selected_user.role}
                            value={selected_user.role}
                            onValueChange={(value) =>
                              setSelectedUser({
                                ...selected_user,
                                role: value,
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent position="popper">
                              <SelectItem value="client">Client</SelectItem>
                              <SelectItem value="planning">Planning</SelectItem>
                              <SelectItem value="staff">Staff</SelectItem>
                              <SelectItem value="head">Head</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button
                              onClick={() => update_mutation.mutate(user.id)}
                              type="submit"
                            >
                              Save changes
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Button onClick={() => delete_mutation.mutate(user.id)}>
                      Delete
                    </Button>
                  </div>
                </TableCell>
                <TableCell  className="text-center text-sm">{user.role}</TableCell>
                <TableCell  className="text-center text-sm">{user.sex}</TableCell>
                <TableCell  className="text-center text-sm">{user.birthday}</TableCell>
                <TableCell  className="text-center text-sm">{user.age}</TableCell>
              </TableRow>
            ))}
        </TableBody>
        
      </Table>
      <TableFooter>
          <TableRow>
            <TableCell colSpan={9}>Total</TableCell>
            <TableCell className="text-right">
              {users.data
                ? users.data.filter(
                    (user: UserType) =>
                      search_term.includes(String(user.id)) ||
                      user.username ||
                      "".toLowerCase().includes(search_term.toLowerCase()) ||
                      user.email ||
                      "".toLowerCase().includes(search_term.toLowerCase()) ||
                      user.first_name ||
                      "".toLowerCase().includes(search_term.toLowerCase()) ||
                      user.last_name ||
                      "".toLowerCase().includes(search_term.toLowerCase()) ||
                      user.full_name
                        .toLowerCase()
                        .includes(search_term.toLowerCase()) ||
                      user.role ||
                      "".toLowerCase().includes(search_term.toLowerCase()) ||
                      user.sex ||
                      "".toLowerCase().includes(search_term.toLowerCase()) ||
                      search_term.includes(String(user.age))
                  ).length
                : 0}
            </TableCell>
          </TableRow>
        </TableFooter>
      </div>
      </div>
      </div>
    </div>
  );
}
