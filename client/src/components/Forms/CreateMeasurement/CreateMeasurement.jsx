import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
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
  Wrap,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

import axios from "axios";
import { useParams } from "react-router-dom";

const CreateMeasurement = () => {
  const params = useParams();
  const [attributes, setAttributes] = useState([]);
  const [errors, setErrors] = useState({});
  const [data, setData] = useState({
    cow_name: "",
    pen_id: "",
    measurements: {},
  });
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

  const handleChangeCow = (e) => {
    if (e.target.value.trim() === "") {
      setErrors({
        ...errors,
        cow_name: { message: "El nombre de la vaca no puede estar vacio" },
      });
    } else {
      if (errors["cow_name"]) {
        let newErrors = { ...errors };
        delete newErrors["cow_name"];
        setErrors(newErrors);
      }
    }
    setData({
      ...data,
      cow_name: e.target.value,
    });
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

  useEffect(() => {
    let defaultValues = {};
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/penVariable/${params.id}`)
      .then((response) => {
        response.data.forEach((prop) => {
          defaultValues[prop.id] = "";
        });
        setAttributes(response.data);
        setData({
          ...data,
          pen_id: parseInt(params.id),
          measurements: defaultValues,
        });
      })
      .catch((error) => console.log(error));
  }, [params.id]);
  const onSubmit = () => {
    let errorsEmpty = validErrors();
    if (Object.keys(errorsEmpty).length > 0) {
      setErrors(errorsEmpty);
    } else {
      axios.post(`${import.meta.env.VITE_API_BASE_URL}/measurement`, data);
    }
  };
  function validErrors() {
    let emptyErrors = { ...errors };
    Object.keys(data.measurements).forEach((prop) => {
      if (data.measurements[prop] === "") {
        emptyErrors[prop] = {
          message: "El campo es requerido",
        };
      }
    });
    return emptyErrors;
  }

  return (
    <div>
      <h1>measurement</h1>
      <FormControl mb={2} isInvalid={!!errors["cow_name"]}>
        <FormLabel>Nombre de la vaca o ID:</FormLabel>
        <Input
          onChange={(e) => handleChangeCow(e)}
          type="text"
          id="name"
          name="cow_name"
          autoFocus={true}
          required
          focusBorderColor="#1a1a1a"
          placeholder="Toro Dorado"
        />
        <FormErrorMessage fontWeight={"bold"} textShadow={"0.4px 0.4px black"}>
          {errors["cow_name"]?.message.toUpperCase()}
        </FormErrorMessage>
      </FormControl>
      {attributes.map((prop, i) => (
        <Box key={i} mb={4}>
          {prop.variable.type == "number" && (
            <FormControl isInvalid={!!errors[prop.id]}>
              <FormLabel>{prop.variable.name}:</FormLabel>
              <Flex>
                <NumberInput
                  type="number"
                  maxW="100px"
                  mr="2rem"
                  name={prop.id}
                  value={data.measurements[prop.id]}
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
                  value={data.measurements[prop.id]}
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
                  max={prop.custom_parameters.value.max}
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
                defaultValue=""
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
                    <Radio name="cualquiera" value="cualquiera">
                      Cualquiera
                    </Radio>
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
                defaultValue=""
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
      <button
        onClick={onSubmit}
        disabled={
          Object.keys(errors).length === 0 &&
          Object.values(validErrors()).length === 0
            ? false
            : true
        }
        className="btn btn-primary btn-sm"
      >
        Crear corral
      </button>
    </div>
  );
};

export default CreateMeasurement;
