/* eslint-disable react-refresh/only-export-components */
import axios from "axios";

const debug = true;
let backendURL;

if (debug) {
  backendURL = "http://localhost:8000/";
} else {
  backendURL = "https://api.docmanagerbackend.06222001.xyz/";
}

const instance = axios.create({
  baseURL: backendURL,
});

// Token Handling
export async function getAccessToken() {
  const accessToken = await localStorage.getItem("access_token");
  return accessToken;
}

export async function getRefreshToken() {
  const refreshToken = await localStorage.getItem("refresh_token");
  return refreshToken;
}

export async function setAccessToken(access: string) {
  await localStorage.setItem("access_token", access);
  return true;
}

export async function setRefreshToken(refresh: string) {
  await localStorage.setItem("refresh_token", refresh);
  return true;
}

// Header Config Template for REST
export async function GetConfig() {
  const accessToken = await getAccessToken();
  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
}

export function ParseError(error: { response: { data: string } }) {
  if (error.response && error.response.data) {
    if (error.response.data.length > 50) {
      return "Error truncated (too long)";
    }
    return JSON.stringify(error.response.data)
      .replace(/[{}]/g, " ")
      .replace(/\(/g, " ")
      .replace(/\)/g, " ")
      .replace(/"/g, " ")
      .replace(/,/g, ",")
      .replace(/\[/g, "")
      .replace(/\]/g, "")
      .replace(/\./g, "")
      .replace(/non_field_errors/g, "")
      .trim();
  }
  return "Unable to reach server";
}

// User
export const staff_roles = ["head", "admin", "staff"];
export const planning_roles = ["admin", "planning"]; // Don't include staff or head
export const head_roles = ["admin", "head"];
export const admin_roles = ["admin"];

export type UserType = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: "head" | "admin" | "client" | "planning" | "staff";
  sex: string;
  birthday: string;
  age: string;
};

export type RegisterType = {
  email: string;
  password: string;
  confirm_password: string;
  sex: string;
  birthday: string | null;
  first_name: string;
  last_name: string;
};

export type UpdateType = {
  sex: string;
  birthday: string | null;
  first_name: string;
  last_name: string;
};

export type AdminUserUpdateType = {
  role: string;
};

export type LoginType = {
  email: string;
  password: string;
};

export type ActivationType = {
  uid: string;
  token: string;
};

export type PasswordUpdateType = {
  new_password: string;
  current_password: string;
};

export type ResetPasswordConfirmType = {
  uid: string;
  token: string;
  new_password: string;
};

export function RegisterAPI(info: RegisterType) {
  return instance
    .post("api/v1/accounts/users/", info)
    .then(async (response) => {
      console.log(response.data);
      return [true, 0];
    })
    .catch((error) => {
      console.log("Registration failed");
      return [false, ParseError(error)];
    });
}

export function LoginAPI(user: LoginType, remember_session: boolean) {
  return instance
    .post("api/v1/accounts/jwt/create/", user)
    .then(async (response) => {
      console.log(response.data);
      setAccessToken(response.data.access);
      if (remember_session) {
        setRefreshToken(response.data.refresh);
      } else {
        setRefreshToken("");
      }

      console.log("Login Success");
      return true;
    })
    .catch((error) => {
      console.log("Login Failed", error.response.data);
      return false;
    });
}

export async function JWTRefreshAPI() {
  const refresh = await getRefreshToken();
  return instance
    .post("api/v1/accounts/jwt/refresh/", {
      refresh: refresh,
    })
    .then(async (response) => {
      setAccessToken(response.data.access);
      return true;
    })
    .catch(() => {
      console.log("Token refresh failed");
      return false;
    });
}

export async function UserAPI() {
  const config = await GetConfig();
  return instance
    .get("api/v1/accounts/users/me/", config)
    .then((response) => {
      return response.data as UserType;
    })
    .catch((error) => {
      console.log(error.message);
      return error;
    });
}

