import {
  Box,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Radio,
  RadioGroup,
  Wrap,
} from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const CreateMeasurement = () => {
  const params = useParams();
  const [attributes, setAttributes] = useState([]);
  const [data, setData] = useState({});
  //nombre de la vaca o id(opcional)
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/penVariable/${params.id}`)
      .then((response) => {
        console.log(response.data);
        setAttributes([
          ...response.data,
          ...response.data,
          ...response.data,
          ...response.data,
          ...response.data,
          ...response.data,
        ]);
      })
      .catch((error) => console.log(error));
  }, [params.id]);
  const onSubmit = () => {
    console.log(data);
  };

  return (
    <div>
      <h1>measurement</h1>
      <FormControl mb={2}>
        <FormLabel>Nombre de medicion:</FormLabel>
        <Input
          type="text"
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
            <FormControl>
              <FormLabel>{prop.variable.name}:</FormLabel>
              <Input
                type="text"
                id="name"
                name="name"
                autoFocus={true}
                required
                focusBorderColor="#1a1a1a"
                placeholder="Toro Dorado"
              />
            </FormControl>
          )}
          {prop.variable.type == 'enum' && (
            <FormControl>
              <FormLabel>{prop.variable.name}:</FormLabel>
              <RadioGroup defaultValue="true">
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
            </FormControl>
          )}
          {prop.variable.type == 'bolean' && (
            <FormControl>
              <FormLabel>{prop.variable.name}:</FormLabel>
              <RadioGroup defaultValue="true">
                <HStack spacing="1rem">
                  <Wrap>
                    <Radio value="true">Verdadero</Radio>
                    <Radio value="false">Falso</Radio>
                  </Wrap>
                </HStack>
              </RadioGroup>
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
