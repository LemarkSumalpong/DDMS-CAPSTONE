import { QuestionnairesAPI, QuestionnaireType } from "@/components/API";
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
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
export default function PlanningQuestionnairesPage() {
  const queryClient = useQueryClient();
  const [pageNumber, setPageNumber] = useState(1);
  const [search_term, setSearchTerm] = useState("");
  const [isAscending, setIsAscending] = useState(true);
  const [sortedField, setSortedField] = useState<keyof QuestionnaireType | null>(null);
  const questionnaires = useQuery({
    queryKey: ["questionnaires"],
    queryFn: async () => {
      const data = await QuestionnairesAPI(  
         encodeURIComponent(search_term),
        pageNumber
      );
      return data;
    },
  });
  useEffect (() => {
    queryClient.refetchQueries({queryKey: ["questionnaires"]});
  }, [search_term, queryClient]);
  
  useEffect (() =>{
    queryClient.refetchQueries({queryKey: ["questionnaires"]});
  }, [pageNumber, queryClient]);

  if (questionnaires.isLoading || !questionnaires.data) {
    return <LoadingPage />;
  }
  if (questionnaires.isError) {
    return (
      <ErrorPage
        statusCode={400}
        errorMessage="Failed to fetch questionnaires. Please try again later."
      />
    );
  }
  const filteredResults = questionnaires.data.results.filter(
    (questionnaires: QuestionnaireType) =>
    (search_term === "" ||
     questionnaires.client_type.toLowerCase().includes(search_term.toLowerCase()) ||
     questionnaires.date_submitted.toLowerCase().includes(search_term.toLowerCase()) ||
     questionnaires.sex.toLowerCase().includes(search_term.toLowerCase()) ||
     questionnaires. region_of_residence.toLowerCase().includes(search_term.toLowerCase()) ||
     questionnaires.service_availed.toLowerCase().includes(search_term.toLowerCase())||
      questionnaires.i_am_a.toLowerCase().includes(search_term.toLowerCase()) ||
      questionnaires.extra_suggestions.toLowerCase().includes(search_term.toLowerCase()))
   );

   const handleSort = (field: keyof QuestionnaireType) => {
    if (sortedField === field) {
      setIsAscending(!isAscending);
    } else {
      setSortedField(field);
      setIsAscending(true);
    }
  };

  const sortedResults = [...filteredResults].sort((a, b) => {
    if (!sortedField) return 0;

    const valueA = a[sortedField];
    const valueB = b[sortedField];

    // Check if the field is numeric (like ID)
    if (typeof valueA === "number" && typeof valueB === "number") {
      return isAscending ? valueA - valueB : valueB - valueA;
    }

    // Default to string comparison for other fields
    return isAscending
      ? String(valueA).localeCompare(String(valueB))
      : String(valueB).localeCompare(String(valueA));
  });



  return (
    
    <div className="flex h-screen w-full bg-gray-100 p-6">
    <div className="container mx-auto max-w-full bg-white border rounded-lg shadow-lg flex flex-col">
    <div className="flex justify-between p-3 space-x-4 bg-white shadow-md rounded-md">
    <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 flex-1">
           Clientele Survey Results
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
          <TableHead className="text-center text-white text-sm cursor-pointer" 
          onClick={() => handleSort("id")}> ID</TableHead>
          <TableHead className="text-center text-white text-sm cursor-pointer" 
          onClick={() => handleSort("date_submitted")}>
            Date Submitted
            </TableHead>
            <TableHead className="text-center text-white text-sm cursor-pointer">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
        {sortedResults.map((questionnaire: QuestionnaireType) => (
              <TableRow key={questionnaire.id}>
                <TableCell className="text-center text-sm">
                  {questionnaire.id}
                </TableCell>
                <TableCell className="text-center text-sm">
                  {questionnaire.date_submitted}
                </TableCell>
                <TableCell className="text-center text-sm">
                  <Link
                    to="/export/0061/"
                    state={{ questionnaire: questionnaire }}
                  >
                    <Button>Export to 006-1</Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table> 
      </div>
      <TableFooter>
      <div className="flex justify-end items-center space-x-3 p-4 bg-white border-t ml-auto">
        <div className="self-end flex flex-row items-center space-x-1.5">
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
            if ( questionnaires.data.next) setPageNumber(pageNumber + 1);
          }}
        >
          Next
        </Button>
        </div>
        </div>
      {! questionnaires.data.next && (
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
