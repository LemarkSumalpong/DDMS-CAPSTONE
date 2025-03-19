import { StaffDocumentsAPI, DocumentType } from "@/components/API";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

export default function StaffDocumentsPage() {
  const queryClient = useQueryClient();
  const [search_term, setSearchTerm] = useState("");
  const [page_number, setPageNumber] = useState(1);
  const [documentMonth, setDocumentMonth] = useState<string | undefined>();
  const [document_year, setDocumentYear] = useState<string>("");
  const [documentType, setDocumentType] = useState<string | undefined>("Others");
  const [sortField, setSortField] = useState("id"); // Default sort field
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const documents = useQuery({
    queryKey: ["staff_documents", { search_term, page_number, documentMonth, document_year, documentType, sortField, sortDirection }],
    queryFn: async () => {
      const data = await StaffDocumentsAPI(
        encodeURIComponent(search_term),
        page_number,
        documentMonth,
        document_year,
        documentType,
        sortField,
        sortDirection
      );
      return data;
    },
  });

  useEffect(() => {
    queryClient.refetchQueries({ queryKey: ["staff_documents"] });
  }, [search_term, queryClient]);

  useEffect(() => {
    queryClient.refetchQueries({ queryKey: ["staff_documents"] });
  }, [page_number, queryClient]);

  useEffect(() => {
    // Trigger the query to refetch whenever filters or page number change
    documents.refetch();
  }, [search_term, documentMonth, document_year, documentType, sortField, sortDirection, page_number, queryClient]);

  if (documents.isLoading || documents.data === undefined) {
    return <LoadingPage />;
  }
  if (documents.isError) {
    return (
      <ErrorPage
        statusCode={400}
        errorMessage="Failed to fetch documents. Please try again later."
      />
    );
  }

  // Handle filter changes
  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDocumentMonth(e.target.value);
  };


  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDocumentType(e.target.value);
  };

  // Handle sorting change
  const handleSortChange = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const distinctYears = [
    ...new Set(documents.data?.results.map((doc: { document_year: string }) => doc.document_year)),
  ];

  return (
    <div className="flex h-screen w-full bg-gray-100 p-6">
      <div className="container mx-auto max-w-full bg-white border rounded-lg shadow-lg flex flex-col">
       <div className="flex justify-between p-3 space-x-4 bg-white shadow-md rounded-md">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 flex-1">
         Central Documents
        </h1>

        <div className="flex items-center space-x-4">
         <div className="flex items-center space-x-2">
        <Label htmlFor="name">Search</Label>
        <Input
         value={search_term}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setSearchTerm(e.target.value);
            }}
            placeholder="Search..."
              className="px-4 py-2 border border-navy-300 rounded-full bg-white text-sm text-navy-700 placeholder-navy-400 
              focus:outline-none focus:ring-2 focus:ring-navy-600 focus:border-navy-600 transition-all duration-300 shadow-sm hover:shadow-md"
            />
         </div>

          {/* Month Filter */}
          <div className="flex items-center space-x-2">
          <label className="text-gray-700 text-xs sm:text-sm">Month: </label>
            <select onChange={handleMonthChange}
             value={documentMonth}
              className="px-4 py-2 rounded-full border border-navy-600 bg-navy-100 text-sm text-navy-900 
              focus:outline-none focus:ring-2 focus:ring-navy-600 focus:border-navy-600 hover:bg-navy-200 transition-all duration-300">
              <option value="">All Months</option>
              <option value="January">January</option>
              <option value="February">February</option>
              <option value="March">March</option>
              <option value="April">April</option>
              <option value="May">May</option>
              <option value="June">June</option>
              <option value="July">July</option>
              <option value="August">August</option>
              <option value="September">September</option>
              <option value="October">October</option>
              <option value="November">November</option>
              <option value="December">December</option>
            </select>
          </div>

            <div className="flex items-center space-x-2">
            <Label htmlFor="document_year"
            className="text-gray-700 text-xs sm:text-sm">Year</Label>
            <select
              id="document_year"
              value={document_year}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                setDocumentYear(e.target.value);
                setPageNumber(1); // Reset to first page when year changes
              }}
              className="px-4 py-2 rounded-full border border-navy-600 bg-navy-100 text-sm text-navy-900 focus:outline-none 
                  focus:ring-2 focus:ring-navy-600 focus:border-navy-600 hover:bg-navy-200 transition-all duration-300"
            >
              <option value="">All Years</option>
              {distinctYears.map((year: string) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Document Type Filter */}
          <div className="flex items-center space-x-2">
            <Label className="text-gray-700 text-xs sm:text-sm">Document Type: </Label>
            <select onChange={handleTypeChange} value={documentType}
             className="px-4 py-2 rounded-full border border-navy-600 bg-navy-100 text-sm text-navy-900 focus:outline-none 
             focus:ring-2 focus:ring-navy-600 focus:border-navy-600 hover:bg-navy-200 transition-all duration-300">
              <option value="All"> All</option>
              <option value="Memorandum">Memorandum</option>
              <option value="Special Orders">Special Orders</option>
              <option value="Others">Others</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden scrollbar-hide flex flex-col" 
        style={{ minHeight: "calc(100vh - 150px)" }}>  
      <div className="overflow-auto scrollbar-hide">    
      <Table className="min-w-full sm:min-w-[1000px] text-base text-gray-800 bg-white border border-gray-300">
       <TableHeader className="sticky top-0 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <TableRow>
            <TableHead className="text-left text-white text-sm cursor-pointer"
             onClick={() => handleSortChange("id")}>ID</TableHead>

            <TableHead className="text-center text-white text-sm cursor-pointer"
             onClick={() => handleSortChange("name")}>File Name</TableHead>
            <TableHead className="text-center text-white text-sm cursor-pointer"
             onClick={() => handleSortChange("document_type")}>Type</TableHead>
            <TableHead className="text-center text-white text-sm "
            >Link</TableHead>
            <TableHead className="text-center text-white text-sm cursor-pointer"
             onClick={() => handleSortChange("sent_from")}>Sent From</TableHead>

            <TableHead className="text-center text-white text-sm cursor-pointer"
             onClick={() => handleSortChange("document_month")}>Document Month</TableHead>

            <TableHead className="text-center text-white text-sm cursor-pointer"
             onClick={() => handleSortChange("document_year")}>Document Year</TableHead>

            <TableHead className="text-center text-white text-sm cursor-pointer"
             onClick={() => handleSortChange("subject")}>
              Subject</TableHead>

            <TableHead className="text-center text-white text-sm cursor-pointer">
              Date Uploaded</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
            {documents.data.results.map((document: DocumentType) => (
              <TableRow key={document.id}>
                <TableCell className="text-left text-sm">
                  {document.id}
                </TableCell>
                <TableCell className="text-center text-sm">
                  {document.name}</TableCell>
                <TableCell className="text-center text-sm">
                  {document.document_type}
                </TableCell>
                <TableCell className="text-center text-sm">
                  {document.file ? (
                    <a href={document.file}>Preview</a>
                  ) : (
                    <p>Not available</p>
                  )}
                </TableCell>
                <TableCell className="text-center text-sm">
                  {document.sent_from}
                </TableCell>
                <TableCell className="text-center text-sm">
                  {document.document_month}
                </TableCell>
                <TableCell className="text-center text-sm">
                  {document.document_year}
                </TableCell>
                <TableCell className="text-center text-sm">
                  {document.subject}</TableCell>
                <TableCell className="text-center text-sm">
                  {document.date_uploaded}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          
        </Table>
        </div>
        <TableFooter>
           <div className="flex justify-end items-center space-x-3 p-4 bg-white border-t ml-auto">
         
              <div className="flex flex-row items-center space-x-1.5">
                <p>Page: {page_number}</p>
                <Button
                  className="px-4 py-2 border rounded-full border-blue-900 bg-blue-900 text-white text-xs sm:text-sm  
                            hover:bg-gray-100 hover:border-gray-400 hover:text-gray-900 
                            focus:outline-none transition duration-200"
                  onClick={() => {
                    if (page_number > 1) setPageNumber(page_number - 1);
                  }}
                >
                  Back
                </Button>
                <Button
                  className="px-4 py-2 border rounded-full border-blue-900 bg-blue-900 text-white text-xs sm:text-sm  
                            hover:bg-gray-100 hover:border-gray-400 hover:text-gray-900 
                            focus:outline-none transition duration-200"
                  onClick={() => {
                    if (documents.data.next) setPageNumber(page_number + 1);
                  }}
                >
                  Next
                </Button>
              </div> 
            </div>   
              {!documents.data.next && (
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