export async function UsersAPI() {
  const config = await GetConfig();
  return instance
    .get("api/v1/accounts/users", config)
    .then((response) => {
      return response.data as UserType[];
    })
    .catch((error) => {
      console.log(error.message);
      return error;
    });
}

export async function UserDeleteAPI(id: number) {
  const config = await GetConfig();
  return instance
    .delete(`api/v1/accounts/users/delete/${id}/`, config)
    .then((response) => {
      return [true, response.data];
    })
    .catch((error) => {
      console.log("Error deleting user");
      return [
        false,
        error.response.data["error"] || error.response.data["detail"],
      ];
    });
}

export async function UserUpdatePasswordAPI(password: PasswordUpdateType) {
  const config = await GetConfig();
  return instance
    .post("/api/v1/accounts/users/set_password/", password, config)
    .then((response) => {
      return [true, response.data];
    })
    .catch((error) => {
      console.log(error.message);
      return [false, error];
    });
}

export async function AdminUserUpdateAPI(
  id: number,
  user: AdminUserUpdateType
) {
  const config = await GetConfig();
  return instance
    .patch(`api/v1/accounts/users/update/${id}/`, user, config)
    .then((response) => {
      return [true, response.data as UserType];
    })
    .catch((error) => {
      console.log(error.message);
      return [false, error];
    });
}

export async function UserUpdateAPI(user: UpdateType) {
  const config = await GetConfig();
  return instance
    .patch("api/v1/accounts/users/me/", user, config)
    .then((response) => {
      return [true, response.data as UserType];
    })
    .catch((error) => {
      console.log(error.message);
      return [false, error];
    });
}

export function ActivationAPI(activation: ActivationType) {
  return instance
    .post("api/v1/accounts/users/activation/", activation)
    .then(() => {
      console.log("Activation Success");
      return true;
    })
    .catch(() => {
      console.log("Activation failed");
      return false;
    });
}
export function ResetPasswordAPI(email: string) {
  return instance
    .post("api/v1/accounts/users/reset_password/", { email: email })
    .then(() => {
      console.log("Activation Success");
      return true;
    })
    .catch(() => {
      console.log("Activation failed");
      return false;
    });
}

export function ResetPasswordConfirmAPI(info: ResetPasswordConfirmType) {
  return instance
    .post("api/v1/accounts/users/reset_password_confirm/", info)
    .then(() => {
      console.log("Reset Success");
      return [true, 0];
    })
    .catch((error) => {
      console.log("Reset failed");
      return [false, ParseError(error)];
    });
}

// Documents

export type DocumentType = {
  id: number;
  name: string;
  document_type: string;
  sent_from: string;
  number_pages: number;
  file?: string;
  ocr_metadata: string;
  date_uploaded: string;
  document_month: string;
  document_year: string;
  subject: string;
};

export type DocumentCreateType = {
  name: string;
  file: File | null;
  document_type: string;
  number_pages: number;
  sent_from: string;
  document_month: string;
  document_year: number;
  subject: string;
};

export type DocumentUpdateType = {
  name: string;
  document_type: string;
  number_pages: number;
  sent_from: string;
  document_month: string;
  document_year: string;
  subject: string;
};

export type DocumentPaginatedResponseType = {
  count: number;
  next: string;
  previous: string;
  results: DocumentType[];
};

export async function DocumentsAPI(
  search_term: string,
  page_number: number
) {
  const config = await GetConfig();
  if(search_term){
    return instance
    .get(
      `api/v1/documents/list?search=${search_term}&page=${page_number}`, 
      config
    )
    .then((response) => {
      return response.data as DocumentPaginatedResponseType;
    });
  } else {
    return instance
    .get(`api/v1/documents/list?page=${page_number}`, config)
    .then((response) => {
      return response.data as DocumentPaginatedResponseType
    });
  }
}

