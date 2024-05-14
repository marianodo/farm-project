import {
  Accordion,
  AccordionButton,
  AccordionItem,
  Box,
  Button,
  Text,
} from "@chakra-ui/react";
import { DeleteIcon, ViewIcon } from "@chakra-ui/icons";
import { Link, useParams } from "react-router-dom";

import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";

const Reports = ({ messageToast }) => {
  const [reports, setReports] = useState([]);
  const params = useParams();
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/report?fieldId=${1}`)
      .then((response) => {
        setReports(response.data);
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
      <Box marginTop={3} style={{ height: "calc(100vh - 18rem)" }}>
        <Box maxHeight={"100%"} overflowY={"auto"}>
          <Accordion borderTopWidth={0} borderBottomWidth={0} allowToggle>
            {reports?.map((report, i) => (
              <>
                <AccordionItem
                  border={"1px solid black"}
                  borderBottom={"0px solid black"}
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
                        <Text as="b" marginRight={4}>
                          {report.name ? report.name : "Reporte: " + report.id}
                        </Text>
                        <Link to={`/reportDetail/${report.id} `}>
                          <button
                            className="badge m-1"
                            style={{ background: "#666666", color: "white" }}
                          >
                            <ViewIcon boxSize={3} />
                          </button>
                        </Link>
                        <button className="badge bg-danger m-1">
                          <DeleteIcon boxSize={3} />
                        </button>
                      </Box>
                      <Box padding={0} margin={0}>
                        <Button
                          as={Link}
                          to={`/reportMeasurement/${params.fieldId}/${report.id}`}
                          backgroundColor="#1A1A1A"
                          color={"#fff"}
                          size="xs"
                          cursor={"pointer"}
                          _hover={{
                            backgroundColor: "white",
                            color: "#1a1a1a",
                          }}
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
  );
};

export default Reports;
