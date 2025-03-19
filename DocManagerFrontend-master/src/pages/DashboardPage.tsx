import {
  WidgetAuthorizationRequestsAPI,
  AuthorizationRequestType,
  WidgetDocumentRequestsAPI,
  DocumentRequestType,
  DocumentRequestUnitType,
  WidgetDocumentsAPI,
  DocumentType,
  WidgetQuestionnairesAPI,
  UserAPI,
} from "@/components/API";
import { useQuery } from "@tanstack/react-query";
import ErrorPage from "./ErrorPage";
import LoadingPage from "./LoadingPage";
import { Link } from "react-router-dom";
import { Bar, Pie } from 'react-chartjs-2';
import  { useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function DashboardPage() {
  const document_requests = useQuery({
    queryKey: ["client_document_requests"],
    queryFn: WidgetDocumentRequestsAPI,
  });
  const authorizationRequests = useQuery({
    queryKey: ["authorization_requests"],
    queryFn: WidgetAuthorizationRequestsAPI,
  });
  const user = useQuery({ queryKey: ["user"], queryFn: UserAPI });
  const questionnaires = useQuery({
    queryKey: ["questionnaires"],
    queryFn: WidgetQuestionnairesAPI,
  });
  const documents = useQuery({
    queryKey: ["client_documents"],
    queryFn: WidgetDocumentsAPI,
  });
  const totalUsers = useQuery({
    queryKey: ["total_users"],
    queryFn: async () => {
      const data = await UserAPI(); // Assuming UserAPI() returns the full user data array
      return data.length; // If data is an array, return the length as the total users
    }
  });

  const resetDataOnNewMonth = () => {
    const currentMonth = new Date().getMonth();
    const storedMonth = localStorage.getItem('lastMonth');
  
    // If the stored month doesn't match the current month, reset the data
    if (storedMonth === null || currentMonth !== parseInt(storedMonth)) {
      localStorage.setItem('lastMonth', currentMonth.toString()); // Save the current month as a string
      // Reset or refresh the chart data here
    }
  };
  
  // Call this function on page load or at appropriate intervals
  useEffect(() => {
    resetDataOnNewMonth();
  }, []);  // Empty dependency array ensures this runs once on component mount
  
  if (
    document_requests.isLoading ||
    authorizationRequests.isLoading ||
    user.isLoading
  ) {
    return <LoadingPage />;
  }
  if (
    document_requests.isLoading ||
    documents.isLoading ||
    user.isLoading ||
    questionnaires.isLoading ||
    !document_requests.data ||
    !documents.data ||
    !user.data
  ) {
    return <LoadingPage />;
  }

  if (
    document_requests.isError ||
    documents.isError ||
    user.isError ||
    questionnaires.isError
  ) {
    return (
      <ErrorPage
        statusCode={400}
        errorMessage="Failed to fetch dashboard. Please try again later."
      />
    );
  }
  
  const role = user.data?.role; 

  const documentsByType = Array.from(
    new Set(
      documents.data?.map((doc: DocumentType) => doc.document_type) || []
    )
  ).map((type) => ({
    label: type as string,
    value: documents.data?.filter(
      (doc: DocumentType) => doc.document_type === type
    ).length || 0,
  })).sort((a, b) => b.value - a.value);

  const staffHeadChartData = {
    labels: documentsByType.map((doc) => doc.label),
    datasets: [
      {
        label: 'Document Types',
        data: documentsByType.map((doc) => doc.value),
        backgroundColor: [
          'rgba(255, 45, 45, 0.8)',   
          'rgba(0, 82, 150, 0.8)',    
          'rgba(204, 153, 0, 0.8)',  
          'rgba(39, 136, 136, 0.8)',  
          'rgba(102, 51, 153, 0.8)',  
          'rgba(204, 102, 0, 0.8)',   
        ],
        borderColor: [
          'rgba(255, 45, 45, 1)',    
          'rgba(0, 82, 150, 1)',      
          'rgba(204, 153, 0, 1)',     
          'rgba(39, 136, 136, 1)',    
          'rgba(102, 51, 153, 1)',   
          'rgba(204, 102, 0, 1)',     
        ],
        borderWidth: 1,
      },
    ],
  };

  const documentChartData = {
    labels: documentsByType.map((doc) => doc.label),
    datasets: [
      {
        label: 'Document Types',
        data: documentsByType.map((doc) => doc.value),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const getCollegeRequestsData = (requests: (DocumentRequestType | AuthorizationRequestType)[]) => {
    const collegeCounts: { [key: string]: number } = {};
    requests.forEach((request) => {
      const college = request.college || "Unknown"; // Default to "Unknown" if no college info
      if (!collegeCounts[college]) {
        collegeCounts[college] = 0;
      }
      collegeCounts[college]++;
    });
    return {
      labels: Object.keys(collegeCounts),
      data: Object.values(collegeCounts),
    };
  };
  
  const collegeData = getCollegeRequestsData([
    ...document_requests.data,
    ...authorizationRequests.data,
  ]);
  
  const collegeRequestsChartData = {
    labels: collegeData.labels,
    datasets: [
      {
        data: collegeData.data,
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
      },
    ],
  };
  const getMonthlyRequestsData = (requests: (DocumentRequestType | AuthorizationRequestType)[]) => {
    const monthlyData = Array(12).fill(0); 
    requests.forEach((request) => {
      const month = new Date(request.date_requested).getMonth(); 
      monthlyData[month]++;
    });
    return monthlyData;
  };
  
  const monthlyRequestsChartData = {
    labels: [
      "January", "February", "March", "April", "May", "June", 
      "July", "August", "September", "October", "November", "December"
    ],
    datasets: [
      {
        label: "Number of Requests",
        data: getMonthlyRequestsData([
          ...document_requests.data,
          ...authorizationRequests.data,
        ]),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  
const getMonthYear = (date: string) => {
  const d = new Date(date);
  return `${d.getMonth() + 1}/${d.getFullYear()}`;
};


const getWeekOfYear = (date: string) => {
  const d = new Date(date);
  const start = new Date(d.getFullYear(), 0, 1);
  const diff = d.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return Math.ceil((dayOfYear + 1) / 7); 
};


const countUploadsByPeriod = (data: any[], period: "month" | "week") => {
  const groupedData: { [key: string]: number } = {};

  data.forEach((doc) => {
    const periodKey = period === "month" ? getMonthYear(doc.date_uploaded) : getWeekOfYear(doc.date_uploaded);
    groupedData[periodKey] = (groupedData[periodKey] || 0) + 1;
  });

  return groupedData;
};

// Create chart data
const generateMonthlyUploadsData = (data: any[]) => {
  const uploadsByMonth = countUploadsByPeriod(data, "month"); // Group by month
  const labels = Object.keys(uploadsByMonth);
  const uploadCounts = Object.values(uploadsByMonth);

  return {
    labels,
    datasets: [
      {
        label: "Document Uploads",
        data: uploadCounts,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };
};


const monthlyUploadsChartData = generateMonthlyUploadsData(documents.data);
  
  return (
<div className="flex flex-col h-screen w-screen bg-[#4682B4] p-8 min-h-screen">
{role === "client" && (
  <div className="grid grid-cols-1 gap-6">
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h1 className="text-sm font-bold">Welcome, {user.data?.full_name}</h1>
      <p className="mt-2">Email: {user.data?.email}</p>

      <div className="mt-8 px-6 bg-[#4682B4] border border-gray-700">
  <h3 className="text-2xl font-semibold text-white mb-6">Document Request Status Overview</h3>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col justify-between border-l-4 border-blue-600">
      <h5 className="text-xl font-semibold text-gray-700 mb-3">Pending Requests</h5>
      <p className="text-4xl font-bold text-gray-900">
        {
          [...document_requests.data, ...authorizationRequests.data]
            .filter((request: DocumentRequestType | AuthorizationRequestType) => request.status === "pending")
            .length 
        }
      </p>
      <p className="text-sm text-gray-600 mt-2">Total pending requests for Document Reproduction and Authentication.</p>
    </div>

    <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col justify-between border-l-4 border-yellow-600">
      <h5 className="text-xl font-semibold text-gray-700 mb-3">Unclaimed Items</h5>
      <div className="flex flex-col sm:flex-row justify-between gap-6">
        <Link
          to="/authorization_requests/list/"
          className="flex flex-col items-center text-center text-gray-700 hover:text-blue-600 transition duration-200 w-full sm:w-1/2 p-4 bg-blue-50 rounded-lg shadow hover:shadow-md"
        >
          <h4 className="text-lg font-semibold">Authorization</h4>
          <p className="text-2xl font-bold">
            {
              [...authorizationRequests.data].filter(
                (request: AuthorizationRequestType) => request.status === "unclaimed"
              ).length
            }
          </p>
        </Link>

        <Link
          to="/requests/list/"
          className="flex flex-col items-center text-center text-gray-700 hover:text-purple-600 transition duration-200 w-full sm:w-1/2 p-4 bg-purple-50 rounded-lg shadow hover:shadow-md"
        >
          <h4 className="text-lg font-semibold">Reproduction</h4>
          <p className="text-2xl font-bold">
            {
              [...document_requests.data].filter(
                (request: DocumentRequestType) => request.status === "unclaimed"
              ).length
            }
          </p>
        </Link>
      </div>
      <p className="text-sm text-gray-600 mt-2">Unclaimed requests for both Authentication and Document Reproduction.</p>
    </div>

    <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col justify-between border-l-4 border-green-600">
      <h5 className="text-xl font-semibold text-gray-700 mb-3">Requests This Month</h5>
      <p className="text-4xl font-bold text-gray-900">
        {
          [...document_requests.data, ...authorizationRequests.data]
            .filter((request: DocumentRequestType | AuthorizationRequestType) => {
              const requestDate = new Date(request.date_requested); // Assuming `created_at` exists
              const currentMonth = new Date().getMonth();
              const currentYear = new Date().getFullYear();
              return requestDate.getMonth() === currentMonth && requestDate.getFullYear() === currentYear;
            }).length
        }
      </p>
      <p className="text-sm text-gray-600 mt-2">Document and Authentication requests submitted this month.</p>
    </div>
  </div>
</div>


<div className="mt-4 max-w-full overflow-x-auto bg-blue-200 border border-gray-700">
  <div className="max-h-[400px] scrollbar-hide overflow-y-auto space-y-2 flex flex-col sm:space-y-3 lg:space-y-4">
  <h4 className="text-lg font-semibold">Request Report</h4>
    {[...document_requests.data, ...authorizationRequests.data]
      .filter((request) => request.status !== "pending")
      .map((request, index) => {
        if ("documents" in request && Array.isArray(request.documents)) {
          return (
            <div
              key={index}
              className="p-3 flex flex-col sm:flex-row justify-between items-start sm:items-center min-w-[280px] sm:min-w-[300px] lg:min-w-[350px]"
            >
              <div className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-0">
                {request.documents.map((doc: DocumentRequestUnitType, docIndex: number) => (
                  <p key={docIndex} className="text-xs sm:text-sm">
                    Your requested document{" "}
                    <strong>{doc.document.name}</strong> has been{" "}
                    <span
                      className={`${
                        request.status === "approved"
                          ? "text-green-600"
                          : request.status === "denied"
                          ? "text-red-600"
                          : "text-gray-700"
                      }`}
                    >
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </p>
                ))}
              </div>
            </div>
          );
        } else if ("authorizationDetail" in request) {
          return (
            <div
              key={index}
              className="p-3 flex flex-col sm:flex-row justify-between items-start sm:items-center min-w-[280px] sm:min-w-[300px] lg:min-w-[350px]"
            >
              <div className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-0">
                <p className="text-xs sm:text-sm">
                  Your authorization request for{" "}
                  <strong>{request.authorizationDetail}</strong> has been{" "}
                  <span
                    className={`${
                      request.status === "approved"
                        ? "text-green-600"
                        : request.status === "denied"
                        ? "text-red-600"
                        : "text-gray-700"
                    }`}
                  >
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </p>
              </div>
            </div>
          );
        } else {
          return null; 
        }
      })}
  </div>
</div>
    </div>
  </div>
      )}
      {role === "planning" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 items-stretch">
          <div className="bg-gradient-to-r from-green-400 via-green-500 to-green-600 p-6 rounded-lg flex flex-col shadow-lg">
            <h1 className="text-2xl font-semibold text-white">Welcome</h1>
            <p className="text-3xl font-bold mt-2 text-white">{user.data?.full_name}</p>
            <span className="block text-xl text-white mt-4">
              Email: {user.data?.email}
            </span>
            <div className="text-xl text-white mt-4">
              Role: <span className="font-semibold text-white">{role}</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col">
            <h1 className="text-2xl font-bold">Questionnaires Overview</h1>
            <p className="mt-2 text-lg text-gray-600">Monitor Clientele Survey</p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-6">
              <div className="bg-blue-100 p-6 rounded-lg shadow-lg flex flex-col items-center">
                <h2 className="text-xl font-semibold text-black-700">Total Surveys</h2>
                <p className="text-3xl font-bold text-black-800">{questionnaires.data?.length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      )} 
  
  {(role === "staff" || role === "head") && (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-6">

    {/* User Info Card */}
    <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 p-6 rounded-xl shadow-lg flex flex-col ">
      <h1 className="text-3xl font-semibold text-white font-mono">Welcome</h1>
      <p className="text-lg font-bold mt-2 text-white">{user.data?.full_name}</p>
      <span className="text-lg text-gray-200">{user.data?.email}</span>
     
      <span className="text-lg text-white mt-4 font-bold">
      <p className="text-transparent"> ________________</p>
      {new Date().toLocaleDateString("en-US", {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}
    </span>

    </div>

  
  <div className="bg-white p-6 rounded-2xl shadow-xl transition-shadow duration-300 hover:shadow-2xl">
  <h3 className="text-2xl font-semibold text-gray-900 mb-6">Request Status</h3>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {[{
      status: "Pending", 
      count: [...document_requests.data, ...authorizationRequests.data].filter(r => r.status === "pending").length, 
      color: "bg-yellow-200"
    }, {
      status: "Claimed", 
      count: [...document_requests.data, ...authorizationRequests.data].filter(r => r.status === "claimed").length, 
      color: "bg-green-200"
    }, {
      status: "Unclaimed", 
      count: [...document_requests.data, ...authorizationRequests.data].filter(r => r.status === "unclaimed").length, 
      color: "bg-red-200"
    }].map(({ status, count, color }) => (
      <div key={status} className={`flex flex-col items-center ${color} p-6 rounded-lg shadow-md transition-transform duration-300 hover:scale-105`}>
        <h4 className="text-lg font-medium text-gray-700">{status}</h4>
        <p className="text-3xl font-bold text-gray-900">{count}</p>
      </div>
    ))}
  </div>
</div>


    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Documents Uploaded <span className="font-bold">{documents.data?.length || 0}</span></h3>
      <div className="flex justify-between items-center">
        <Bar data={staffHeadChartData} className="w-64 h-40" />
      </div>
    </div>

    {/* Monthly Uploads */}
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Monthly Uploads</h3>
      <Bar data={monthlyUploadsChartData} className="w-full h-40" />
    </div>

    {/* Monthly Requests */}
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Monthly Requests</h3>
      <Bar data={monthlyRequestsChartData} className="w-full h-40" />
    </div>

    {/* Requests by Department */}
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <h3 className="text-2xl font-semibold text-gray-800 mb-6">Requests by Department</h3>
      <div className="w-48 h-48 mx-auto">
        <Pie data={collegeRequestsChartData} className="w-full h-full" /> {/* Adjusted size to fit */}
      </div>
    </div>
    
    
  </div>
)}



{role === "admin" && (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
    <div className="bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 p-6 rounded-lg shadow-lg flex flex-col">
      <h1 className="text-2xl font-semibold text-white">Welcome Admin</h1>
      <p className="text-3xl font-bold mt-2 text-white">{user.data?.full_name}</p>
      <span className="block text-xl text-white mt-4">Email: {user.data?.email}</span>
    </div>

    <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col">
  <h2 className="text-2xl font-bold">Total Users</h2>
  <p className="text-4xl font-bold mt-4 text-gray-700">
    {totalUsers.isLoading ? "Loading..." : totalUsers.data}  {/* Display total users here */}
  </p>
</div>

    <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col">
      <h2 className="text-2xl font-bold">Total Documents Uploaded</h2>
      <p className="text-4xl font-bold mt-4 text-gray-700">{documents.data?.length}</p>
      <Bar data={documentChartData} />
    </div>

<div className="bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 p-6 rounded-lg shadow-lg flex flex-col">
  <div className="flex justify-between items-center border-b-2 border-gray-300 pb-4">
    <h2 className="text-3xl font-bold text-white">Total Requests</h2>
    <span className="text-2xl font-semibold text-white">
      {document_requests.data?.length}
    </span>
  </div>

  <div className="space-y-4">
    <div className="flex justify-between bg-green-100 p-4 rounded-lg shadow-md">
      <span className="text-lg font-semibold text-green-700">Approved</span>
      <span className="text-2xl font-bold text-green-600">
        {document_requests.data?.filter(
          (request: DocumentRequestType) => request.status === "approved"
        ).length}
      </span>
    </div>

    <div className="flex justify-between bg-yellow-100 p-4 rounded-lg shadow-md">
      <span className="text-lg font-semibold text-yellow-700">Pending</span>
      <span className="text-2xl font-bold text-yellow-600">
        {document_requests.data?.filter(
          (request: DocumentRequestType) => request.status === "pending"
        ).length}
      </span>
    </div>

    <div className="flex justify-between bg-red-100 p-4 rounded-lg shadow-md">
      <span className="text-lg font-semibold text-red-700">Denied</span>
      <span className="text-2xl font-bold text-red-600">
        {document_requests.data?.filter(
          (request: DocumentRequestType) => request.status === "denied"
        ).length}
      </span>
      </div>
    </div>
  </div>
</div>
)}
</div>
);
}