export async function WidgetDocumentsAPI() {
  const config = await GetConfig();
  return instance
    .get("api/v1/documents/widget/", config)
    .then((response) => {
      return response.data as DocumentType[];
    })
    .catch((error) => {
      console.log(error.message);
      return error;
    });
}

export async function StaffDocumentsAPI(
  search_term: string,
  page_number: number | undefined,
  document_month: string | undefined,
  document_year: string | undefined,
  document_type: string | undefined,
  sort: string | undefined = "date_uploaded",
  direction: "asc" | "desc" = "desc"
) {
  const config = await GetConfig();

  // Build the query string
  let query = `page=${page_number}&sort=${sort}&direction=${direction}`;
  
  if (search_term) query += `&search=${search_term}`;
  if (document_month) query += `&document_month=${document_month}`;
  if (document_year) query += `&document_year=${document_year}`;
  if (document_type) query += `&document_type=${document_type}`;
    return instance
      .get(`api/v1/documents/list/staff?${query}`, config)
      .then((response) => {
        return response.data as DocumentPaginatedResponseType;
      });
  }


export async function WidgetStaffDocumentsAPI() {
  const config = await GetConfig();
  return instance
    .get("api/v1/documents/widget/staff/", config)
    .then((response) => {
      return response.data as DocumentType[];
    })
    .catch((error) => {
      console.log(error.message);
      return error;
    });
}

export async function DocumentCreateAPI(document: FormData) {
  const config = await GetConfig();
  return instance
    .post("api/v1/documents/upload/", document, config)
    .then((response) => {
      return [true, response.data as DocumentType];
    })
    .catch((error) => {
      console.log("Error creating document");
      return [
        false,
        error.response.data["error"] || error.response.data["detail"],
      ];
    });
}

export async function DocumentUpdateAPI(
  id: number,
  document: DocumentUpdateType
) {
  const config = await GetConfig();
  return instance
    .patch(`api/v1/documents/update/${id}/`, document, config)
    .then((response) => {
      return [true, response.data as DocumentUpdateType];
    })
    .catch((error) => {
      console.log("Error updating document");
      console.log(error.response.data);
      return [false, error.response.data];
    });
}

export async function DocumentDeleteAPI(id: number) {
  const config = await GetConfig();
  return instance
    .delete(`api/v1/documents/delete/${id}/`, config)
    .then((response) => {
      return [true, response.data];
    })
    .catch((error) => {
      console.log("Error deleting document");
      return [
        false,
        error.response.data["error"] || error.response.data["detail"],
      ];
    });
}

// Document Requests

export type DocumentRequestUnitType = {
  id: number;
  document: DocumentType;
  copies: number;
};

export type DocumentRequestType = {
  id: number;
  requester: string;
  questionnaire: number;
  college: string;
  status: "pending" | "approved" | "denied" | "claimed" | "unclaimed";
  type: "softcopy" | "hardcopy";
  remarks: string;
  purpose: string;
  documents: DocumentRequestUnitType[];
  date_requested: string;
};

export type DocumentRequestUpdateType = {
  status: string;
  remarks: string;
};

export type DocumentRequestUnitCreateType = {
  document: number;
  copies: number;
};

export type DocumentRequestCreateType = {
  college: string;
  type: string;
  purpose: string;
  documents: DocumentRequestUnitCreateType[];
};

export type DocumentRequestPaginatedResponseType = {
  count: number;
  next: string;
  previous: string;
  results: DocumentRequestType[];
}

