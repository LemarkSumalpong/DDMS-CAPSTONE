import { useLocation } from "react-router";
import { PDFViewer } from "@react-pdf/renderer";
import CRS03AuthorizationRequestDocument from "@/components/CRS03AuthorizationRequestDocument";
import CRS03DocumentRequestDocument from "@/components/CRS03DocumentRequestDocument";

export default function ExportCRS03Page() {
  const location = useLocation();

  return (
    <div className="flex flex-col h-screen w-full overflow-y-scroll justify-center items-center p-4 bg-white mt-8">
      {location.state.authorization_request ? (
        <PDFViewer className="flex h-screen w-full items-center justify-center p-4 overflow-y-scroll">
          <CRS03AuthorizationRequestDocument
            authorization_request={location.state.authorization_request}
          />
        </PDFViewer>
      ) : (
        <></>
      )}
      {location.state.document_request ? (
        <PDFViewer className="flex h-screen w-full items-center justify-center p-4 overflow-y-scroll">
          <CRS03DocumentRequestDocument
            document_request={location.state.document_request}
          />
        </PDFViewer>
      ) : (
        <></>
      )}
    </div>
  );
}
