import {
  Accordion,
  AccordionButton,
  AccordionItem,
  Box,
  Button,
  Heading,
  Highlight,
  Text,
} from "@chakra-ui/react";
import { ArrowBackIcon, DeleteIcon, ViewIcon } from "@chakra-ui/icons";
import { Link, useParams } from "react-router-dom";

import Loader from "../../Loader/Loader";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Reports = ({ messageToast }) => {
  const [reports, setReports] = useState([]);
  const [loader, setLoader] = useState(true);
  const navigate = useNavigate();
  const params = useParams();
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/report`)
      .then((response) => {
        const reportFilter = response.data.filter(
          (report) => report.field_id == params.fieldId
        );
        setReports(reportFilter);
        if (response.data.message)
          messageToast(response.data.message, "success");
        setLoader(false);
      })
      .catch((error) => {
        setLoader(false);
        messageToast(error.response.data.error);
      });
  }, []);
  if (loader) return <Loader />;
  return (
    <>
      {reports?.length <= 0 ? (
        <Heading
          height={"70vh"}
          display={"flex"}
          color={"#fff"}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
          alignSelf={"center"}
          lineHeight="tall"
          fontSize={[22, 30]}
        >
          <Highlight
            query="crea un reporte"
            styles={{ px: "2", py: "1", rounded: "full", bg: "#FFC300" }}
          >
            Nada por aca crea un reporte
          </Highlight>
          <ArrowBackIcon
            marginTop={2}
            cursor={"pointer"}
            onClick={() => navigate("/")}
          />
        </Heading>
      ) : (
        <Box marginTop={2}>
          <Box display={"flex"} flexDirection={"column"}>
            <Text
              as="b"
              fontSize={["18px", "20px"]}
              fontWeight={500}
              textAlign={"center"}
            >
              {/* Campo: {reports[0]?.field?.name} */}
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
              background="#FFC300"
              color="white"
              fontWeight={500}
              textTransform="uppercase"
              fontSize={["15px", "15px"]}
            >
              Reportes
            </Text>
            <Text
              padding={1}
              as="mark"
              bg="#edeef1"
              color="#1a1a1a"
              fontWeight={500}
              fontSize={["15px", "15px"]}
              _hover={{ bg: "white", color: "#1a1a1a", cursor: "pointer" }}
              textTransform="uppercase"
            >
              <Link to={"/"}>Volver</Link>
            </Text>
            <hr
              color="#FFC300"
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
          <Box marginTop={4} height={"calc(100vh - 11rem)"}>
            <Box height={"100%"} overflowY={"auto"}>
              <Accordion
                borderTopWidth={0}
                borderBottomWidth={1}
                minHeight={"100%"}
                allowToggle
              >
                {reports?.map((report, i) => (
                  <>
                    <AccordionItem
                      height={"5.43rem"}
                      border={"1px solid #6a788d"}
                      borderLeft={0}
                      borderRight={0}
                      // borderBottom={"0px solid black"}
                      // borderTopWidth={0}
                      borderBlockStart={0}
                      paddingTop={[2, 3, 4]}
                      paddingBottom={[2, 3, 4]}
                      key={i}
                    >
                      <Box display={"flex"} flexDirection={"column"}>
                        <AccordionButton
                          display={"flex"}
                          flexWrap={"wrap"}
                          justifyContent={"space-between"}
                        >
                          <Box>
                            <Text as="b" color={"#fff"} marginRight={4}>
                              {report.name
                                ? report.name
                                : "Reporte: " + report.id}
                            </Text>

                            {report?.measurement?.length > 0 && (
                              <Link
                                to={`/reportDetail/${params.fieldId}/${report.id} `}
                              >
                                <button
                                  className="badge m-1"
                                  style={{
                                    background: "#8894a8",
                                    color: "white",
                                  }}
                                >
                                  <ViewIcon boxSize={3} />
                                </button>
                              </Link>
                            )}

                            <button className="badge bg-danger m-1">
                              <DeleteIcon boxSize={3} />
                            </button>
                          </Box>
                          <Box padding={0} margin={0}>
                            <Button
                              as={Link}
                              to={`/reportMeasurement/${params.fieldId}/${report.id}`}
                              // backgroundColor="#1A1A1A"

                              // color={"#fff"}
                              // size="xs"
                              bg="#edeef1"
                              color="#1a1a1a"
                              size="xs"
                              cursor={"pointer"}
                              _hover={{ bg: "white", color: "#1a1a1a" }}
                              // _hover={{
                              //   backgroundColor: "white",
                              //   color: "#1a1a1a",
                              // }}
                            >
                              Crear Medicion
                            </Button>
                          </Box>
                        </AccordionButton>
                      </Box>
                    </AccordionItem>
                  </>
                ))}
              </Accordion>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Reports;