export async function HeadDocumentRequestsAPI(
  search_term: string,
  page_number: number,
  sort: string = 'date_requested', // Default sorting by 'date_requested'
  direction: 'asc' | 'desc' = 'asc', // Default direction is 'asc'
  start_date: string | null = null,  // Start date filter
  end_date: string | null = null,    // End date filter
  status: string | null = null       // Status filter
) {
  const config = await GetConfig();

  // Construct the query string
  let query = `page=${page_number}&sort=${sort}&direction=${direction}`;

  // Add search term to query if provided
  if (search_term) {
    query += `&search=${search_term}`;
  }

  // Add date range filters if provided
  if (start_date) {
    query += `&start_date=${start_date}`;
  }
  if (end_date) {
    query += `&end_date=${end_date}`;
  }

  // Add status filter if provided
  if (status) {
    query += `&status=${status}`;
  }

  return instance
    .get(`api/v1/requests/list/head?${query}`, config)
    .then((response) => {
      return response.data as DocumentRequestPaginatedResponseType;
    });
}

export async function WidgetHeadDocumentRequestsAPI() {
  const config = await GetConfig();
  return instance
    .get("api/v1/requests/widget/head/", config)
    .then((response) => {
      return response.data as DocumentRequestType[];
    })
    .catch((error) => {
      console.log(error.message);
      return error;
    });
}

export async function StaffDocumentRequestsAPI(
  search_term: string,
  page_number: number,
  sort: string = 'date_requested', // Default sorting by 'date_requested'
  direction: 'asc' | 'desc' = 'asc', // Default direction is 'asc'
  start_date: string | null = null,  // Start date filter
  end_date: string | null = null,    // End date filter
  status: string | null = null       // Status filter
) {
  const config = await GetConfig();

  // Construct the query string
  let query = `page=${page_number}&sort=${sort}&direction=${direction}`;

  // Add search term to query if provided
  if (search_term) {
    query += `&search=${search_term}`;
  }

  // Add date range filters if provided
  if (start_date) {
    query += `&start_date=${start_date}`;
  }
  if (end_date) {
    query += `&end_date=${end_date}`;
  }

  // Add status filter if provided
  if (status) {
    query += `&status=${status}`;
  }

  return instance
  .get(`api/v1/requests/list?${query}`, config)
  .then ((response) => {
    return response.data as DocumentRequestPaginatedResponseType
  }) 
}

export async function WidgetStaffDocumentRequestsAPI() {
  const config = await GetConfig();
  return instance
    .get("api/v1/requests/widget/", config)
    .then((response) => {
      return response.data as DocumentRequestType[];
    })
    .catch((error) => {
      console.log(error.message);
      return error;
    });
}

export async function DocumentRequestsAPI( 
  search_term: string,
  page_number: number,
  sort: string = 'date_requested', // Default sorting by 'date_requested'
  direction: 'asc' | 'desc' = 'asc', // Default direction is 'asc'
  start_date: string | null = null,  // Start date filter
  end_date: string | null = null,    // End date filter
  status: string | null = null       // Status filter
) {
  const config = await GetConfig();

  // Construct the query string
  let query = `page=${page_number}&sort=${sort}&direction=${direction}`;

  // Add search term to query if provided
  if (search_term) {
    query += `&search=${search_term}`;
  }

  // Add date range filters if provided
  if (start_date) {
    query += `&start_date=${start_date}`;
  }
  if (end_date) {
    query += `&end_date=${end_date}`;
  }

  // Add status filter if provided
  if (status) {
    query += `&status=${status}`;
  }
  return instance
  .get(`api/v1/requests/list?${query}`, config)
  .then ((response) => {
    return response.data as DocumentRequestPaginatedResponseType
  }) 
}

export async function WidgetDocumentRequestsAPI() {
  const config = await GetConfig();
  return instance
    .get("api/v1/requests/widget/", config)
    .then((response) => {
      return response.data as DocumentRequestType[];
    })
    .catch((error) => {
      console.log(error.message);
      return error;
    });
}

export async function DocumentRequestCreateAPI(
  document_request: DocumentRequestCreateType
) {
  const config = await GetConfig();
  return instance
    .post("api/v1/requests/create/", document_request, config)
    .then((response) => {
      return [true, response.data as DocumentRequestType];
    })
    .catch((error) => {
      console.log("Error creating document");
      return [
        false,
        error.response.data["error"] || error.response.data["detail"],
      ];
    });
}

