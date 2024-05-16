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
  Icon,
  Tag,
  Text,
  Tooltip,
  Wrap,
  WrapItem,
  useDisclosure,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";

import { FcDocument } from "react-icons/fc";
import { Link } from "react-router-dom";
import ModalField from "./ModalField";
import ModalReport from "./ModalReport";
import axios from "axios";

const CreateField = ({ messageToast }) => {
  const [fields, setFields] = useState([]);
  const [edit, setEdit] = useState(false);
  const { onOpen } = useDisclosure();
  const [fieldName, setFieldName] = useState("");
  const [fieldId, setFieldId] = useState("");
  const addField = (field) => {
    setFields([...fields, field]);
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

  {
    console.log(fields);
  }

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
        alignItems={"center"}
      >
        <h1>Jhon Doe</h1>
        <Box>
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
                <AccordionButton p={0} display={"grid"}>
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
                      "90% 10%",
                      "70% 30%",
                      "1fr auto",
                      "auto 240px 40px",
                    ]}
                    alignItems={"center"}
                    justifyItems={"center"}
                    pb={0}
                  >
                    <GridItem justifySelf={["left"]} pr="0" area={"text-icon"}>
                      <Box display={"flex"} gap={[2]}>
                        <Text as="b" marginRight={0}>
                          {field.name}
                        </Text>
                        <ButtonGroup pl={[0, 2]} alignItems={"center"}>
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
                          <Button
                            as={Link}
                            to={`/reports/${field.id}`}
                            margin={0}
                            padding={0}
                            size={"xs"}
                          >
                            <Icon
                              cursor={"pointer"}
                              as={FcDocument}
                              w={5}
                              h={5}
                            />
                          </Button>
                        </ButtonGroup>
                      </Box>
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
                              <Tag size={"sm"} fontSize={"11px"}>
                                {e.name}
                              </Tag>
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
                          pens={field.pens}
                          field_id={field.id}
                        />
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
                        >
                          Crear Corral
                        </Button>
                      </ButtonGroup>
                    </GridItem>
                  </Grid>
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
                        </AccordionButton>
                        <Wrap marginX={3}>
                          {pen.pen_variable.map((e, i) => (
                            <WrapItem key={i}>
                              <Tooltip
                                label={JSON.stringify(e.custom_parameters)}
                              >
                                <Tag size={"sm"} fontSize={"11px"}>
                                  {e.variable.name} -{" "}
                                  {e.variable.type_of_object.name}
                                </Tag>
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
