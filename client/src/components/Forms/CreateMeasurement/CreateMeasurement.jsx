import {
  Box,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Radio,
  RadioGroup,
  Wrap,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Flex,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  FormHelperText,
  FormErrorMessage,
} from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const CreateMeasurement = () => {
  const params = useParams();
  const [attributes, setAttributes] = useState([]);
  const [errors, setErrors] = useState({});
  const [data, setData] = useState({
    cowName: '',
    pen_id: '',
    measurements: {},
  });
  const [values, setValues] = useState([]);
  const handleChange = (pen_variable_id, value, parameters, type) => {
    console.log(value);
    setData({
      ...data,
      measurements: {
        ...data.measurements,
        [pen_variable_id]: value,
      },
    });
    if (type === 'enum') validationEnum(pen_variable_id, value, parameters);
    if (type === 'number') validationNumber(pen_variable_id, value, parameters);
    if (type === 'bolean')
      validationBoolean(pen_variable_id, value, parameters);
    console.log(type);
  };
  console.log('LA DATA: ', data);
  /* 
 necesito enviar un objeto parecido a este:

 [
  {
    cow_name: "vaca02" -esto es opcional.
    pen_variable_id: 1,
    value: '200',
    pen_id: 1 lo saco de params.
  },
  {
    cow_name: "vaca03" -esto es opcional.
    pen_variable_id: 2,
    value: 'true',
    pen_id: 1 lo saco de params.
  },
  {
    cow_name: "vaca04" -esto es opcional.
    pen_variable_id: 3,
    value: 'Alto',
    pen_id: 1 lo saco de params.
  }
]
 
 */

  const validationNumber = (pen_variable_id, value, parameters) => {
    if (
      Number(value) % parameters.granularity !== 0 ||
      Number(value) > parameters.value.max ||
      value == ''
    ) {
      setErrors({
        ...errors,
        [pen_variable_id]: {
          message: 'El numero ingresado debe respetar la granularidad',
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
    if (value !== 'true' && value !== 'false') {
      console.log('entre al if');
      setErrors({
        ...errors,
        [pen_variable_id]: {
          message: 'El valor seleccionado solo puede ser verdadero o falso',
        },
      });
    } else {
      console.log('entre al else');
      if (errors[pen_variable_id]) {
        console.log('entre al if del else');
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
            'El valor seleccionado tiene que estar entre los valores predefinidos',
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

  //nombre de la vaca o id(opcional)
  useEffect(() => {
    let defaultValues = {};
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/penVariable/${params.id}`)
      .then((response) => {
        response.data.forEach((prop) => {
          defaultValues[prop.id] = '';
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
    console.log(errorsEmpty);
    if (Object.keys(errorsEmpty).length > 0) {
      setErrors(errorsEmpty);
    } else {
      console.log(data);
    }
  };
  function validErrors() {
    let emptyErrors = { ...errors };
    Object.keys(data.measurements).forEach((prop) => {
      if (data.measurements[prop] === '') {
        emptyErrors[prop] = {
          message: 'El campo es requerido',
        };
      }
    });
    return emptyErrors;
  }
  // console.log(values);

  return (
    <div>
      <h1>measurement</h1>
      <FormControl mb={2}>
        <FormLabel>Nombre de medicion:</FormLabel>
        <Input
          type="enum"
          id="name"
          name="name"
          autoFocus={true}
          required
          focusBorderColor="#1a1a1a"
          placeholder="Toro Dorado"
        />
      </FormControl>
      {attributes.map((prop, i) => (
        <Box key={i} mb={4}>
          {prop.variable.type == 'number' && (
            <FormControl isInvalid={!!errors[prop.id]}>
              {console.log(prop.custom_parameters.granularity)}
              <FormLabel>{prop.variable.name}:</FormLabel>
              <Flex>
                <NumberInput
                  as={'number'}
                  type="number"
                  maxW="100px"
                  mr="2rem"
                  // defaultValue={0}
                  name={prop.id}
                  value={data.measurements[prop.id]}
                  onChange={(value) =>
                    handleChange(
                      // parseFloat(value)
                      //   ? parseFloat(value)
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
                  min={prop.custom_parameters.value.min}
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
                  fontWeight={'bold'}
                  textShadow={'0.4px 0.4px black'}
                >
                  {errors[prop.id]?.message.toUpperCase()}
                </FormErrorMessage>
              </Wrap>
            </FormControl>
          )}
          {prop.variable.type == 'enum' && (
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
                fontWeight={'bold'}
                textShadow={'0.4px 0.4px black'}
              >
                {errors[prop.id]?.message.toUpperCase()}
              </FormErrorMessage>
            </FormControl>
          )}
          {prop.variable.type == 'bolean' && (
            <FormControl isInvalid={!!errors[prop.id]}>
              <FormLabel>{prop.variable.name}:</FormLabel>
              <RadioGroup
                defaultValue=""
                onChange={(value) => {
                  console.log(value),
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
                fontWeight={'bold'}
                textShadow={'0.4px 0.4px black'}
              >
                {errors[prop.id]?.message.toUpperCase()}
              </FormErrorMessage>
            </FormControl>
          )}
        </Box>
      ))}
      <button onClick={onSubmit} className="btn btn-primary btn-sm">
        Crear corral
      </button>
    </div>
  );
};

export default CreateMeasurement;
