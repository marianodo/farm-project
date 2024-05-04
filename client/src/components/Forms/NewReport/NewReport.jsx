import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Tag,
  Text,
  Tooltip,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Link, useParams } from "react-router-dom";

import ModalMeasurements from "../ModalMeasurements/ModalMeasurements";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";

const NewReport = ({ messageToast }) => {
  const [pens, setPens] = useState([]);
  const params = useParams();
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:5000/pen?fieldId=${params.fieldId}`)
      .then((response) => {
        console.log(response);
        setPens(response);
      });

    // messageToast("New Report", "success");
  }, []);
  console.log(pens);

  return (
    <div>
      <h1>New Report</h1>
      <Accordion>
        <Text as="mark" background="#2B6CB0" color="white" fontWeight={500}>
          Corrales
        </Text>
        <AccordionItem
          borderBottom={0}
          paddingTop={2}
          paddingBottom={1}
          borderTopColor="#2B6CB0"
        >
          <Box display={"flex"} flexDirection={"column"}>
            <AccordionPanel pb={4}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </AccordionPanel>
          </Box>
        </AccordionItem>

        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                Section 2 title
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default NewReport;
