import { Page, Text, Document, StyleSheet, Image } from "@react-pdf/renderer";
import { DocumentRequestType, DocumentRequestUnitType } from "./API";
import CRS01Image from "/FM-USTP-CRS-01.png";

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

type props = {
  document_request: DocumentRequestType;
};

export default function CRS01DocumentRequestDocument(props: props) {
  const totalCopies = props.document_request?.documents?.reduce(
    (sum, document) => sum + document.copies,
    0
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text
          style={{
            width: "256px",
            position: "absolute",
            right: "344px",
            top: "173px",
            textAlign: "center",
            fontSize: 12,
          }}
        >
          {props.document_request.date_requested}
        </Text>
        <Text
          style={{
            width: "256px",
            position: "absolute",
            right: "352px",
            top: "190px",
            textAlign: "right",
            fontSize: 12,
          }}
        >
          {props.document_request.requester}
        </Text>
        <Text
          style={{
            width: "256px",
            position: "absolute",
            right: "345px",
            top: "208px",
            textAlign: "center",
            fontSize: 12,
          }}
        >
          {props.document_request.college}
        </Text>

        {props.document_request.documents
          .slice(0, 3)
          .map((document_request_unit: DocumentRequestUnitType, index) => (
            <Text
              style={{
                display: "flex",
                flexDirection: "row",
                flexGrow: 1,
                flexBasis: 0,
                padding: 2,
                width: "512px",
                height: "120px",
                position: "absolute",
                left: "70px",
                top: 256 + index * 16 + "px",
                textAlign: "left",
                fontSize: 8,
              }}
            >
              {document_request_unit.document.name}
            </Text>
          ))}
        <Text
          style={{
            width: "256px",
            position: "absolute",
            right: "328px",
            top: "318px",
            textAlign: "center",
            fontSize: 12,
          }}
        >
          {totalCopies | 0}
        </Text>
        {props.document_request.documents.length > 3 ? (
          <Text
            style={{
              width: "256px",
              position: "absolute",
              left: "10px",
              top: "304px",
              textAlign: "center",
              fontSize: 8,
            }}
          >
            {props.document_request.documents.length - 3} additional document/s
            ommitted...
          </Text>
        ) : (
          <></>
        )}
        <Text
          style={{
            width: "512px",
            position: "absolute",
            left: "70px",
            top: "380px",
            textAlign: "left",
            fontSize: 8,
          }}
        >
          {props.document_request.purpose}
        </Text>
        <Text
          style={{
            width: "256px",
            position: "absolute",
            right: "360px",
            top: "445px",
            textAlign: "center",
            fontSize: 6,
          }}
        >
          (This email will serve as a valid signature within DDMS)
        </Text>
        <Text
          style={{
            width: "256px",
            position: "absolute",
            right: "360px",
            top: "430px",
            textAlign: "center",
            fontSize: 12,
          }}
        >
          {props.document_request.requester}
        </Text>
        <Image
          style={{ position: "absolute", zIndex: -1, top: 0, width: "100%" }}
          src={CRS01Image}
        />
      </Page>
    </Document>
  );
}
