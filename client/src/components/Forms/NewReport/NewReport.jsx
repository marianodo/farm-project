import {
  Accordion,
  AccordionButton,
  AccordionItem,
  Box,
  Text,
} from "@chakra-ui/react";
import { Link, useNavigate, useParams } from "react-router-dom";

import ModalMeasurements from "../ModalMeasurements/ModalMeasurements";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";

const NewReport = ({ messageToast }) => {
  const navigate = useNavigate();
  const [pens, setPens] = useState([]);
  const params = useParams();
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/pen?fieldId=${params.fieldId}`)
      .then((response) => {
        setPens(response.data);
      });
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
          Campo: {pens[0]?.field?.name}
        </Text>
        <Text
          as="b"
          fontSize={["18px", "20px"]}
          fontWeight={500}
          textAlign={"center"}
        >
          Reporte: {params.reportId}
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
          background="#2B6CB0"
          color="white"
          fontWeight={500}
          textTransform="uppercase"
          fontSize={["15px", "15px"]}
        >
          Corrales
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
              width: "4.23rem",
              marginLeft: "-3.6px",
            }}
          />
          <Link onClick={() => navigate(-1)}>Volver</Link>
        </Text>
        <hr
          color="#2B6CB0"
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
            {pens.map((pen, i) => (
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
                        <Box display={"flex"} gap={1}>
                          <Text as="b" marginRight={4}>
                            {pen.name}
                          </Text>
                        </Box>
                      </Box>
                      <Box marginLeft={4}>
                        <ModalMeasurements
                          messageToast={messageToast}
                          name={pen.name}
                          report_id={params.reportId}
                          pen_id={pen.id}
                        />
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

export default NewReport;