export async function DocumentRequestUpdateAPI(
  document_request: DocumentRequestUpdateType,
  id: number
) {
  const config = await GetConfig();
  return instance
    .patch(`api/v1/requests/update/${id}/`, document_request, config)
    .then((response) => {
      return [true, response.data as DocumentType];
    })
    .catch((error) => {
      console.log("Error creating document");
      return [
        false,
        error.response.data["error"] || error.response.data["detail"],
      ];
    });
}

// Questionnaires

export type QuestionnaireCreateType = {
  document_request: string | null;
  client_type: string;
  sex: string;
  age: number;
  region_of_residence: string;
  service_availed: string;
  i_am_a: string;
  i_am_a_other: string;
  q1_answer: string;
  q2_answer: string;
  q3_answer: string;
  sqd0_answer: string;
  sqd1_answer: string;
  sqd2_answer: string;
  sqd3_answer: string;
  sqd4_answer: string;
  sqd5_answer: string;
  sqd6_answer: string;
  sqd7_answer: string;
  sqd8_answer: string;
  extra_suggestions: string;
};

export type QuestionnaireType = {
  id: number;
  client: string;
  date_submitted: string;
  client_type: string;
  sex: string;
  age: number;
  region_of_residence: string;
  service_availed: string;
  i_am_a: string;
  i_am_a_other: string;
  q1_answer: string;
  q2_answer: string;
  q3_answer: string;
  sqd0_answer: string;
  sqd1_answer: string;
  sqd2_answer: string;
  sqd3_answer: string;
  sqd4_answer: string;
  sqd5_answer: string;
  sqd6_answer: string;
  sqd7_answer: string;
  sqd8_answer: string;
  extra_suggestions: string;
};
export type QuestionnairePaginatedResponseType = {
  count: number;
  next: string;
  previous: string;
  results: QuestionnaireType[];
}

export async function QuestionnaireSubmitAPI(
  questionnaire: QuestionnaireCreateType
) {
  const config = await GetConfig();
  return instance
    .post("api/v1/questionnaires/submit/", questionnaire, config)
    .then((response) => {
      return [true, response.data as QuestionnaireType];
    })
    .catch((error) => {
      console.log("Error submitting questionnaire");
      return [
        false,
        error.response.data["error"] || error.response.data["detail"],
      ];
    });
}

export async function QuestionnairesAPI(
  search_term: string,
  page_number: number
) {
  const config = await GetConfig();
  if (search_term){
    return instance
    .get(
      `api/v1/questionnaires/list?search=${search_term}&page=${page_number}`, 
      config)
    .then((response) => {
      return response.data as QuestionnairePaginatedResponseType;
    });
  } else {
    return instance
    .get(
      `api/v1/questionnaires/list?page=${page_number}`, 
      config)
      .then((response) => {
        return response.data as QuestionnairePaginatedResponseType
      })
  }
}

export async function WidgetQuestionnairesAPI() {
  const config = await GetConfig();
  return instance
    .get("api/v1/questionnaires/widget/", config)
    .then((response) => {
      return response.data as QuestionnaireType[];
    })
    .catch((error) => {
      console.log(error.message);
      return error;
    });
}

// Authorization Requests

export type AuthorizationRequestUnitType = {
  id: number;
  document: string;
  copies: number;
  pages: number;
  status: string;
};

export type AuthorizationRequestUnitUpdateType = {
  status: string;
};

export type AuthorizationRequestType = {
  id: number;
  requester: string;
  college: string;
  status: "pending" | "approved" | "denied" | "claimed" | "unclaimed";
  remarks: string;
  purpose: string;
  documents: AuthorizationRequestUnitType[];
  date_requested: string;
};

