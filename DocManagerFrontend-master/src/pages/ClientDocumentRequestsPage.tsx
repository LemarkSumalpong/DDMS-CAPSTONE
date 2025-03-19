import {
  DocumentRequestsAPI,
  DocumentRequestType,
  DocumentRequestUnitType,
} from "@/components/API";
import { useQuery, useQueryClient} from "@tanstack/react-query";
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
import { useState,useEffect } from "react";
import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
export default function ClientDocumentRequestsPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [search_term, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [view_pending_only] = useState(false);
  const [sortField, setSortField] = useState("id"); // Default sort field
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc"); // Default direction is ascending
  const [startDate, setStartDate] = useState<string | null>(null); // For start date
  const [endDate, setEndDate] = useState<string | null>(null); // For end date
  const [statusFilter, setStatusFilter] = useState<string>("");
  const document_requests = useQuery({
    queryKey: ["client_document_requests", sortField, sortDirection, startDate, endDate, statusFilter],
    queryFn: async () => {
      const data = await DocumentRequestsAPI(
        encodeURIComponent (search_term),
        pageNumber,
        sortField,
        sortDirection,
        startDate,
        endDate,
        statusFilter
      );
      return data;
    },
  });

  useEffect(() => {
    queryClient.refetchQueries({queryKey: ["client_document_requests"]});
  }, [search_term, queryClient]);

  useEffect(() => {
    queryClient.refetchQueries({queryKey: ["client_document_requests"]});
  }, [pageNumber, queryClient]);

  useEffect(() => {
    queryClient.refetchQueries({ queryKey: ["head_document_requests"] });
  }, [startDate, endDate, statusFilter, queryClient]);


  if (document_requests.isLoading || !document_requests.data) {
    return <LoadingPage />;
  }
  if (document_requests.isError) {
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

  const filteredResults = document_requests.data.results.filter(
    (document_requests:DocumentRequestType) =>
      (documentRequest: DocumentRequestType) =>
       (view_pending_only ? documentRequest.status === "pending" : true) &&
    (search_term === "" ||
      document_requests.requester.toLowerCase().includes(search_term.toLowerCase()) ||
      document_requests.college.toLowerCase().includes(search_term.toLowerCase()) ||
      document_requests.purpose.toLowerCase().includes(search_term.toLowerCase()) ||
      document_requests.status.toLowerCase().includes(search_term.toLowerCase()) ||
      document_requests.type.toLowerCase().includes(search_term.toLowerCase()) ||
      document_requests.date_requested.toLowerCase().includes(search_term.toLowerCase()))
    );

  return (
    <div className="flex h-screen w-full bg-gray-100 p-6">
     <div className="container mx-auto max-w-full bg-white border rounded-lg shadow-lg flex flex-col">
      <div className="flex justify-between p-3 space-x-4 bg-white shadow-md rounded-md">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 flex-1">
          Document Requested
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
                <select
                  value={statusFilter}
                  onChange={handleStatusChange}
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

            <div className="flex-1 overflow-hidden scrollbar-hide flex flex-col" 
              style={{ minHeight: "calc(100vh - 150px)" }}>
              <div className="overflow-auto scrollbar-hide"> 
                <Table className="min-w-full sm:min-w-[1000px] text-base text-gray-800 bg-[#E3F2FD] border border-gray-300">
                <TableHeader className="sticky top-0 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
              <TableRow>
                <TableHead className="text-center text-white text-sm cursor-pointer"
                  onClick={() => handleSortChange("id")}>ID
                  </TableHead>
                  <TableHead className="text-center text-white text-sm cursor-pointer" 
                  onClick={() => handleSortChange("requester")}>Requester
                  </TableHead>
                  <TableHead className="text-center text-white text-sm cursor-pointer"
                  onClick={() => handleSortChange("college")}>College
                  </TableHead>
                  <TableHead className="text-center text-white text-sm cursor-pointer"
                  onClick={() => handleSortChange("purpose")}>Purpose
                  </TableHead>
                  <TableHead className="text-center text-white text-sm cursor-pointer"
                  onClick={() => handleSortChange("status")}>Status
                  </TableHead>
                  <TableHead className="text-center text-white text-sm">
                    Documents Requested
                  </TableHead>
                  <TableHead className="text-center text-white text-sm">
                    Remarks
                  </TableHead>
                  <TableHead className="text-center text-white text-sm r">
                    Type
                  </TableHead>
                  <TableHead className="text-center text-white text-sm">
                    Date Requested
                  </TableHead>
                </TableRow>
                </TableHeader>
              <TableBody>
             {filteredResults.map((document_request: DocumentRequestType) => (
              <TableRow key={document_request.id}>
                <TableCell className="text-left text-sm">
                  {document_request.id}
                </TableCell>
                <TableCell className="text-left text-sm">
                  {document_request.requester}
                </TableCell>
                <TableCell className="text-left text-sm">
                  {document_request.college}
                </TableCell>
                <TableCell className="text-left text-sm">
                  {document_request.purpose}
                </TableCell>
                <TableCell className="text-left text-sm">
                  {document_request.status}
                </TableCell>
                <TableCell className="text-left text-sm">
                  <Dialog>
                    <DialogTitle hidden={true}>View</DialogTitle>
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => {
                          if (
                            !document_request.questionnaire &&
                            document_request.status == "approved"
                          ) {
                            toast(
                              "Please take the survey to view your documents",
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
                            navigate(
                              `/questionnaires/create/${document_request.id}`
                            );
                          }
                        }}
                        variant="outline"
                      >
                        View
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl w-full max-h-80 overflow-y-auto scrollbar-hide">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-left">ID</TableHead>
                            <TableHead className="text-left">
                              File Name
                            </TableHead>
                            <TableHead className="text-left">Type</TableHead>
                            <TableHead
                              className={
                                document_request.status == "approved"
                                  ? "text-left"
                                  : "text-right"
                              }
                            >
                              Copies
                            </TableHead>
                            {document_request.status == "approved" ? (
                              <TableHead className="text-right">Link</TableHead>
                            ) : (
                              <></>
                            )}
                          </TableRow>
                        </TableHeader>
                        <TableBody className="overflow-y-scroll h-10">
                          {document_request.documents.map(
                            (
                              document_request_unit: DocumentRequestUnitType
                            ) => (
                              <TableRow key={document_request_unit.id}>
                                <TableCell className="text-left font-medium">
                                  {document_request_unit.id}
                                </TableCell>
                                <TableCell className="text-left font-medium">
                                  {document_request_unit.document.name}
                                </TableCell>
                                <TableCell className="text-left font-medium">
                                  {document_request_unit.document.document_type}
                                </TableCell>
                                <TableCell
                                  className={
                                    document_request.status == "approved"
                                      ? "text-left font-medium"
                                      : "text-right font-medium"
                                  }
                                >
                                  {document_request_unit.copies}
                                </TableCell>
                                {document_request.status == "approved" ? (
                                  <TableCell className="text-right font-medium">
                                    <a
                                      href={document_request_unit.document.file}
                                    >
                                      Preview
                                    </a>
                                  </TableCell>
                                ) : (
                                  <></>
                                )}
                              </TableRow>
                            )
                          )}
                        </TableBody>
                        <TableFooter>
                          <TableRow>
                            <TableCell
                              colSpan={
                                document_request.status == "approved" ? 4 : 3
                              }
                            >
                              Total
                            </TableCell>
                            <TableCell className="text-right">
                              {document_request.documents
                                ? document_request.documents.length
                                : 0}
                            </TableCell>
                          </TableRow>
                        </TableFooter>
                      </Table>
                    </DialogContent>
                  </Dialog>
                </TableCell>
                <TableCell className="text-left text-sm">
                  {document_request.type}
                </TableCell>
                <TableCell className="text-left text-sm">
                  {document_request.remarks}
                </TableCell>
                <TableCell className="text-left text-sm">
                  {document_request.date_requested}
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
                    if (document_requests.data.next) setPageNumber(pageNumber + 1);
                  }}
                >
                  Next
                </Button>
              </div> 
            </div>   
              {!document_requests.data.next && (
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
