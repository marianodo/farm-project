import {
  Accordion,
  AccordionButton,
  AccordionItem,
  Box,
  Highlight,
  Text,
} from "@chakra-ui/react";
import { Link, useNavigate, useParams } from "react-router-dom";

import Loader from "../../Loader/Loader";
import ModalMeasurements from "../ModalMeasurements/ModalMeasurements";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";

const NewReport = ({ messageToast }) => {
  const navigate = useNavigate();
  const [pens, setPens] = useState([]);
  const [loader, setLoader] = useState(true);
  const params = useParams();
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/pen?fieldId=${params.fieldId}`)
      .then((response) => {
        setPens(response.data);
        setLoader(false);
      });
  }, []);

  if (loader) return <Loader />;
  return (
    <Box marginTop={6}>
      <ToastContainer />
      <Box
        display={"flex"}
        flexDirection={["column", "row"]}
        justifyContent={["center", "space-between"]}
        gap={4}
        marginBottom={8}
      >
        <Text
          as="b"
          color={"#edeef1"}
          fontSize={["18px", "20px"]}
          fontWeight={500}
          textAlign={"center"}
        >
          Campo:{" "}
          {pens[0]?.field?.name ? (
            <Highlight
              textAlign="center"
              query={`${pens[0]?.field?.name}`}
              styles={{
                px: "1",
                rounded: "8px",
                color: "#edeef1",
                paddingBottom: "2px",
                paddingTop: "0px",
                bg: "#2B6CB0",
              }}
            >
              {`${pens[0]?.field?.name}`}
            </Highlight>
          ) : (
            pens[0]?.field?.name
          )}
        </Text>
        <Text
          as="b"
          color={"#edeef1"}
          fontSize={["18px", "20px"]}
          fontWeight={500}
          textAlign={"center"}
        >
          Reporte:{" "}
          <Highlight
            textAlign="center"
            query={`${params.reportId}`}
            styles={{
              px: "3",
              rounded: "8px",
              color: "#edeef1",
              paddingBottom: "2px",
              paddingTop: "0px",
              bg: "#2B6CB0",
            }}
          >
            {params.reportId}
          </Highlight>
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
          bg="#edeef1"
          color="#1a1a1a"
          fontWeight={500}
          fontSize={["15px", "15px"]}
          _hover={{ bg: "white", color: "#1a1a1a", cursor: "pointer" }}
          textTransform="uppercase"
        >
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
      <Box marginTop={4} style={{ height: "calc(100vh - 17.4rem)" }}>
        <Box height={"100%"} overflowY={"auto"}>
          <Accordion
            borderTopWidth={0}
            borderBottomWidth={1}
            minHeight={"100%"}
            allowToggle
          >
            {pens.map((pen, i) => (
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
                    <AccordionButton>
                      <Box flex="1" textAlign="left">
                        <Box display={"flex"} gap={1}>
                          <Text as="b" color={"#edeef1"} marginRight={4}>
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
