import {
  AuthorizationRequestUpdateType,
  AuthorizationRequestUpdateAPI,
  AuthorizationRequestsAPI,
  AuthorizationRequestType,
  AuthorizationRequestUnitUpdateAPI,
  AuthorizationRequestUnitUpdateType,
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
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

import { toast } from "react-toastify";
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
import { Link } from "react-router";
import { Separator } from "@/components/ui/separator";
export default function HeadAuthorizationRequestsPage() {
  const [error, setError] = useState("");
  const queryClient = useQueryClient();
  const update_unit_mutation = useMutation({
    mutationFn: async ({
      authorization_request_unit,
      id,
    }: {
      authorization_request_unit: AuthorizationRequestUnitUpdateType;
      id: number;
    }) => {
      const data = await AuthorizationRequestUnitUpdateAPI(
        authorization_request_unit,
        id
      );
      if (data[0] != true) {
        return Promise.reject(new Error(JSON.stringify(data[1])));
      }
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["authorization_requests"] });
      setError("");
      toast(
        `Request unit updated successfuly,  ${
          typeof data[1] == "object" ? "ID:" + data[1].id : ""
        }`,
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
    onError: (error) => {
      setError(String(error));
    },
  });
  const update_mutation = useMutation({
    mutationFn: async ({
      authorization_request,
      id,
    }: {
      authorization_request: AuthorizationRequestUpdateType;
      id: number;
    }) => {
      const data = await AuthorizationRequestUpdateAPI(
        authorization_request,
        id
      );
      if (data[0] != true) {
        return Promise.reject(new Error(JSON.stringify(data[1])));
      }
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["authorization_requests"] });
      setError("");
      toast(
        `Request updated   successfuly,  ${
          typeof data[1] == "object" ? "ID:" + data[1].id : ""
        }`,
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
    onError: (error) => {
      setError(String(error));
    },
  });
  const [search_term, setSearchTerm] = useState("");
  const [view_pending_only] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [sortField, setSortField] = useState("id"); // Default sort field
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc"); // Default direction is ascending
  const [startDate, setStartDate] = useState<string | null>(null); // For start date
  const [endDate, setEndDate] = useState<string | null>(null); // For end date
  const [statusFilter, setStatusFilter] = useState<string>(""); // For filtering status

  const authorization_requests = useQuery({
    queryKey: ["authorization_requests", sortField, sortDirection, startDate, endDate, statusFilter],
    queryFn: async () => {
      const data = await AuthorizationRequestsAPI(
        encodeURIComponent(search_term),
        pageNumber,
        sortField,
        sortDirection,
        startDate,
        endDate,
        statusFilter
      );
      return data;
    }
  });
    useEffect (() => {
      queryClient.refetchQueries({queryKey: ["authorization_requests"]});
    }, [search_term, queryClient]);

    useEffect (() => {
      queryClient.refetchQueries({queryKey: ["authorization_requests"]});
    }, [pageNumber, queryClient]);

    useEffect(() => {
      queryClient.refetchQueries({ queryKey: ["authorization_requests"] });
    }, [startDate, endDate, statusFilter, queryClient]);

  
  const [selected_authorization_request, setSelectedAuthorizationRequest] =
    useState<AuthorizationRequestUpdateType>({
      status: "denied",
      remarks: "",
    });
  if (authorization_requests.isLoading || !authorization_requests.data) {
    return <LoadingPage />;
  }
  if (authorization_requests.isError) {
    return (
      <ErrorPage
        statusCode={400}
        errorMessage="Failed to fetch document requests. Please try again later."
      />
    );
  }

  // Handle sorting change
  const handleSortChange = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleDateChange = (field: "start" | "end", value: string) => {
    if (field === "start") {
      setStartDate(value);
    } else {
      setEndDate(value);
    }
  };

  // Clear start date
  const clearStartDate = () => {
    setStartDate(null);
  };

  // Clear end date
  const clearEndDate = () => {
    setEndDate(null);
  };

  // Handle status change
const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  setStatusFilter(e.target.value);
};


  const filteredResults = authorization_requests.data.results.filter(
    (authorization_requests: AuthorizationRequestType) =>
    (view_pending_only ? authorization_requests.status === "pending" : true) &&
    (search_term === "" ||
      authorization_requests.requester.toLowerCase().includes(search_term.toLowerCase()) ||
      authorization_requests.college.toLowerCase().includes(search_term.toLowerCase()) ||
      authorization_requests.purpose.toLowerCase().includes(search_term.toLowerCase()) ||
      authorization_requests.status.toLowerCase().includes(search_term.toLowerCase()) ||
      authorization_requests.remarks?.toLowerCase().includes(search_term.toLowerCase()))
  );

  return (
    <div className="flex h-screen w-full bg-gray-100 p-6">
     <div className="container mx-auto max-w-full bg-white border rounded-lg shadow-lg flex flex-col">
     <div className="flex justify-between p-3 space-x-4 bg-white shadow-md rounded-md">
      <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 flex-1">
            Authentication Requests
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

          <div className="flex items-center space-x-2">
          <label className="text-gray-700 text-xs sm:text-sm">Status</label>
            <select value={statusFilter} onChange={handleStatusChange}
            className="px-4 py-2 rounded-full border border-navy-600 bg-navy-100 text-sm text-navy-900 
            focus:outline-none focus:ring-2 focus:ring-navy-600 focus:border-navy-600 hover:bg-navy-200 transition-all duration-300"
          >
              <option value="">All</option>
              <option value="claimed">Claimed</option>
              <option value="unclaimed">Unclaimed</option>
              <option value="pending">Pending</option>
              <option value="deny">Denied</option>
              <option value="approved">Approved</option>
            </select>
           </div>
      
           <div className="flex items-center space-x-2">
            <Label htmlFor="startDate" className="text-gray-700 text-xs sm:text-sm">
              From
            </Label>
            <input
              type="date"
              value={startDate || ""}
              onChange={(e) => handleDateChange("start", e.target.value)}
               className="px-4 py-2 rounded-full border border-navy-600 bg-navy-100 text-sm text-navy-900 focus:outline-none 
               focus:ring-2 focus:ring-navy-600 focus:border-navy-600 hover:bg-navy-200 transition-all duration-300"
            />
            <button
               className="px-4 py-2 rounded-full border border-navy-600 bg-navy-100 text-sm text-navy-900 focus:outline-none 
                focus:ring-2 focus:ring-navy-600 focus:border-navy-600 hover:bg-navy-200 transition-all duration-300"
              onClick={clearStartDate}
            >
              Clear
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-gray-700 text-xs sm:text-sm">To</label>
            <input
              type="date"
              value={endDate || ""}
              onChange={(e) => handleDateChange("end", e.target.value)}
              className="px-4 py-2 rounded-full border border-navy-600 bg-navy-100 text-sm text-navy-900 focus:outline-none 
                focus:ring-2 focus:ring-navy-600 focus:border-navy-600 hover:bg-navy-200 transition-all duration-300"
            />
            <button
               className="px-4 py-2 rounded-full border border-navy-600 bg-navy-100 text-sm text-navy-900 focus:outline-none
                focus:ring-2 focus:ring-navy-600 focus:border-navy-600 hover:bg-navy-200 transition-all duration-300"
              onClick={clearEndDate}
            >
              Clear
            </button>
          </div>
         </div>
        </div>
      <Label className="text-red-600 w-max">{error}</Label>

      <div className="flex-1 overflow-hidden scrollbar-hide flex flex-col" 
        style={{ minHeight: "calc(100vh - 150px)" }}>
      <div className="overflow-auto scrollbar-hide"> 

      <Table className="w-full">
      <TableHeader className="sticky top-0 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
       <TableRow>
            <TableHead className="text-center text-white text-sm cursor-pointer" 
              onClick={() => handleSortChange("id")}>
            ID</TableHead>
            <TableHead className="text-center text-white text-sm cursor-pointer"
            onClick={() => handleSortChange("requester")}>
              Requester
              </TableHead>
            <TableHead className="text-center text-white text-sm cursor-pointer"
            onClick={() => handleSortChange("college")}>
              College
            </TableHead>
            <TableHead className="text-center text-white text-sm cursor-pointer"
            onClick={() => handleSortChange("purpose")}>
              Purpose
            </TableHead>
            <TableHead className="text-center text-white text-sm cursor-pointer"
             onClick={() => handleSortChange("status")}>
              Status
            </TableHead>
            <TableHead className="text-center text-white text-sm cursor-pointer">
             Documents Requested
            </TableHead>
            <TableHead className="text-center text-white text-sm cursor-pointer">
              Remarks
            </TableHead>
            <TableHead className="text-center text-white text-sm cursor-pointer">
              Date Requested
            </TableHead>
            <TableHead className="text-center text-white text-sm cursor-pointer">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
            {filteredResults.map((authorization_request: AuthorizationRequestType) => (
              <TableRow key={authorization_request.id}>
                <TableCell className="text-center text-sm">
                  {authorization_request.id}
                </TableCell>
                <TableCell className="text-center text-sm">
                  {authorization_request.requester}
                </TableCell>
                <TableCell className="text-center text-sm">
                  {authorization_request.college}
                </TableCell>
                <TableCell className="text-center text-sm">
                  {authorization_request.purpose}
                </TableCell>
                <TableCell className="text-center text-sm">
                  {authorization_request.status + " "}
                  {authorization_request.status == "pending"
                    ? `(${
                        authorization_request.documents.filter(
                          (document) => document.status == "pending"
                        ).length
                      }/${authorization_request.documents.length} pending)`
                    : ""}
                </TableCell>
                <TableCell className="text-center text-sm">
                  <Dialog>
                    <DialogTitle hidden={true}>View</DialogTitle>
                    <DialogTrigger asChild>
                      <Button variant="outline">View</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl w-full max-h-80 overflow-y-auto scrollbar-hide">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-left">
                              Document
                            </TableHead>
                            <TableHead className="text-center">Pages</TableHead>
                            <TableHead className="text-center">Copies</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="text-center">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody className="overflow-y-scroll h-10">
                          {authorization_request.documents.map((document) => (
                            <TableRow key={document.id}>
                              <TableCell className="text-center font-medium">
                                {document.document}
                              </TableCell>
                              <TableCell className="text-center font-medium">
                                {document.pages}
                              </TableCell>
                              <TableCell className="text-center font-medium">
                                {document.copies}
                              </TableCell>
                              <TableCell className="text-center font-medium">
                                {document.status}
                              </TableCell>
                              <TableCell className="text-left font-medium">
                                {authorization_request.status == "pending" ? (
                                  <Button
                                    onClick={() =>
                                      update_unit_mutation.mutate({
                                        authorization_request_unit: {
                                          status: "checked",
                                        },
                                        id: document.id,
                                      })
                                    }
                                  >
                                    Set as Checked
                                  </Button>
                                ) : (
                                  <></>
                                )}
                              </TableCell>
                             
                            </TableRow>
                          ))}
                        </TableBody>
                        <TableFooter>
                          <TableRow>
                            <TableCell colSpan={4}>Total</TableCell>
                            <TableCell className="text-right">
                              {authorization_request.documents
                                ? authorization_request.documents.length
                                : 0}
                            </TableCell>
                          </TableRow>
                        </TableFooter>
                      </Table>
                    </DialogContent>
                  </Dialog>
                </TableCell>
                <TableCell className="text-center text-sm">
                  {authorization_request.remarks}
                </TableCell>
                <TableCell className="text-center text-sm">
                  {authorization_request.date_requested}
                </TableCell>
                <TableCell className="text-center text-sm">
                  {authorization_request.status == "approved" ? (
                    <div className="flex-col space-y-5">
                      <Button
                        className="w-full"
                        onClick={() =>
                          update_mutation.mutate({
                            authorization_request: {
                              status: "claimed",
                              remarks: "",
                            },
                            id: authorization_request.id,
                          })
                        }
                        type="submit"
                      >
                        Set as Claimed
                      </Button>
                      <Button
                        className="w-full"
                        onClick={() =>
                          update_mutation.mutate({
                            authorization_request: {
                              status: "unclaimed",
                              remarks: "",
                            },
                            id: authorization_request.id,
                          })
                        }
                        type="submit"
                      >
                        Set as Unclaimed
                      </Button>
                      <Separator />
                      <Link
                        className="w-full"
                        to="/export/CRS03/"
                        state={{ authorization_request: authorization_request }}
                      >
                        <Button className="w-full">Export to CSR-03</Button>
                      </Link>
                    </div>
                  ) : (
                    <></>
                  )}
                  {authorization_request.status == "unclaimed" ? (
                    <div className="flex-col space-y-5">
                      <Button
                        className="w-full"
                        onClick={() =>
                          update_mutation.mutate({
                            authorization_request: {
                              status: "claimed",
                              remarks: "",
                            },
                            id: authorization_request.id,
                          })
                        }
                        type="submit"
                      >
                        Set as Claimed
                      </Button>
                      <Separator />
                      <Link
                        className="w-full"
                        to="/export/CRS03/"
                        state={{ authorization_request: authorization_request }}
                      >
                        <Button className="w-full">Export to CSR-03</Button>
                      </Link>
                    </div>
                  ) : (
                    <></>
                  )}
                  {authorization_request.status == "pending" ? (
                    <div className="flex-col space-y-5">
                      <Dialog>
                        <DialogTrigger asChild className="w-full">
                          <Button
                            onClick={() =>
                              setSelectedAuthorizationRequest({
                                status: "denied",
                                remarks: "",
                              })
                            }
                          >
                            Deny
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Deny Request</DialogTitle>
                            <DialogDescription>
                              Provide remarks as to why the request has been
                              denied. Click deny when you're done.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="name">Remarks</Label>
                            <Input
                              value={selected_authorization_request.remarks}
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) => {
                                setSelectedAuthorizationRequest({
                                  ...selected_authorization_request,
                                  remarks: e.target.value,
                                });
                              }}
                              placeholder={"Provide a reason here"}
                            />
                          </div>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button
                                onClick={() =>
                                  update_mutation.mutate({
                                    authorization_request:
                                      selected_authorization_request,
                                    id: authorization_request.id,
                                  })
                                }
                                type="submit"
                              >
                                Deny
                              </Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Separator />
                      <Link
                        className="w-full"
                        to="/export/CRS03/"
                        state={{ authorization_request: authorization_request }}
                      >
                        <Button className="w-full">Export to CSR-03</Button>
                      </Link>
                    </div>
                  ) : (
                    <></>
                  )}
                  {["claimed", "denied"].includes(
                    authorization_request.status
                  ) ? (
                    <Link
                      className="w-full"
                      to="/export/CRS03/"
                      state={{ authorization_request: authorization_request }}
                    >
                      <Button className="w-full">Export to CSR-03</Button>
                    </Link>
                  ) : undefined}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table> 
      </div>   
      <TableFooter>
           <div className="flex justify-end items-center space-x-3 p-4 bg-white border-t ml-auto">
         
              <div className="flex flex-row items-center space-x-1.5">
                <p>Page: {pageNumber}</p>
                <Button
                  className="px-4 py-2 border rounded-full border-blue-900 bg-blue-900 text-white text-xs sm:text-sm  
                            hover:bg-gray-100 hover:border-gray-400 hover:text-gray-900 
                            focus:outline-none transition duration-200"
                  onClick={() => {
                    if (pageNumber > 1) setPageNumber(pageNumber - 1);
                  }}
                >
                  Back
                </Button>
                <Button
                  className="px-4 py-2 border rounded-full border-blue-900 bg-blue-900 text-white text-xs sm:text-sm  
                            hover:bg-gray-100 hover:border-gray-400 hover:text-gray-900 
                            focus:outline-none transition duration-200"
                  onClick={() => {
                    if (authorization_requests.data.next) setPageNumber(pageNumber + 1);
                  }}
                >
                  Next
                </Button>
              </div> 
            </div>   
              {!authorization_requests.data.next && (
                <p className="text-xs text-gray-600   text-center  px-4 py-2  sm:text-sm   ">
                  You are on the last page
                </p>
              )}
        </TableFooter> 
      </div>
      </div>
    </div>
  );
}
