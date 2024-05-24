import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
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
  Text,
  Wrap,
  useDisclosure,
} from "@chakra-ui/react";

import { EditIcon } from "@chakra-ui/icons";
import axios from "axios";
import messageToast from "../../../utils/messageToast";
import { useState } from "react";

const EditModalMeasurement = ({ setRefresh, pen_variable, valueM, id }) => {
  console.log(pen_variable);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [errors, setErrors] = useState({});
  const [value, setValue] = useState(null);
  const [data, setData] = useState({
    cowName: "",
    pen_id: "",

    measurements: {},
  });

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
      setValue(value);
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
      setValue(value);
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
      setValue(value);
    }
  };

  console.log(data);
  console.log(value);

  const handelSubmit = () => {
    axios
      .put(`${import.meta.env.VITE_API_BASE_URL}/measurement/${id}`, {
        value: value,
      })
      .then((response) => {
        messageToast(response.data.message, "success");
        setData({ ...data, measurements: {} });
        setRefresh(true);
      })
      .catch((error) => console.log(error));
  };

  const handleChange = (pen_variable_id, value, parameters, type) => {
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

  return (
    <>
      <button className="badge bg-info m-1" onClick={handleClick}>
        <EditIcon boxSize={3} />
      </button>
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
          <ModalHeader>Editar medicion: {id} </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Box mb={4}>
              {pen_variable.variable.type == "number" && (
                <FormControl isInvalid={!!errors[pen_variable.variable.id]}>
                  <FormLabel margin={0} padding={0}>
                    {pen_variable.variable.name}:
                  </FormLabel>
                  <Box
                    display={"flex"}
                    flexDirection={"column"}
                    marginBottom={3}
                    height={"40px"}
                    alignContent={"center"}
                    justifyContent={"space-around"}
                    alignItems={"flex-start"}
                  >
                    <Text as="sub">
                      min:{pen_variable?.custom_parameters.value?.min}, max:
                      {pen_variable?.custom_parameters.value?.max}
                    </Text>
                    <Text as="sub">
                      optimo_min:
                      {pen_variable?.custom_parameters.value?.optimo_min},
                      optimo_max:
                      {pen_variable.custom_parameters.value?.optimo_max}
                    </Text>
                  </Box>
                  <Flex>
                    <NumberInput
                      as={"number"}
                      type="number"
                      maxW="100px"
                      mr="2rem"
                      defaultValue={valueM}
                      name={pen_variable.id}
                      value={data.measurements[pen_variable.id]}
                      onChange={(value) =>
                        handleChange(
                          pen_variable.id,
                          value,
                          pen_variable.custom_parameters,
                          pen_variable.variable.type
                        )
                      }
                      step={parseFloat(
                        pen_variable.custom_parameters.granularity
                      )}
                      min={pen_variable.custom_parameters.value.min}
                      max={pen_variable.custom_parameters.value.max}
                    >
                      <NumberInputField />
                      <NumberInputStepper
                        keepWithinRange={true}
                        step={parseFloat(
                          pen_variable.custom_parameters.granularity
                        )}
                      >
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    <Slider
                      flex="1"
                      defaultValue={valueM}
                      focusThumbOnChange={false}
                      onChange={(value) =>
                        handleChange(
                          pen_variable.id,
                          value,
                          pen_variable.custom_parameters,
                          pen_variable.variable.type
                        )
                      }
                      step={parseFloat(
                        pen_variable.custom_parameters.granularity
                      )}
                      min={pen_variable.custom_parameters.value.min}
                      max={pen_variable.custom_parameters.value.max}
                    >
                      <SliderTrack>
                        <SliderFilledTrack />
                      </SliderTrack>
                      <SliderThumb fontSize="sm" boxSize="32px" />
                    </Slider>
                  </Flex>
                  <Wrap>
                    <FormHelperText mr={10}>
                      Granularidad: {pen_variable.custom_parameters.granularity}
                    </FormHelperText>
                    <FormErrorMessage
                      fontWeight={"bold"}
                      textShadow={"0.4px 0.4px black"}
                    >
                      {errors[pen_variable.variable.id]?.message.toUpperCase()}
                    </FormErrorMessage>
                  </Wrap>
                </FormControl>
              )}
              {pen_variable.variable.type == "enum" && (
                <FormControl isInvalid={!!errors[pen_variable.variable.id]}>
                  <FormLabel
                    display={"flex"}
                    flexDirection={"column"}
                    gap={2}
                    paddingBottom={8}
                  >
                    {pen_variable.variable.name}:
                    <Text as="sub">valor actual: {valueM}</Text>
                  </FormLabel>
                  <RadioGroup
                    defaultValue={valueM}
                    onChange={(value) =>
                      handleChange(
                        pen_variable.id,
                        value,
                        pen_variable.custom_parameters,
                        pen_variable.variable.type
                      )
                    }
                  >
                    <HStack spacing="1rem">
                      <Wrap>
                        {pen_variable.custom_parameters.value.map((v, i) => (
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
                    {/* {errors[prop.id]?.message.toUpperCase()} */}
                  </FormErrorMessage>
                </FormControl>
              )}
              {pen_variable.variable.type == "boolean" && (
                <FormControl isInvalid={!!errors[pen_variable.variable.id]}>
                  <FormLabel>{pen_variable.variable.name}:</FormLabel>
                  <RadioGroup
                    defaultValue={valueM}
                    onChange={(value) => {
                      handleChange(
                        pen_variable.id,
                        value,
                        pen_variable.custom_parameters,
                        pen_variable.variable.type
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
                    {/* {errors[prop.id]?.message.toUpperCase()} */}
                  </FormErrorMessage>
                </FormControl>
              )}
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={() => {
                handelSubmit();
                onClose();
              }}
              colorScheme="blue"
              mr={3}
              isDisabled={enableButton()}
            >
              Guardar
            </Button>
            <Button
              onClick={() => {
                setData({ ...data, measurements: {} });
                onClose();
              }}
            >
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditModalMeasurement;
