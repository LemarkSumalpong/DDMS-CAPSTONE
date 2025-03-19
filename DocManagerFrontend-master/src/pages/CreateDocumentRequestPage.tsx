import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import { useNavigate } from "react-router";
import {
  DocumentRequestCreateAPI,
  DocumentRequestCreateType,
  WidgetDocumentsAPI,
  DocumentType,
} from "@/components/API";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import ErrorPage from "./ErrorPage";
import LoadingPage from "./LoadingPage";
import { MultiSelect } from "@/components/multi-select";

export default function CreateDocumentRequestPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [adding_custom_college, setAddingCustomCollege] = useState(false);
  const [error, setError] = useState("");
  const documents = useQuery({
    queryKey: ["client_documents"],
    queryFn: WidgetDocumentsAPI,
  });
  const [document_request, setDocumentRequest] =
    useState<DocumentRequestCreateType>({
      college: "",
      type: "softcopy",
      purpose: "",
      documents: [],
    });
  const create_mutation = useMutation({
    mutationFn: async () => {
      const data = await DocumentRequestCreateAPI(document_request);
      if (data[0] != true) {
        return Promise.reject(new Error(JSON.stringify(data[1])));
      }
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["client_document_requests"] });
      queryClient.invalidateQueries({
        queryKey: ["staff_document_requests"],
      });
      setError("");
      toast(
        `Document request submitted successfuly,  ${
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
      navigate("/dashboard/");
    },
    onError: (error) => {
      setError(String(error));
    },
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

  function getDocumentName(documentId: number) {
    // This function should retrieve the name of the document based on its ID
    // You might want to fetch this data or use it from a local store
    // For demonstration purposes, let's assume we have a documents array
    return (
      documents.data.find((doc: DocumentType) => doc.id === documentId)?.name ||
      "Unknown"
    );
  }

  function handleCopyChange(index: number, newValue: number) {
    if (!isNaN(newValue) && newValue > 0) {
      setDocumentRequest((prevState) => ({
        ...prevState,
        documents: prevState.documents.map((doc, i) =>
          i === index ? { ...doc, copies: newValue } : doc
        ),
      }));
    }
  }

  return (
    <div className="flex flex-col h-screen w-full overflow-y-scroll justify-center items-center p-4 bg-gray-700 mt-8">
      <Card className="w-full h-full overflow-y-scroll">
      <CardHeader>
          <CardTitle className="text-center font-bold font-serif text-4xl">CENTRAL RECORDS  REQUEST FORM</CardTitle>
          <CardDescription className="text-red-600">{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <h1 className="text-2xl font-bold mb-4">College/Department</h1>
                <div className="mt-4">
                  <Select
                    onValueChange={(value) => {
                      if (value == "other") {
                        console.log(
                          "Other value selected! Showing the add custom college field"
                        );
                        setAddingCustomCollege(true);
                        setDocumentRequest({
                          ...document_request,
                          college: "",
                        });
                      } else {
                        setAddingCustomCollege(false);
                        setDocumentRequest({
                          ...document_request,
                          college: value,
                        });
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                    <SelectItem value=" College of Engineering and Architecture">
                        College of Engineering and Architecture (CEA)
                      </SelectItem>
                      <SelectItem value="college of information and technology computing">
                        College of Information and Technology Computing (CITC)
                      </SelectItem>
                      <SelectItem value="College of Science and Mathematics">
                      College of Science and Mathematics (CSM)
                      </SelectItem>
                      <SelectItem value="College of Science Technology and Education">
                        College of Science Technology and Education (CSTE)
                      </SelectItem>
                      <SelectItem value="College of Technology">
                        College of Technology (COT)
                      </SelectItem>
                      <SelectItem value="College of Medicine">
                        College of Medicine
                      </SelectItem>
                      <SelectItem value="Senior High School">
                       Senior High School (SHS)
                      </SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {adding_custom_college ? (
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name">
                      Enter Custom College/Department
                    </Label>
                    <div className="flex flex-row space-y-1.5 space-x-1.5 justify-center">
                      <Input
                        value={document_request.college}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setDocumentRequest({
                            ...document_request,
                            college: e.target.value,
                          });
                        }}
                        placeholder="Enter your custom college/department name here"
                      />
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Purpose</Label>
                <Input
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setDocumentRequest({
                      ...document_request,
                      purpose: e.target.value,
                    });
                  }}
                  placeholder="Brief description as to why you require the requested documents"
                />
              </div>
              <Label htmlFor="framework">Request Type</Label>
              <Select
                defaultValue={document_request.type}
                value={document_request.type}
                onValueChange={(value) =>
                  setDocumentRequest({
                    ...document_request,
                    type: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="hardcopy">Hardcopy</SelectItem>
                </SelectContent>
                <p className="text-2xs italic">
                  Hardcopy requests are only available as of now
                </p>
              </Select>
              <h1 className="text-2xl font-bold mb-4">Documents</h1>
              <MultiSelect
                options={documents.data.map((document: DocumentType) => {
                  return {
                    value: document.id,
                    label: document.name,
                  };
                })}
                onValueChange={(values) => {
                  setDocumentRequest((prevState) => ({
                    ...prevState,
                    documents: values.map((id) => ({
                      document: parseInt(id, 10),
                      copies: 1,
                    })),
                  }));
                }}
                defaultValue={[]}
                placeholder="Select documents"
                variant="inverted"
                animation={2}
                maxCount={3}
              />
              <div className="mt-4">
                <h2 className="text-xl font-semibold">Selected Documents:</h2>
                <ul className="list-none space-y-2">
                  {document_request.documents.map((doc, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span>{getDocumentName(doc.document)}</span>
                      <input
                        type="number"
                        min="1"
                        value={doc.copies}
                        onChange={(e) =>
                          handleCopyChange(index, e.target.valueAsNumber)
                        }
                        className="w-16 pl-2 text-right border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={() => navigate("/dashboard/")} variant="outline">
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (document_request.type == "softcopy") {
                setDocumentRequest((prevState) => ({
                  ...prevState,
                  documents: prevState.documents.map((doc) => ({
                    ...doc,
                    copies: 1,
                  })),
                }));
              }
              create_mutation.mutate();
              console.log(document_request);
            }}
          >
            Submit
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
