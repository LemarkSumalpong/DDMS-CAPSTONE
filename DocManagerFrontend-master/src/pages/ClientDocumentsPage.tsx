import { WidgetDocumentRequestsAPI, DocumentType } from "@/components/API";
import { useQuery } from "@tanstack/react-query";
import LoadingPage from "./LoadingPage";
import ErrorPage from "./ErrorPage";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
  TableCaption,
  TableFooter,
} from "@/components/ui/table";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
export default function ClientDocumentsPage() {
  const [search_term, setSearchTerm] = useState("");
  const documents = useQuery({
    queryKey: ["client_documents"],
    queryFn: WidgetDocumentRequestsAPI,
  });
  if (documents.isLoading || !documents.data) {
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

  return (
    <div className="flex flex-col h-screen w-full overflow-y-scroll justify-center items-center p-4 bg-white mt-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        {"Documents (Client View)"}
      </h1>
      <div className="self-center flex flex-row items-center text-center content-center">
        <Label htmlFor="name">Search</Label>
        <Input
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchTerm(e.target.value)
          }
        />
      </div>
      <Table className="w-full self-center max-h-16 overflow-y-scroll">
        <TableCaption>Documents Database</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>File Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Date Uploaded</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.data
            .filter(
              (document: DocumentType) =>
                search_term.includes(String(document.id)) ||
                document.name
                  .toLowerCase()
                  .includes(search_term.toLowerCase()) ||
                document.document_type
                  .toLowerCase()
                  .includes(search_term.toLowerCase()) ||
                search_term.includes(String(document.number_pages)) ||
                document.ocr_metadata
                  .toLowerCase()
                  .includes(search_term.toLowerCase()) ||
                document.date_uploaded
                  .toLowerCase()
                  .includes(search_term.toLowerCase())
            )
            .map((document: DocumentType) => (
              <TableRow key={document.id}>
                <TableCell className="text-left font-medium">
                  {document.id}
                </TableCell>
                <TableCell className="text-left">{document.name}</TableCell>
                <TableCell className="text-left">
                  {document.document_type}
                </TableCell>
                <TableCell className="text-right">
                  {document.date_uploaded}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">
              {documents.data
                ? documents.data.filter(
                    (document: DocumentType) =>
                      search_term.includes(String(document.id)) ||
                      document.name
                        .toLowerCase()
                        .includes(search_term.toLowerCase()) ||
                      document.document_type
                        .toLowerCase()
                        .includes(search_term.toLowerCase()) ||
                      search_term.includes(String(document.number_pages)) ||
                      document.ocr_metadata
                        .toLowerCase()
                        .includes(search_term.toLowerCase()) ||
                      document.date_uploaded
                        .toLowerCase()
                        .includes(search_term.toLowerCase())
                  ).length
                : 0}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
