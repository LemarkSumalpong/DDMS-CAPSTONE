import { QuestionnaireSubmitAPI } from "@/components/API";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";

export default function SubmitQuestionnairePage() {
  const { document_request_id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const queryClient = useQueryClient();
  const [questionnaire, setQuestionnaire] = useState({
    document_request: document_request_id || null,
    client_type: "",
    sex: "",
    age: 18,
    region_of_residence: "",
    service_availed: "",
    i_am_a: "",
    i_am_a_other: "",
    q1_answer: "",
    q2_answer: "",
    q3_answer: "",
    sqd0_answer: "",
    sqd1_answer: "",
    sqd2_answer: "",
    sqd3_answer: "",
    sqd4_answer: "",
    sqd5_answer: "",
    sqd6_answer: "",
    sqd7_answer: "",
    sqd8_answer: "",
    extra_suggestions: "",
  });
  const sqd_choices = [
    {
      value: "1",
      display: "Strongly disagree",
    },
    {
      value: "2",
      display: "Disagree",
    },
    {
      value: "3",
      display: "Neither Agree nor Disagree",
    },
    {
      value: "4",
      display: "Agree",
    },
    {
      value: "5",
      display: "Strongly agree",
    },
    {
      value: "6",
      display: "N/A (Not Applicable)",
    },
  ];
  const submit_mutation = useMutation({
    mutationFn: async () => {
      const data = await QuestionnaireSubmitAPI(questionnaire);
      if (data[0] != true) {
        return Promise.reject(new Error(JSON.stringify(data[1])));
      }
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["questionnaires"] });
      setError("");
      toast(
        `Questionnaire submitted successfuly,  ${
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
  return (
    <div className="flex flex-col h-screen w-full overflow-y-scroll justify-center items-center p-4 bg-white mt-8">
      <Card className="w-full h-full overflow-y-scroll">
        <CardHeader>
          <CardTitle>Submit Feedback</CardTitle>
          <CardDescription className="text-red-600">{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4 overflow-y-scroll">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Client Type</Label>
                <Select
                  defaultValue={questionnaire.client_type}
                  value={questionnaire.client_type}
                  onValueChange={(value) =>
                    setQuestionnaire({ ...questionnaire, client_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="citizen">Citizen</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="government">
                      Government (Employee or Another Agency)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Sex</Label>
                <Select
                  defaultValue={questionnaire.sex}
                  value={questionnaire.sex}
                  onValueChange={(value) =>
                    setQuestionnaire({ ...questionnaire, sex: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Age</Label>
                  <Input
                    type="number"
                    value={questionnaire.age}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      if (!isNaN(parseInt(e.target.value))) {
                        setQuestionnaire({
                          ...questionnaire,
                          age: Number(e.target.value),
                        });
                      }
                    }}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Region of Residence</Label>
                  <Input
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setQuestionnaire({
                        ...questionnaire,
                        region_of_residence: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Service Availed</Label>
                  <Input
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setQuestionnaire({
                        ...questionnaire,
                        service_availed: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">I am a</Label>
                  <Select
                    defaultValue={questionnaire.i_am_a}
                    value={questionnaire.i_am_a}
                    onValueChange={(value) => {
                      if (value != "other") {
                        setQuestionnaire({
                          ...questionnaire,
                          i_am_a_other: "",
                        });
                      }
                      setQuestionnaire({ ...questionnaire, i_am_a: value });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="faculty">Faculty</SelectItem>
                      <SelectItem value="non-teaching staff">
                        Non-Teaching Staff
                      </SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="guardian">
                        Guardian/Parent of Student
                      </SelectItem>
                      <SelectItem value="alumna">Alumna</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {questionnaire.i_am_a == "other" ? (
                    <Input
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setQuestionnaire({
                          ...questionnaire,
                          i_am_a_other: e.target.value,
                        })
                      }
                      placeholder="Other type here..."
                    />
                  ) : (
                    <></>
                  )}
                </div>
              </div>
              <p className="text-xl">Citizen Charter (CC) Questions</p>
              <Label htmlFor="name">
                CC1: Which of the following best describes your awareness of a
                CC?
              </Label>
              <Select
                defaultValue={questionnaire.q1_answer}
                value={questionnaire.q1_answer}
                onValueChange={(value) => {
                  let q2Answer = questionnaire.q2_answer;
                  let q3Answer = questionnaire.q3_answer;

                  if (value === "4") {
                    q2Answer = "5";
                    q3Answer = "4";
                  } else if (questionnaire.q1_answer === "4") {
                    q2Answer = "";
                    q3Answer = "";
                  }

                  setQuestionnaire({
                    ...questionnaire,
                    q1_answer: value,
                    q2_answer: q2Answer,
                    q3_answer: q3Answer,
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="1">
                    I know what a CC is and I saw this office's CC
                  </SelectItem>
                  <SelectItem value="2">
                    I know what a CC is but I did NOT see this office's CC
                  </SelectItem>
                  <SelectItem value="3">
                    I learned of the CC only when I saw this office's CC
                  </SelectItem>
                  <SelectItem value="4">
                    I do not know what a CC is and I did not see one in this
                    office
                  </SelectItem>
                </SelectContent>
              </Select>
              {questionnaire.q1_answer != "4" ? (
                <>
                  <Label htmlFor="name">
                    CC2: If aware of CC (answered 1-3 in CC1), would you say
                    that the CC of this office was...?
                  </Label>
                  <Select
                    defaultValue={questionnaire.q2_answer}
                    value={questionnaire.q2_answer}
                    onValueChange={(value) => {
                      setQuestionnaire({ ...questionnaire, q2_answer: value });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="1">Easy to see</SelectItem>
                      <SelectItem value="2">Somewhat easy to see</SelectItem>
                      <SelectItem value="3">Difficult to see</SelectItem>
                      <SelectItem value="4">Not visible at all</SelectItem>
                    </SelectContent>
                  </Select>
                  <Label htmlFor="name">
                    CC3: If aware of CC (answered 1-3 in CC1), how much did the
                    CC help you in your transaction?
                  </Label>
                  <Select
                    defaultValue={questionnaire.q3_answer}
                    value={questionnaire.q3_answer}
                    onValueChange={(value) => {
                      setQuestionnaire({ ...questionnaire, q3_answer: value });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="1">Helped very much</SelectItem>
                      <SelectItem value="2">Somewhat helped</SelectItem>
                      <SelectItem value="3">Did not help</SelectItem>
                    </SelectContent>
                  </Select>
                </>
              ) : (
                <></>
              )}
              <p className="text-xl">SQD Questions</p>
              <Label htmlFor="name">
                SQD0: I am satisfied of the services that I availed
              </Label>
              <Select
                defaultValue={questionnaire.sqd0_answer}
                value={questionnaire.sqd0_answer}
                onValueChange={(value) => {
                  setQuestionnaire({ ...questionnaire, sqd0_answer: value });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {sqd_choices.map((choice) => (
                    <SelectItem key={choice.value} value={choice.value}>
                      {choice.display}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Label htmlFor="name">
              SQD1: I spent a reasonable amount of time on my transaction
            </Label>
            <Select
              defaultValue={questionnaire.sqd1_answer}
              value={questionnaire.sqd1_answer}
              onValueChange={(value) => {
                setQuestionnaire({ ...questionnaire, sqd1_answer: value });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent position="popper">
                {sqd_choices.map((choice) => (
                  <SelectItem key={choice.value} value={choice.value}>
                    {choice.display}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Label htmlFor="name">
              SQD2: The office followed the transaction's requirements and steps
              based on the information provided
            </Label>
            <Select
              defaultValue={questionnaire.sqd2_answer}
              value={questionnaire.sqd2_answer}
              onValueChange={(value) => {
                setQuestionnaire({ ...questionnaire, sqd2_answer: value });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent position="popper">
                {sqd_choices.map((choice) => (
                  <SelectItem key={choice.value} value={choice.value}>
                    {choice.display}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Label htmlFor="name">
              SQD3: The steps (including payment) I needed to do for my
              transaction were easy and simple.
            </Label>
            <Select
              defaultValue={questionnaire.sqd3_answer}
              value={questionnaire.sqd3_answer}
              onValueChange={(value) => {
                setQuestionnaire({ ...questionnaire, sqd3_answer: value });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent position="popper">
                {sqd_choices.map((choice) => (
                  <SelectItem key={choice.value} value={choice.value}>
                    {choice.display}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Label htmlFor="name">
              SQD4: I easily found information about my transaction from the
              office or its website.
            </Label>
            <Select
              defaultValue={questionnaire.sqd4_answer}
              value={questionnaire.sqd4_answer}
              onValueChange={(value) => {
                setQuestionnaire({ ...questionnaire, sqd4_answer: value });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent position="popper">
                {sqd_choices.map((choice) => (
                  <SelectItem key={choice.value} value={choice.value}>
                    {choice.display}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Label htmlFor="name">
              SQD5: I paid a reasonable amount of fees for my transaction. (If
              the service was free, mark the 'N/A 'column)
            </Label>
            <Select
              defaultValue={questionnaire.sqd5_answer}
              value={questionnaire.sqd5_answer}
              onValueChange={(value) => {
                setQuestionnaire({ ...questionnaire, sqd5_answer: value });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent position="popper">
                {sqd_choices.map((choice) => (
                  <SelectItem key={choice.value} value={choice.value}>
                    {choice.display}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Label htmlFor="name">
              SQD6: I feel the office was fair to everyone, or "walang
              palakasan", during my transaction.
            </Label>
            <Select
              defaultValue={questionnaire.sqd6_answer}
              value={questionnaire.sqd6_answer}
              onValueChange={(value) => {
                setQuestionnaire({ ...questionnaire, sqd6_answer: value });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent position="popper">
                {sqd_choices.map((choice) => (
                  <SelectItem key={choice.value} value={choice.value}>
                    {choice.display}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Label htmlFor="name">
              SQD7: I was treated courteously by the staff and (if asked for
              help) the staff was helpful.
            </Label>
            <Select
              defaultValue={questionnaire.sqd7_answer}
              value={questionnaire.sqd7_answer}
              onValueChange={(value) => {
                setQuestionnaire({ ...questionnaire, sqd7_answer: value });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent position="popper">
                {sqd_choices.map((choice) => (
                  <SelectItem key={choice.value} value={choice.value}>
                    {choice.display}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Label htmlFor="name">
              SQD8: I got what I needed from the govemment office, or (if
              denied) denial of the request was successfully explained to me.
            </Label>
            <Select
              defaultValue={questionnaire.sqd8_answer}
              value={questionnaire.sqd8_answer}
              onValueChange={(value) => {
                setQuestionnaire({ ...questionnaire, sqd8_answer: value });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent position="popper">
                {sqd_choices.map((choice) => (
                  <SelectItem key={choice.value} value={choice.value}>
                    {choice.display}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">
                Suggestions on how we can further improve our services
                (Optional)
              </Label>
              <Input
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setQuestionnaire({
                    ...questionnaire,
                    extra_suggestions: e.target.value,
                  })
                }
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col justify-center space-y-2">
          <div className="flex flex-row justify-center space-x-2">
            <Button
              onClick={() => {
                console.log(questionnaire);
                submit_mutation.mutate();
              }}
            >
              Submit
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
