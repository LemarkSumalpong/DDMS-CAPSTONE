import { Page, Text, Document, StyleSheet, Image } from "@react-pdf/renderer";
import { QuestionnaireType } from "./API";
import QuestionnaireImage from "/FM-USTP-006-1.png";

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
  questionnaire: QuestionnaireType;
};

export default function QuestionnaireDocument(props: props) {
  let client_type_checkbox_location,
    i_am_a_checkbox_location,
    cc1_checkbox_location,
    cc2_checkbox_location,
    cc3_checkbox_location,
    sqd0_check_location,
    sqd1_check_location,
    sqd2_check_location,
    sqd3_check_location,
    sqd4_check_location,
    sqd5_check_location,
    sqd6_check_location,
    sqd7_check_location,
    sqd8_check_location;

  if (props.questionnaire.client_type == "citizen") {
    client_type_checkbox_location = "-38px";
  } else if (props.questionnaire.client_type == "business") {
    client_type_checkbox_location = "4px";
  } else {
    client_type_checkbox_location = "46px";
  }

  if (props.questionnaire.i_am_a == "faculty") {
    i_am_a_checkbox_location = "-182px";
  } else if (props.questionnaire.i_am_a == "non-teaching staff") {
    i_am_a_checkbox_location = "-140px";
  } else if (props.questionnaire.i_am_a == "student") {
    i_am_a_checkbox_location = "-56px";
  } else if (props.questionnaire.i_am_a == "guardian") {
    i_am_a_checkbox_location = "-9px";
  } else if (props.questionnaire.i_am_a == "alumna") {
    i_am_a_checkbox_location = "104px";
  } else {
    i_am_a_checkbox_location = "148px";
  }

  if (props.questionnaire.q1_answer == "1") {
    cc1_checkbox_location = {
      left: "80px",
      top: "260px",
    };
  } else if (props.questionnaire.q1_answer == "2") {
    cc1_checkbox_location = {
      left: "80px",
      top: "270px",
    };
  } else if (props.questionnaire.q1_answer == "3") {
    cc1_checkbox_location = {
      left: "80px",
      top: "280px",
    };
  } else if (props.questionnaire.q1_answer == "4") {
    cc1_checkbox_location = {
      left: "80px",
      top: "290px",
    };
  }

  if (props.questionnaire.q2_answer == "1") {
    cc2_checkbox_location = {
      left: "81px",
      top: "320px",
    };
  } else if (props.questionnaire.q2_answer == "2") {
    cc2_checkbox_location = {
      left: "81px",
      top: "330px",
    };
  } else if (props.questionnaire.q2_answer == "3") {
    cc2_checkbox_location = {
      left: "81px",
      top: "340px",
    };
  } else if (props.questionnaire.q2_answer == "4") {
    cc2_checkbox_location = {
      left: "317px",
      top: "320px",
    };
  } else {
    cc2_checkbox_location = {
      left: "317px",
      top: "330px",
    };
  }

  if (props.questionnaire.q3_answer == "1") {
    cc3_checkbox_location = {
      left: "82px",
      top: "370px",
    };
  } else if (props.questionnaire.q3_answer == "2") {
    cc3_checkbox_location = {
      left: "81px",
      top: "382px",
    };
  } else if (props.questionnaire.q3_answer == "3") {
    cc3_checkbox_location = {
      left: "317px",
      top: "370px",
    };
  } else {
    cc3_checkbox_location = {
      left: "317px",
      top: "382px",
    };
  }

  if (props.questionnaire.sqd0_answer == "1") {
    sqd0_check_location = {
      left: "280px",
      top: "480px",
    };
  } else if (props.questionnaire.sqd0_answer == "2") {
    sqd0_check_location = {
      left: "325px",
      top: "480px",
    };
  } else if (props.questionnaire.sqd0_answer == "3") {
    sqd0_check_location = {
      left: "370px",
      top: "480px",
    };
  } else if (props.questionnaire.sqd0_answer == "4") {
    sqd0_check_location = {
      left: "415px",
      top: "480px",
    };
  } else if (props.questionnaire.sqd0_answer == "5") {
    sqd0_check_location = {
      left: "460px",
      top: "480px",
    };
  } else {
    sqd0_check_location = {
      left: "505px",
      top: "480px",
    };
  }

  if (props.questionnaire.sqd1_answer == "1") {
    sqd1_check_location = {
      left: "280px",
      top: "495px",
    };
  } else if (props.questionnaire.sqd1_answer == "2") {
    sqd1_check_location = {
      left: "325px",
      top: "495px",
    };
  } else if (props.questionnaire.sqd1_answer == "3") {
    sqd1_check_location = {
      left: "370px",
      top: "495px",
    };
  } else if (props.questionnaire.sqd1_answer == "4") {
    sqd1_check_location = {
      left: "415px",
      top: "495px",
    };
  } else if (props.questionnaire.sqd1_answer == "5") {
    sqd1_check_location = {
      left: "460px",
      top: "495px",
    };
  } else {
    sqd1_check_location = {
      left: "505px",
      top: "495px",
    };
  }

  props.questionnaire.sqd2_answer = "2";
  if (props.questionnaire.sqd2_answer == "1") {
    sqd2_check_location = {
      left: "280px",
      top: "510px",
    };
  } else if (props.questionnaire.sqd2_answer == "2") {
    sqd2_check_location = {
      left: "325px",
      top: "510px",
    };
  } else if (props.questionnaire.sqd2_answer == "3") {
    sqd2_check_location = {
      left: "370px",
      top: "510px",
    };
  } else if (props.questionnaire.sqd2_answer == "4") {
    sqd2_check_location = {
      left: "415px",
      top: "510px",
    };
  } else if (props.questionnaire.sqd2_answer == "5") {
    sqd2_check_location = {
      left: "460px",
      top: "510px",
    };
  } else {
    sqd2_check_location = {
      left: "505px",
      top: "510px",
    };
  }

  if (props.questionnaire.sqd3_answer == "1") {
    sqd3_check_location = {
      left: "280px",
      top: "540px",
    };
  } else if (props.questionnaire.sqd3_answer == "2") {
    sqd3_check_location = {
      left: "325px",
      top: "540px",
    };
  } else if (props.questionnaire.sqd3_answer == "3") {
    sqd3_check_location = {
      left: "370px",
      top: "540px",
    };
  } else if (props.questionnaire.sqd3_answer == "4") {
    sqd3_check_location = {
      left: "415px",
      top: "540px",
    };
  } else if (props.questionnaire.sqd3_answer == "5") {
    sqd3_check_location = {
      left: "460px",
      top: "540px",
    };
  } else {
    sqd3_check_location = {
      left: "505px",
      top: "540px",
    };
  }

  if (props.questionnaire.sqd4_answer == "1") {
    sqd4_check_location = {
      left: "280px",
      top: "560px",
    };
  } else if (props.questionnaire.sqd4_answer == "2") {
    sqd4_check_location = {
      left: "325px",
      top: "560px",
    };
  } else if (props.questionnaire.sqd4_answer == "3") {
    sqd4_check_location = {
      left: "370px",
      top: "560px",
    };
  } else if (props.questionnaire.sqd4_answer == "4") {
    sqd4_check_location = {
      left: "415px",
      top: "560px",
    };
  } else if (props.questionnaire.sqd4_answer == "5") {
    sqd4_check_location = {
      left: "460px",
      top: "560px",
    };
  } else {
    sqd4_check_location = {
      left: "505px",
      top: "560px",
    };
  }

  if (props.questionnaire.sqd5_answer == "1") {
    sqd5_check_location = {
      left: "280px",
      top: "580px",
    };
  } else if (props.questionnaire.sqd5_answer == "2") {
    sqd5_check_location = {
      left: "325px",
      top: "580px",
    };
  } else if (props.questionnaire.sqd5_answer == "3") {
    sqd5_check_location = {
      left: "370px",
      top: "580px",
    };
  } else if (props.questionnaire.sqd5_answer == "4") {
    sqd5_check_location = {
      left: "415px",
      top: "580px",
    };
  } else if (props.questionnaire.sqd5_answer == "5") {
    sqd5_check_location = {
      left: "460px",
      top: "580px",
    };
  } else {
    sqd5_check_location = {
      left: "505px",
      top: "580px",
    };
  }

  if (props.questionnaire.sqd6_answer == "1") {
    sqd6_check_location = {
      left: "280px",
      top: "600px",
    };
  } else if (props.questionnaire.sqd6_answer == "2") {
    sqd6_check_location = {
      left: "325px",
      top: "600px",
    };
  } else if (props.questionnaire.sqd6_answer == "3") {
    sqd6_check_location = {
      left: "370px",
      top: "600px",
    };
  } else if (props.questionnaire.sqd6_answer == "4") {
    sqd6_check_location = {
      left: "415px",
      top: "600px",
    };
  } else if (props.questionnaire.sqd6_answer == "5") {
    sqd6_check_location = {
      left: "460px",
      top: "600px",
    };
  } else {
    sqd6_check_location = {
      left: "505px",
      top: "600px",
    };
  }

  if (props.questionnaire.sqd7_answer == "1") {
    sqd7_check_location = {
      left: "280px",
      top: "620px",
    };
  } else if (props.questionnaire.sqd7_answer == "2") {
    sqd7_check_location = {
      left: "325px",
      top: "620px",
    };
  } else if (props.questionnaire.sqd7_answer == "3") {
    sqd7_check_location = {
      left: "370px",
      top: "620px",
    };
  } else if (props.questionnaire.sqd7_answer == "4") {
    sqd7_check_location = {
      left: "415px",
      top: "620px",
    };
  } else if (props.questionnaire.sqd7_answer == "5") {
    sqd7_check_location = {
      left: "460px",
      top: "620px",
    };
  } else {
    sqd6_check_location = {
      left: "505px",
      top: "620px",
    };
  }

  if (props.questionnaire.sqd8_answer == "1") {
    sqd8_check_location = {
      left: "280px",
      top: "620px",
    };
  } else if (props.questionnaire.sqd8_answer == "2") {
    sqd8_check_location = {
      left: "325px",
      top: "620px",
    };
  } else if (props.questionnaire.sqd8_answer == "3") {
    sqd8_check_location = {
      left: "370px",
      top: "620px",
    };
  } else if (props.questionnaire.sqd8_answer == "4") {
    sqd8_check_location = {
      left: "415px",
      top: "620px",
    };
  } else if (props.questionnaire.sqd8_answer == "5") {
    sqd8_check_location = {
      left: "460px",
      top: "620px",
    };
  } else {
    sqd6_check_location = {
      left: "505px",
      top: "620px",
    };
  }
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text
          style={{
            width: "256px",
            position: "absolute",
            left: client_type_checkbox_location,
            top: "174px",
            textAlign: "center",
            fontSize: 12,
          }}
        >
          /
        </Text>
        <Text
          style={{
            width: "256px",
            position: "absolute",
            left: "-26px",
            top: "188px",
            textAlign: "center",
            fontSize: 8,
          }}
        >
          {props.questionnaire.date_submitted}
        </Text>
        <Text
          style={{
            width: "256px",
            position: "absolute",
            left: props.questionnaire.sex == "male" ? "86px" : "124px",
            top: "184px",
            textAlign: "center",
            fontSize: 12,
          }}
        >
          /
        </Text>
        <Text
          style={{
            width: "256px",
            position: "absolute",
            left: "220px",
            top: "188px",
            textAlign: "center",
            fontSize: 8,
          }}
        >
          {props.questionnaire.age}
        </Text>
        <Text
          style={{
            width: "256px",
            position: "absolute",
            left: "4px",
            top: "196px",
            textAlign: "center",
            fontSize: 8,
          }}
        >
          {props.questionnaire.region_of_residence}
        </Text>
        <Text
          style={{
            width: "256px",
            position: "absolute",
            left: "248px",
            top: "196px",
            textAlign: "left",
            fontSize: 8,
          }}
        >
          {props.questionnaire.service_availed}
        </Text>
        <Text
          style={{
            width: "256px",
            position: "absolute",
            left: i_am_a_checkbox_location,
            top: "208px",
            textAlign: "right",
            fontSize: 8,
          }}
        >
          /
        </Text>
        <Text
          style={{
            width: "256px",
            position: "absolute",
            right: "32px",
            top: "208px",
            textAlign: "right",
            fontSize: 8,
          }}
        >
          {props.questionnaire.i_am_a_other}
        </Text>
        <Text
          style={{
            position: "absolute",
            left: cc1_checkbox_location?.left,
            top: cc1_checkbox_location?.top,
            textAlign: "center",
            fontSize: 8,
          }}
        >
          /
        </Text>
        <Text
          style={{
            position: "absolute",
            left: cc2_checkbox_location?.left,
            top: cc2_checkbox_location?.top,
            textAlign: "center",
            fontSize: 8,
          }}
        >
          /
        </Text>
        <Text
          style={{
            position: "absolute",
            left: cc3_checkbox_location?.left,
            top: cc3_checkbox_location?.top,
            textAlign: "center",
            fontSize: 8,
          }}
        >
          /
        </Text>

        <Text
          style={{
            position: "absolute",
            left: sqd0_check_location?.left,
            top: sqd0_check_location?.top,
            textAlign: "center",
            fontSize: 12,
          }}
        >
          /
        </Text>
        <Text
          style={{
            position: "absolute",
            left: sqd1_check_location?.left,
            top: sqd1_check_location?.top,
            textAlign: "center",
            fontSize: 12,
          }}
        >
          /
        </Text>
        <Text
          style={{
            position: "absolute",
            left: sqd2_check_location?.left,
            top: sqd2_check_location?.top,
            textAlign: "center",
            fontSize: 12,
          }}
        >
          /
        </Text>
        <Text
          style={{
            position: "absolute",
            left: sqd3_check_location?.left,
            top: sqd3_check_location?.top,
            textAlign: "center",
            fontSize: 12,
          }}
        >
          /
        </Text>
        <Text
          style={{
            position: "absolute",
            left: sqd4_check_location?.left,
            top: sqd4_check_location?.top,
            textAlign: "center",
            fontSize: 12,
          }}
        >
          /
        </Text>
        <Text
          style={{
            position: "absolute",
            left: sqd5_check_location?.left,
            top: sqd5_check_location?.top,
            textAlign: "center",
            fontSize: 12,
          }}
        >
          /
        </Text>
        <Text
          style={{
            position: "absolute",
            left: sqd6_check_location?.left,
            top: sqd6_check_location?.top,
            textAlign: "center",
            fontSize: 12,
          }}
        >
          /
        </Text>
        <Text
          style={{
            position: "absolute",
            left: sqd7_check_location?.left,
            top: sqd7_check_location?.top,
            textAlign: "center",
            fontSize: 12,
          }}
        >
          /
        </Text>
        <Text
          style={{
            position: "absolute",
            left: sqd8_check_location?.left,
            top: sqd8_check_location?.top,
            textAlign: "center",
            fontSize: 12,
          }}
        >
          /
        </Text>
        <Text
          style={{
            width: "512px",
            position: "absolute",
            left: "43px",
            bottom: "148px",
            textAlign: "left",
            fontSize: 8,
          }}
        >
          {props.questionnaire.extra_suggestions}
        </Text>
        <Text
          style={{
            width: "256px",
            position: "absolute",
            left: "30px",
            bottom: "110px",
            textAlign: "center",
            fontSize: 8,
          }}
        >
          {props.questionnaire.client}
        </Text>

        <Image
          style={{ position: "absolute", zIndex: -1, top: 0, width: "100%" }}
          src={QuestionnaireImage}
        />
      </Page>
    </Document>
  );
}
