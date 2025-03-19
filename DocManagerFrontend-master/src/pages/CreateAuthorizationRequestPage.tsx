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
  AuthorizationRequestCreateAPI,
  AuthorizationRequestCreateType,
} from "@/components/API";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

export default function CreateAuthorizationRequestPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [adding_custom_document, setAddingCustomDocument] = useState(false);
  const [custom_document_name, setCustomDocumentName] = useState("");
  const [adding_custom_college, setAddingCustomCollege] = useState(false);
  const [selected_document, setSelectedDocument] = useState("");
  const [error, setError] = useState("");
  const [authorization_request, setAuthorizationRequest] =
    useState<AuthorizationRequestCreateType>({
      college: "",
      purpose: "",
      documents: [],
    });
  const create_mutation = useMutation({
    mutationFn: async () => {
      const data = await AuthorizationRequestCreateAPI(authorization_request);
      if (data[0] != true) {
        return Promise.reject(new Error(JSON.stringify(data[1])));
      }
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["authorization_requests"] });
      setError("");
      toast(
        `Authorization request submitted successfuly,  ${
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

  function handleCopyChange(index: number, newValue: number) {
    if (!isNaN(newValue) && newValue > 0) {
      setAuthorizationRequest((prevState) => ({
        ...prevState,
        documents: prevState.documents.map((doc, i) =>
          i === index ? { ...doc, copies: newValue } : doc
        ),
      }));
    }
  }

  function handlePagesChange(index: number, newValue: number) {
    if (!isNaN(newValue) && newValue > 0) {
      setAuthorizationRequest((prevState) => ({
        ...prevState,
        documents: prevState.documents.map((doc, i) =>
          i === index ? { ...doc, pages: newValue } : doc
        ),
      }));
    }
  }

  return (
    <div className="flex flex-col h-screen w-full overflow-y-scroll justify-center items-center p-4 bg-gray-700 mt-8">
      <Card className="w-full h-full overflow-y-scroll">
        <CardHeader>
          <CardTitle className="text-center font-bold font-serif text-4xl">CENTRAL RECORDS AUTHENTICATION REQUEST FORM</CardTitle>
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
                        setAuthorizationRequest({
                          ...authorization_request,
                          college: "",
                        });
                      } else {
                        setAddingCustomCollege(false);
                        setAuthorizationRequest({
                          ...authorization_request,
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
                        value={authorization_request.college}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setAuthorizationRequest({
                            ...authorization_request,
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
                <h1 className="text-2xl font-bold mb-4">Purpose</h1>
                <Input
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setAuthorizationRequest({
                      ...authorization_request,
                      purpose: e.target.value,
                    });
                  }}
                  placeholder="Brief description as to why you require the requested documents"
                />
              </div>
              <h1 className="text-2xl font-bold mb-4">Add Document</h1>
              <div className="mt-4">
                <Select
                  value={selected_document}
                  onValueChange={(value) => {
                    setSelectedDocument(value);
                    if (value == "other") {
                      console.log(
                        "Other value selected! Showing the add custom document field"
                      );
                      setAddingCustomDocument(true);
                    } else {
                      if (
                        authorization_request.documents.filter(
                          (doc) => doc.document == value
                        ).length > 0
                      ) {
                        toast(
                          "You have already added a document of this name!",
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
                      } else {
                        setAddingCustomDocument(false);
                        setAuthorizationRequest((prevState) => ({
                          ...prevState,
                          documents: prevState.documents
                            .map((doc) => ({
                              document: doc.document,
                              copies: doc.copies,
                              pages: doc.pages,
                            }))
                            .concat({ document: value, copies: 1, pages: 1 }),
                        }));
                      }
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                  <SelectItem value="Certificate of Attendance">
                      Certificate of Attendance
                    </SelectItem>
                    <SelectItem value="Certificate of Completion">
                      Certificate of Completion
                    </SelectItem>
                    <SelectItem value="Certificate of Employment">
                      Certificate of Employment
                    </SelectItem>
                    <SelectItem value="Certificate of Participation">
                      Certificate of Participation
                    </SelectItem>
                    <SelectItem value="Certificate of Participation">
                      Certificate of Recognition
                    </SelectItem>
                    <SelectItem value="certificate of registration">
                      Certificate of Registration
                    </SelectItem>
                    <SelectItem value="Diploma">
                      Diploma
                    </SelectItem>
                    <SelectItem value="Research Oral Defense">
                     Research Oral Defense
                    </SelectItem>
                    <SelectItem value="Transcript of Records">
                    Transcript of Records (TOR)
                    </SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {adding_custom_document ? (
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Add Custom Document</Label>
                  <div className="flex flex-row space-y-1.5 space-x-1.5 justify-center">
                    <Input
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setCustomDocumentName(e.target.value);
                      }}
                      placeholder="Enter your custom document name here"
                    />
                    <Button
                      onClick={() => {
                        setSelectedDocument("");
                        setAddingCustomDocument(false);
                        setCustomDocumentName("");
                        if (
                          authorization_request.documents.filter(
                            (doc) => doc.document == custom_document_name
                          ).length > 0
                        ) {
                          toast(
                            "You have already added a document of this name!",
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
                        } else {
                          setAuthorizationRequest((prevState) => ({
                            ...prevState,
                            documents: prevState.documents
                              .map((doc) => ({
                                document: doc.document,
                                copies: doc.copies,
                                pages: doc.pages,
                              }))
                              .concat({
                                document: custom_document_name,
                                copies: 1,
                                pages: 1,
                              }),
                          }));
                        }
                      }}
                      variant="outline"
                    >
                      Add
                    </Button>
                  </div>
                </div>
              ) : (
                <></>
              )}

              <div className="mt-4">
                <h2 className="text-xl font-semibold">Selected Documents:</h2>
                <ul className="space-y-2">
                  {authorization_request.documents.map((current_doc, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-start space-x-2"
                    >
                      <span className="flex-8">{current_doc.document}</span>
                      <div className="flex-2 flex flex-row justify-end items-end flex-grow">
                        <p>Copies:</p>
                        <input
                          type="number"
                          min="1"
                          value={current_doc.copies}
                          onChange={(e) =>
                            handleCopyChange(index, e.target.valueAsNumber)
                          }
                          className="w-16 pl-2 text-right border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p>Pages:</p>
                        <input
                          type="number"
                          min="1"
                          value={current_doc.pages}
                          onChange={(e) =>
                            handlePagesChange(index, e.target.valueAsNumber)
                          }
                          className=" w-16 pl-2 text-right border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <Button
                        onClick={() =>
                          setAuthorizationRequest({
                            ...authorization_request,
                            documents: authorization_request.documents.filter(
                              (doc) => doc.document != current_doc.document
                            ),
                          })
                        }
                        variant="outline"
                      >
                        Delete
                      </Button>
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
              create_mutation.mutate();
              console.log(authorization_request);
            }}
          >
            Submit
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