export type AuthorizationRequestUpdateType = {
  status: string;
  remarks: string;
};

export type AuthorizationRequestUnitCreateType = {
  document: string;
  copies: number;
  pages: number;
};

export type AuthorizationRequestCreateType = {
  college: string;
  purpose: string;
  documents: AuthorizationRequestUnitCreateType[];
};

export type AuthorizationRequestPaginatedResponseType = {
  count: number;
  next: string;
  previous: string;
  results: AuthorizationRequestType[];
}

export async function AuthorizationRequestsAPI(
  search_term: string,
  page_number: number,
  sort: string = 'date_requested', // Default sorting by 'date_requested'
  direction: 'asc' | 'desc' = 'asc', // Default direction is 'asc'
  start_date: string | null = null,  // Start date filter
  end_date: string | null = null,    // End date filter
  status: string | null = null       // Status filter
) {
  const config = await GetConfig();

  // Construct the query string
  let query = `page=${page_number}&sort=${sort}&direction=${direction}`;

  // Add search term to query if provided
  if (search_term) {
    query += `&search=${search_term}`;
  }

  // Add date range filters if provided
  if (start_date) {
    query += `&start_date=${start_date}`;
  }
  if (end_date) {
    query += `&end_date=${end_date}`;
  }

  // Add status filter if provided
  if (status) {
    query += `&status=${status}`;
  }

  return instance
    .get(`api/v1/authorization_requests/list?${query}`, config)
    .then((response) => {
      return response.data as AuthorizationRequestPaginatedResponseType;
    });
}

export async function WidgetAuthorizationRequestsAPI() {
  const config = await GetConfig();
  return instance
    .get("api/v1/authorization_requests/widget/", config)
    .then((response) => {
      return response.data as AuthorizationRequestType[];
    })
    .catch((error) => {
      console.log(error.message);
      return error;
    });
}

export async function AuthorizationRequestCreateAPI(
  authorization_request: AuthorizationRequestCreateType
) {
  const config = await GetConfig();
  return instance
    .post(
      "api/v1/authorization_requests/create/",
      authorization_request,
      config
    )
    .then((response) => {
      return [true, response.data as AuthorizationRequestType];
    })
    .catch((error) => {
      return [false, ParseError(error)];
    });
}

export async function AuthorizationRequestUpdateAPI(
  authorization_request: AuthorizationRequestUpdateType,
  id: number
) {
  const config = await GetConfig();
  return instance
    .patch(
      `api/v1/authorization_requests/update/${id}/`,
      authorization_request,
      config
    )
    .then((response) => {
      return [true, response.data as AuthorizationRequestType];
    })
    .catch((error) => {
      return [false, ParseError(error)];
    });
}

export async function AuthorizationRequestUnitUpdateAPI(
  authorization_request_unit: AuthorizationRequestUnitUpdateType,
  id: number
) {
  const config = await GetConfig();
  return instance
    .patch(
      `api/v1/authorization_requests/authorization_request_units/update/${id}/`,
      authorization_request_unit,
      config
    )
    .then((response) => {
      return [true, response.data as AuthorizationRequestUnitType];
    })
    .catch((error) => {
      return [false, ParseError(error)];
    });
}

// Notifications

export type NotificationType = {
  id: number;
  client: number;
  timestamp: string;
  content: string;
  type: string;
  audience: string;
};

export async function NotificationsAPI() {
  const config = await GetConfig();
  return instance.get("api/v1/notifications/list/", config).then((response) => {
    return response.data as NotificationType[];
  });
  // .catch((error) => {
  //   return ParseError(error);
  // });
}

export async function NotificationDeleteAPI(id: number) {
  const config = await GetConfig();
  return instance
    .delete(`api/v1/notifications/delete/${id}/`, config)
    .then((response) => {
      return [true, response.data];
    })
    .catch((error) => {
      return [false, ParseError(error)];
    });
}
