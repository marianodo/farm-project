import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Radio,
  RadioGroup,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
  Text,
  Wrap,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

import axios from "axios";

const ModalMeasurements = ({ messageToast, name, pen_id, report_id }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [attributes, setAttributes] = useState([]);
  const [copyAttributes, setCopyAttributes] = useState([]);
  const [typeObjects, setTypeObjects] = useState([]);
  const [enumTypeSelect, setEnumTypeSelect] = useState({});
  const [numberTypeSelect, setNumberTypeSelect] = useState({});
  const [booleanTypeSelect, setBooleanTypeSelect] = useState({});
  const [errors, setErrors] = useState({});
  const [data, setData] = useState({
    type_of_object_id: "",
    nameObject: "",
    report_id: Number(report_id),
    measurements: {},
  });
  console.log("data measurements:", data.measurements);
  const enableButton = () => {
    const measurements = Object.entries(data.measurements).some(
      ([key, value]) => value !== ""
    );
    const errores = Object.keys(errors).length > 0;
    if (measurements == false || errores == true) return true;
    return false;
  };

  const handleClick = (e) => {
    e.stopPropagation();
    onOpen();
  };

  const handleTypeFilter = (event) => {
    console.log("target name:", event.target.name);
    setEnumTypeSelect({});
    setNumberTypeSelect({});
    setBooleanTypeSelect({});
    setData({
      ...data,
      type_of_object_id: Number(event.target.name),
      nameObject: "",
      measurements: {},
    });

    setCopyAttributes(
      attributes.filter(
        (elemnt) => elemnt.variable.type_of_object.name === event.target.value
      )
    );
  };
  console.log("datita:", data);
  const validationNumber = (pen_variable_id, value, parameters) => {
    if (
      Number(value) % parameters.granularity !== 0 ||
      Number(value) > parameters.value.max ||
      value == ""
    ) {
      setErrors({
        ...errors,
        [pen_variable_id]: {
          message: "El numero ingresado debe respetar la granularidad",
        },
      });
    } else if (value < parameters.value.min) {
      setErrors({
        ...errors,
        [pen_variable_id]: {
          message: `El numero no puede ser menor al minimo: ${parameters.value.min}`,
        },
      });
    } else {
      if (errors[pen_variable_id]) {
        let newErrors = { ...errors };
        delete newErrors[pen_variable_id];
        setErrors(newErrors);
      }
    }
  };
  const validationBoolean = (pen_variable_id, value, parameters) => {
    if (value !== "true" && value !== "false") {
      setErrors({
        ...errors,
        [pen_variable_id]: {
          message: "El valor seleccionado solo puede ser verdadero o falso",
        },
      });
    } else {
      if (errors[pen_variable_id]) {
        let newErrors = { ...errors };
        delete newErrors[pen_variable_id];
        setErrors(newErrors);
      }
    }
  };

  const validationEnum = (pen_variable_id, value, parameters) => {
    if (!parameters.value.includes(value)) {
      setErrors({
        ...errors,
        [pen_variable_id]: {
          message:
            "El valor seleccionado tiene que estar entre los valores predefinidos",
        },
      });
    } else {
      if (errors[pen_variable_id]) {
        let newErrors = { ...errors };
        delete newErrors[pen_variable_id];
        setErrors(newErrors);
      }
    }
  };

  const handelSubmit = () => {
    axios
      .post(`${import.meta.env.VITE_API_BASE_URL}/measurement`, data)
      .then((response) => {
        messageToast(response.data.message, "success");
        setData({
          ...data,
          nameObject: "",
          measurements: {},
        });
        setEnumTypeSelect({});
        setNumberTypeSelect({});
        setBooleanTypeSelect({});
      })
      .catch((error) => console.log(error));
  };

  const handleChange = (pen_variable_id, value, parameters, type) => {
    if (type === "enum")
      setEnumTypeSelect({ ...enumTypeSelect, [pen_variable_id]: value });
    if (type === "number")
      setNumberTypeSelect({ ...numberTypeSelect, [pen_variable_id]: value });
    if (type === "boolean")
      setBooleanTypeSelect({ ...booleanTypeSelect, [pen_variable_id]: value });
    setData({
      ...data,
      measurements: {
        ...data.measurements,
        [pen_variable_id]: value,
      },
    });
    if (type === "enum") validationEnum(pen_variable_id, value, parameters);
    if (type === "number") validationNumber(pen_variable_id, value, parameters);
    if (type === "boolean")
      validationBoolean(pen_variable_id, value, parameters);
  };
  useEffect(() => {
    let defaultValues = {};
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/penVariable/${pen_id}`)
      .then((response) => {
        response.data.forEach((prop) => {
          defaultValues[prop.id] = "";
        });
        setAttributes(response.data);
        setData({
          ...data,
          pen_id: parseInt(pen_id),
          measurements: defaultValues,
        });
      })
      .catch((error) => console.log(error));
    if (Object.keys(typeObjects).length === 0) {
      let types = [];
      axios
        .get(`${import.meta.env.VITE_API_BASE_URL}/typeofobjects`)
        .then((response) => {
          response.data.forEach((object) => {
            types.push({ name: object.name, id: object.id });
          });
          setTypeObjects(types);
        })
        .catch((error) => console.log(error));
    }
  }, [pen_id]);

  return (
    <>
      <Button
        bg="#18181b"
        color="white"
        size="sm"
        px={[2, 3]}
        fontSize={["8.4px", "10px"]}
        textTransform="uppercase"
        _hover={{ bg: "white", color: "#1a1a1a" }}
        onClick={handleClick}
      >
        Medir
      </Button>
      <Modal
        isCentered
        onClose={() => {
          setData({ ...data, measurements: {} });
          onClose();
        }}
        isOpen={isOpen}
        scrollBehavior={"inside"}
      >
        <ModalOverlay />
        <ModalContent marginX={6}>
          <ModalHeader display={"flex"} flexDirection={"column"}>
            Medir corral: {name}
            <Text as="sub" fontWeight={600} marginTop={4} marginBottom={3}>
              Seleccione que tipo va a medir:
            </Text>
            <RadioGroup marginTop={2} defaultValue={""}>
              <Stack direction="row">
                <Wrap>
                  {typeObjects?.map((types, i) =>
                    !attributes.filter(
                      (element) =>
                        element.variable.type_of_object.name === types.name
                    ).length ? null : (
                      <Radio
                        name={types.id}
                        onChange={handleTypeFilter}
                        key={i}
                        value={types.name}
                      >
                        {types.name}
                      </Radio>
                    )
                  )}
                </Wrap>
              </Stack>
            </RadioGroup>
            <FormLabel>Nombre del objeto(opcional)</FormLabel>
            <Input
              onChange={(e) => setData({ ...data, nameObject: e.target.value })}
              value={data.nameObject}
              autoFocus={true}
              focusBorderColor="#1a1a1a"
              placeholder=""
            />
            {/* {errorMessage && <p>{errorMessage}</p>} */}
          </ModalHeader>
          <ModalCloseButton
            onClick={() => {
              setData({
                ...data,
                type_of_object_id: "",
                nameObject: "",
                measurements: {},
              });
            }}
          />
          <ModalBody pb={6}>
            {copyAttributes?.map((prop, i) => (
              <Box key={i} mb={2}>
                {prop.variable.type == "number" && (
                  <FormControl isInvalid={!!errors[prop.id]}>
                    <FormLabel
                      display={"flex"}
                      flexDirection={"column"}
                      marginBottom={5}
                      gap={1}
                    >
                      {prop.variable.name}:
                      <Text as="sub" fontWeight={600}>
                        min:{prop?.custom_parameters.value?.min}, max:
                        {prop?.custom_parameters.value?.max}
                      </Text>
                    </FormLabel>
                    <Flex>
                      <NumberInput
                        as={"number"}
                        type="number"
                        maxW="100px"
                        mr="2rem"
                        name={prop.id}
                        value={
                          data.measurements[prop.id]
                            ? data.measurements[prop.id]
                            : ""
                        }
                        onChange={(value) =>
                          handleChange(
                            prop.id,
                            value,
                            prop.custom_parameters,
                            prop.variable.type
                          )
                        }
                        step={parseFloat(prop.custom_parameters.granularity)}
                        min={prop.custom_parameters.value.min}
                        max={prop.custom_parameters.value.max}
                      >
                        <NumberInputField />
                        <NumberInputStepper
                          keepWithinRange={true}
                          step={parseFloat(prop.custom_parameters.granularity)}
                        >
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <Slider
                        flex="1"
                        defaultValue={prop.custom_parameters.value.min}
                        focusThumbOnChange={false}
                        value={
                          numberTypeSelect[prop.id]
                            ? numberTypeSelect[prop.id]
                            : ""
                        }
                        onChange={(value) =>
                          handleChange(
                            prop.id,
                            value,
                            prop.custom_parameters,
                            prop.variable.type
                          )
                        }
                        step={parseFloat(prop.custom_parameters.granularity)}
                        min={parseFloat(prop.custom_parameters.value.min)}
                        max={parseFloat(prop.custom_parameters.value.max)}
                      >
                        <SliderTrack>
                          <SliderFilledTrack />
                        </SliderTrack>
                        <SliderThumb fontSize="sm" boxSize="32px" />
                      </Slider>
                    </Flex>
                    <Wrap>
                      <FormHelperText mr={10}>
                        Granularidad: {prop.custom_parameters.granularity}
                      </FormHelperText>
                      <FormErrorMessage
                        fontWeight={"bold"}
                        textShadow={"0.4px 0.4px black"}
                      >
                        {errors[prop.id]?.message.toUpperCase()}
                      </FormErrorMessage>
                    </Wrap>
                  </FormControl>
                )}
                {prop.variable.type == "enum" && (
                  <FormControl isInvalid={!!errors[prop.id]}>
                    <FormLabel>{prop.variable.name}:</FormLabel>
                    <RadioGroup
                      value={
                        enumTypeSelect[prop.id] ? enumTypeSelect[prop.id] : ""
                      }
                      // defaultValue=""
                      onChange={(value) =>
                        handleChange(
                          prop.id,
                          value,
                          prop.custom_parameters,
                          prop.variable.type
                        )
                      }
                    >
                      <HStack spacing="1rem">
                        <Wrap>
                          {prop.custom_parameters.value.map((v, i) => (
                            <Radio key={i} value={v}>
                              {v}
                            </Radio>
                          ))}
                        </Wrap>
                      </HStack>
                    </RadioGroup>
                    <FormErrorMessage
                      fontWeight={"bold"}
                      textShadow={"0.4px 0.4px black"}
                    >
                      {errors[prop.id]?.message.toUpperCase()}
                    </FormErrorMessage>
                  </FormControl>
                )}
                {prop.variable.type == "boolean" && (
                  <FormControl isInvalid={!!errors[prop.id]}>
                    <FormLabel>{prop.variable.name}:</FormLabel>
                    <RadioGroup
                      // defaultValue=
                      value={
                        booleanTypeSelect[prop.id]
                          ? booleanTypeSelect[prop.id]
                          : ""
                      }
                      onChange={(value) => {
                        handleChange(
                          prop.id,
                          value,
                          prop.custom_parameters,
                          prop.variable.type
                        );
                      }}
                    >
                      <HStack spacing="1rem">
                        <Wrap>
                          <Radio value="true">Verdadero</Radio>
                          <Radio value="false">Falso</Radio>
                        </Wrap>
                      </HStack>
                    </RadioGroup>
                    <FormErrorMessage
                      fontWeight={"bold"}
                      textShadow={"0.4px 0.4px black"}
                    >
                      {errors[prop.id]?.message.toUpperCase()}
                    </FormErrorMessage>
                  </FormControl>
                )}
              </Box>
            ))}
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={() => {
                handelSubmit();
              }}
              colorScheme="blue"
              mr={3}
              isDisabled={enableButton()}
            >
              Crear
            </Button>
            <Button
              onClick={() => {
                onClose();
                setData({
                  ...data,
                  type_of_object_id: "",
                  nameObject: "",
                  measurements: {},
                });
              }}
            >
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalMeasurements;
