import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  ButtonGroup,
  Grid,
  GridItem,
  Switch,
  Tag,
  Text,
  Tooltip,
  Wrap,
  WrapItem,
  useDisclosure,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";

import CorralReport from "../ModalMeasurements/ModalMeasurements";
import { Link } from "react-router-dom";
import ModalField from "./ModalField";
import ModalReport from "./ModalReport";
import axios from "axios";

const CreateField = ({ messageToast }) => {
  const [fields, setFields] = useState([]);
  const [measurements, setMeasurements] = useState({});
  const [edit, setEdit] = useState(false);
  const { onOpen } = useDisclosure();
  const [fieldName, setFieldName] = useState("");
  const [fieldId, setFieldId] = useState("");

  // const [isChecked, setIsChecked] = useState(false);
  const addField = (field) => {
    setFields([...fields, field]);
  };

  const getSizeMeasurements = (field_id) => {
    const fieldFound = fields.find((field) => field.id === field_id);
    if (!fieldFound) {
      return 0;
    }
    let size_variable = 0;
    fieldFound.pens.forEach((e) => {
      size_variable = size_variable + e.pen_variable.length;
    });
    return size_variable;
  };

  const addMeasurements = (measurement) => {
    setMeasurements({ ...measurements, ...measurement });
  };

  useEffect(() => {
    if (!fields.length) {
      axios
        .get(`${import.meta.env.VITE_API_BASE_URL}/field`)
        .then((response) => {
          setFields(response.data ? response.data : []);
        })
        .catch((error) => console.log(error));
    }
  }, [fields?.length]);

  return (
    <div>
      <Box
        as="span"
        flex="1"
        textAlign="left"
        justifyContent={"space-between"}
        display={"flex"}
        paddingX={2}
        paddingTop={6}
        paddingBottom={6}
      >
        <h1>Jhon Doe</h1>
        <ModalField
          setFields={setFields}
          fieldName={fieldName}
          fieldId={fieldId}
          setFieldName={setFieldName}
          editOpen={onOpen}
          edit={edit}
          setEdit={setEdit}
          addField={addField}
          messageToast={messageToast}
        />
      </Box>
      <Accordion borderTopWidth={0} borderBottomWidth={0} allowToggle>
        {fields.map((field, index) => (
          <>
            <Text
              paddingY={1}
              as="mark"
              background="#2F855A"
              color="white"
              fontWeight={500}
            >
              Campo
            </Text>
            <AccordionItem
              key={index}
              paddingTop={2}
              paddingBottom={3}
              borderTopWidth={2}
              borderBlockEnd={0}
              borderTopColor="#2F855A"
              width={"100%"}
              alignItems={"center"}
            >
              <Box display={"flex"} flexDirection={["column"]}>
                <AccordionButton
                  p={0}
                  display={"grid"}
                  // alignItems={"center"}
                  // justifyContent={"space-between"}
                >
                  <Grid
                    templateAreas={[
                      `"text-icon accordion-icon"
                  "button-group button-group"
                  "corral corral"`,
                      `"text-icon accordion-icon"
                  "button-group button-group"
                  "corral corral"`,
                      `"text-icon  button-group accordion-icon"
                      "corral corral corral"`,
                      `"text-icon  button-group accordion-icon"
                      "corral corral corral"`,
                    ]}
                    gridTemplateRows={[
                      "30px 1fr auto",
                      "30px 1fr auto",
                      "50px auto",
                      "50px auto",
                    ]}
                    gridTemplateColumns={[
                      "70% 30%",
                      "70% 30%",
                      "1fr auto",
                      "auto 240px 40px",
                    ]}
                    alignItems={"center"}
                    justifyItems={"center"}
                    pb={0}
                  >
                    <GridItem justifySelf={["left"]} pl="0" area={"text-icon"}>
                      <Text as="b" marginRight={0}>
                        {field.name}
                      </Text>
                      <ButtonGroup pl={2}>
                        <button
                          className="badge bg-info m-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEdit(true);
                            setFieldName(field.name);
                            setFieldId(field.id);
                            onOpen();
                          }}
                        >
                          <EditIcon boxSize={3} />
                        </button>
                        <button className="badge bg-danger m-1">
                          <DeleteIcon
                            boxSize={3}
                            onClick={async (event) => {
                              event.stopPropagation();
                              await axios.delete(
                                `${import.meta.env.VITE_API_BASE_URL}/field/${
                                  field.id
                                }`
                              );
                              const updatedFields = fields.filter(
                                (f) => f.id !== field.id
                              );
                              setFields(updatedFields);
                              alert("Campo eliminado");
                            }}
                          />
                        </button>
                      </ButtonGroup>
                    </GridItem>
                    <GridItem area={"accordion-icon"} justifySelf={["right"]}>
                      <AccordionIcon />
                    </GridItem>
                    <GridItem
                      justifySelf={["left"]}
                      pt={[3, 3, 3, 1]}
                      area={"corral"}
                    >
                      <Wrap>
                        {field?.pens.map((e, i) => (
                          <WrapItem key={i}>
                            <Tooltip label="Corral">
                              <Tag p>{e.name}</Tag>
                            </Tooltip>
                          </WrapItem>
                        ))}
                      </Wrap>
                    </GridItem>
                    <GridItem
                      paddingTop={[2, 2, 2, 0]}
                      area={"button-group"}
                      justifySelf={["left", "left", "left", "auto"]}
                      width={"100%"}
                    >
                      <ButtonGroup
                        display={"flex"}
                        justifyContent={[
                          "space-between",
                          "space-between",
                          "center",
                          "center",
                        ]}
                      >
                        <ModalReport
                          messageToast={messageToast}
                          field_id={field.id}
                          measurements={measurements}
                          pens_size={getSizeMeasurements(field.id)}
                        />

                        {/* <Switch
                            size="sm"
                            pl={3}
                            id="isChecked"
                            isChecked={isChecked[index]}
                            onChange={() => {
                              const newIsChecked = [...isChecked];
                              newIsChecked[index] = !isChecked[index];
                              setIsChecked(newIsChecked);
                            }}
                          /> */}

                        {/* <GridItem
                      justifySelf={["end", "end", "end", "auto"]}
                      paddingTop={[2]}
                      area={"button-corral"}
                    > */}
                        <Button
                          as={Link}
                          to={`/newPen/${field.name}/${field.id}`}
                          bg="#1a1a1a"
                          color="white"
                          size="sm"
                          px={[2, 3]}
                          fontSize={["8.4px", "10px"]}
                          textTransform="uppercase"
                          _hover={{ bg: "white", color: "#1a1a1a" }}
                          // onClick={onOpen}
                        >
                          Crear Corral
                        </Button>
                      </ButtonGroup>
                    </GridItem>
                    {/* </GridItem> */}
                  </Grid>
                  <Box></Box>
                </AccordionButton>
                <AccordionPanel paddingBottom={5}>
                  {field?.pens?.length ? (
                    <Text
                      as="mark"
                      background="#2B6CB0"
                      color="white"
                      fontWeight={500}
                    >
                      Corrales
                    </Text>
                  ) : null}

                  {field?.pens?.map((pen, i) => (
                    <AccordionItem
                      borderBottom={0}
                      paddingTop={2}
                      paddingBottom={1}
                      borderTopColor="#2B6CB0"
                      key={i}
                    >
                      <Box display={"flex"} flexDirection={"column"}>
                        <AccordionButton>
                          <Box flex="1" textAlign="left">
                            <Box display={"flex"} gap={1}>
                              <Text as="b" marginRight={4}>
                                {pen.name}
                              </Text>
                              <button className="badge bg-info m-1">
                                <EditIcon boxSize={3} />
                              </button>
                              <button className="badge bg-danger m-1">
                                <DeleteIcon boxSize={3} />
                              </button>
                            </Box>
                          </Box>
                          <Box marginLeft={4}>
                            {/* <Link
                              to={`/measurement/${pen.id}`}
                              className="btn btn-primary btn-sm align-content-center"
                            >
                              Generar Medición
                            </Link> */}
                            <CorralReport
                              pen_id={pen.id}
                              // index={i}
                              addMeasurements={addMeasurements}
                              // setMeasurements={setMeasurements}
                            />
                          </Box>
                        </AccordionButton>
                        <Wrap marginX={3}>
                          {pen.pen_variable.map((e, i) => (
                            <WrapItem key={i}>
                              <Tooltip
                                label={JSON.stringify(e.custom_parameters)}
                              >
                                <Tag key={i}>{e.variable.name}</Tag>
                              </Tooltip>
                            </WrapItem>
                          ))}
                        </Wrap>
                      </Box>
                    </AccordionItem>
                  ))}
                </AccordionPanel>
              </Box>
            </AccordionItem>
          </>
        ))}
      </Accordion>
    </div>
  );
};

export default CreateField;
