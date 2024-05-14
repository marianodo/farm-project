import {
  Accordion,
  AccordionButton,
  AccordionItem,
  Box,
  Text,
} from "@chakra-ui/react";
import { Link, useNavigate, useParams } from "react-router-dom";

import EditModalMeasurement from "../EditModalMeasurement/EditModalMeasurement";
import { ViewIcon } from "@chakra-ui/icons";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";

const ReportDetail = ({ messageToast }) => {
  const navigate = useNavigate();
  const params = useParams();
  const [report, setReport] = useState([]);
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/report/${params.reportId}`)
      .then((response) => {
        setReport(response.data);
        if (response.data.message)
          messageToast(response.data.message, "success");
      })
      .catch((error) => messageToast(error.response.data.error));
  }, []);

  return (
    <Box>
      <Box display={"flex"} flexDirection={"column"}>
        <Text
          as="b"
          fontSize={["18px", "20px"]}
          fontWeight={500}
          textAlign={"center"}
        >
          {report.name ? report.name : "Reporte" + report.id}
        </Text>
        <Text
          as="b"
          fontSize={["18px", "20px"]}
          fontWeight={500}
          textAlign={"center"}
        >
          {/* Reporte: {params.reportId} */}
        </Text>
      </Box>
      <Box
        marginTop={4}
        display={"flex"}
        position={"relative"}
        alignItems={"baseline"}
        justifyContent={"space-between"}
      >
        <Text
          padding={1}
          as="mark"
          background="#009588"
          color="white"
          fontWeight={500}
          textTransform="uppercase"
          fontSize={["15px", "15px"]}
        >
          Mediciones
        </Text>
        <Text
          padding={1}
          as="mark"
          bg="#18181b"
          color="white"
          fontWeight={500}
          fontSize={["15px", "15px"]}
          _hover={{ bg: "white", color: "#1a1a1a", cursor: "pointer" }}
          textTransform="uppercase"
        >
          <hr
            color="black"
            width="100%"
            style={{
              cursor: "pointer",
              height: "3px",
              marginTop: "18px",
              position: "absolute",
              top: "12px",
              opacity: "1",
              border: "none",
              zIndex: 2,
              width: "4.26rem",
              marginLeft: "-3.9px",
            }}
          />
          <Link onClick={() => navigate(-1)}>Volver</Link>
        </Text>
        <hr
          color="#009588"
          width="100%"
          style={{
            height: "3px",
            marginTop: "18px",
            position: "absolute",
            top: "12px",
            opacity: "1",
            border: "none",
          }}
        />
      </Box>
      <Box marginTop={3} style={{ height: "calc(100vh - 18rem)" }}>
        <Box maxHeight={"100%"} overflowY={"auto"}>
          {report?.grouped_measurements &&
            Object.keys(report?.grouped_measurements)?.map((k) => (
              <>
                <Box marginBottom={4} marginTop={2}>
                  <Text as="b" fontSize={20}>
                    {report?.grouped_measurements[k][0]?.object.name}
                  </Text>
                </Box>
                <Accordion borderTopWidth={0} borderBottomWidth={0} allowToggle>
                  {report?.grouped_measurements[k]?.map((m, i) => (
                    <>
                      <AccordionItem
                        border={"1px solid black"}
                        borderBottom={"0px solid black"}
                        paddingTop={[2, 3, 4]}
                        paddingBottom={[2, 3, 4]}
                        key={i}
                      >
                        <Box display={"flex"} flexDirection={"column"}>
                          <AccordionButton>
                            <Box flex="1" textAlign="left">
                              <Box
                                display={"flex"}
                                gap={1}
                                alignItems={"center"}
                              >
                                <Box
                                  display={"flex"}
                                  flexDirection={"column"}
                                  justifyContent={"center"}
                                  gap={1}
                                >
                                  <Text
                                    as="b"
                                    marginRight={4}
                                    textTransform={"uppercase"}
                                  >
                                    {"ID:" +
                                      m.id +
                                      " " +
                                      m.pen_variable.pen.name}
                                  </Text>
                                  <Text as="sub" textTransform={"uppercase"}>
                                    {m.pen_variable.variable.name}
                                  </Text>
                                </Box>
                                <button
                                  className="badge m-1"
                                  style={{
                                    background: "#666666",
                                    color: "white",
                                    height: "22.08px",
                                  }}
                                >
                                  <ViewIcon boxSize={3} />
                                </button>
                                <Box marginLeft={0}>
                                  <EditModalMeasurement
                                    messageToast={messageToast}
                                    pen_variable={m.pen_variable}
                                    valueM={m.value}
                                    id={m.id}
                                  />
                                </Box>
                              </Box>
                            </Box>
                          </AccordionButton>
                        </Box>
                      </AccordionItem>
                    </>
                  ))}
                </Accordion>
              </>
            ))}
        </Box>
      </Box>
    </Box>
  );
};

export default ReportDetail;