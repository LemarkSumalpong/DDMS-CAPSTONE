import { Page, Text, Document, StyleSheet, Image } from "@react-pdf/renderer";
import { AuthorizationRequestType } from "./API";
import CRS03Image from "/FM-USTP-CRS-03.png";

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
  authorization_request: AuthorizationRequestType;
};

export default function CRS03AuthorizationRequestDocument(props: props) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text
          style={{
            width: "256px",
            position: "absolute",
            right: "350px",
            top: "175px",
            textAlign: "center",
            fontSize: 12,
          }}
        >
          {props.authorization_request.date_requested}
        </Text>
        <Text
          style={{
            width: "256px",
            position: "absolute",
            right: "355px",
            top: "185px",
            textAlign: "right",
            fontSize: 12,
          }}
        >
          {props.authorization_request.requester}
        </Text>
        <Text
          style={{
            width: "512px",
            position: "absolute",
            right: "200px",
            top: "196px",
            textAlign: "right",
            fontSize: 12,
          }}
        >
          {props.authorization_request.college}
        </Text>
        <Text
          style={{
            width: "512px",
            position: "absolute",
            right: "200px",
            top: "208px",
            textAlign: "center",
            fontSize: 12,
          }}
        >
          {props.authorization_request.purpose}
        </Text>

        {props.authorization_request.documents
          .slice(0, 20)
          .map((document, index) => (
            <Text
              key={document.id}
              style={{
                width: "768px",
                position: "absolute",
                right: "0px",
                top: 270 + index * 16 + "px",
                textAlign: "center",
                fontSize: 6,
              }}
            >
              {document.document}
            </Text>
          ))}
        {props.authorization_request.documents
          .slice(0, 20)
          .map((document, index) => (
            <Text
              key={document.id}
              style={{
                width: "768px",
                position: "absolute",
                right: "-205px",
                top: 270 + index * 16 + "px",
                textAlign: "center",
                fontSize: 12,
              }}
            >
              {document.pages}
            </Text>
          ))}
        {props.authorization_request.documents
          .slice(0, 20)
          .map((document, index) => (
            <Text
              key={document.id}
              style={{
                width: "768px",
                position: "absolute",
                right: "-295px",
                top: 270 + index * 16 + "px",
                textAlign: "center",
                fontSize: 12,
              }}
            >
              {document.copies}
            </Text>
          ))}
        <Text
          style={{
            width: "256px",
            position: "absolute",
            right: "360px",
            top: "648px",
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
            top: "636px",
            textAlign: "center",
            fontSize: 12,
          }}
        >
          {props.authorization_request.requester}
        </Text>
        <Image
          style={{ position: "absolute", zIndex: -1, top: 0, width: "100%" }}
          src={CRS03Image}
        />
      </Page>
    </Document>
  );
}
