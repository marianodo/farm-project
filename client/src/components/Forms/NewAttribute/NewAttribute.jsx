import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
  RadioGroup,
  HStack,
  Radio,
  FormHelperText,
  Wrap,
  Tooltip,
} from '@chakra-ui/react';
import axios from 'axios';

const NewAtributte = ({ addAttribute }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [attribute, setAttribute] = useState({
    name: '',
    type: 'number',
    parameters: {
      granularity: 0.25,
      value: {
        min: 1,
        max: 1000,
        optimo_min: 100,
        optimo_max: 200,
      },
    },
  });
  const [enumItems, setEnumItems] = useState([]);
  const [enumInput, setEnumInput] = useState('');
  const [boleanInput, setBoleanInput] = useState('true');
  const [granularityInput, setGranularityInput] = useState(0.25);
  const [numberInput, setnumberInput] = useState({
    min: 1,
    max: 1000,
    optimo_min: 100,
    optimo_max: 200,
  });

  const postAttribute = () => {
    let body = attribute;
    //el id no deberia existir y se tiene que hacer el axios al back con la respuesta ejecutar el addAttribute
    if (attribute.type === 'number') {
      body = {
        ...attribute,
        parameters: { ...attribute.parameters, granularity: granularityInput },
      };
    }
    axios
      .post(`${import.meta.env.VITE_API_BASE_URL}/variable`, body)
      .then((response) => {
        addAttribute(response.data);
        onClose();
      })
      .catch((error) => console.log(error));
  };
  const handleName = (e) => {
    setAttribute({
      ...attribute,
      name: e.target.value,
    });
  };
  const handleRadio = (value) => {
    setAttribute({
      ...attribute,
      type: value,
      parameters: {
        value: getDefaultByType(value),
      },
    });
  };
  const getDefaultByType = (value) => {
    if (value === 'number') {
      return numberInput;
    }
    if (value === 'enum') {
      return enumItems;
    }
    if (value === 'bolean') {
      return boleanInput;
    }
  };
  const handleBoleanInput = (value) => {
    setBoleanInput(value);
    setAttribute({
      ...attribute,
      parameters: {
        value: value,
      },
    });
  };

  const resetAttribute = () => {
    setAttribute({
      name: '',
      type: 'number',
      parameters: {
        value: {
          min: 1,
          max: 1000,
          optimo_min: 100,
          optimo_max: 200,
        },
      },
    });
  };

  const removeEnumItem = (value) => {
    setEnumItems(enumItems.filter((item) => item != value));
  };

  const addEnumItem = () => {
    if (enumInput != '' && !enumItems.find((value) => value === enumInput)) {
      setEnumItems([...enumItems, enumInput]);
      setAttribute({
        ...attribute,
        parameters: {
          value: [...enumItems, enumInput],
        },
      });
    }
    setEnumInput('');
  };

  const handleEnumItemInput = (e) => {
    if (e.key === 'Enter') {
      addEnumItem();
    }
  };

  const handleNumberInput = (e) => {
    setnumberInput({
      ...numberInput,
      [e.target.name]: e.target.value,
    });
    setAttribute({
      ...attribute,
      parameters: {
        value: {
          ...numberInput,
          [e.target.name]: e.target.value,
        },
      },
    });
  };

  return (
    <>
      <ToastContainer />
      <button
        onClick={() => {
          onOpen();
          resetAttribute();
        }}
        className="btn btn-primary btn-sm align-content-center"
      >
        Crear atributo
      </button>

      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent marginX={6}>
          <ModalHeader>Nuevo atributo</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Nombre del atributo</FormLabel>
              <Input
                onChange={handleName}
                value={attribute.name}
                autoFocus={true}
                focusBorderColor="#1a1a1a"
                placeholder="Peso"
              />
            </FormControl>
            <FormControl mt={4} as="fieldset">
              <FormLabel as="legend">Tipo</FormLabel>
              <RadioGroup defaultValue="number" onChange={handleRadio}>
                <HStack spacing="1rem">
                  <Wrap>
                    <Radio value="number">Numerico</Radio>
                    <Radio value="bolean">Boleano</Radio>
                    <Radio value="enum">Lista</Radio>
                  </Wrap>
                </HStack>
              </RadioGroup>
              <FormHelperText mb={4}>Valor por defecto</FormHelperText>

              {attribute.type === 'number' && (
                <div>
                  <FormControl>
                    <FormLabel>Valor minimo</FormLabel>
                    <Input
                      onChange={handleNumberInput}
                      value={numberInput.min}
                      name="min"
                      focusBorderColor="#1a1a1a"
                      placeholder="1"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Valor maximo</FormLabel>
                    <Input
                      onChange={handleNumberInput}
                      value={numberInput.max}
                      name="max"
                      focusBorderColor="#1a1a1a"
                      placeholder="1000"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Optimo minimo</FormLabel>
                    <Input
                      onChange={handleNumberInput}
                      value={numberInput.optimo_min}
                      name="optimo_min"
                      focusBorderColor="#1a1a1a"
                      placeholder="100"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Optimo maximo</FormLabel>
                    <Input
                      onChange={handleNumberInput}
                      value={numberInput.optimo_max}
                      name="optimo_max"
                      focusBorderColor="#1a1a1a"
                      placeholder="200"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Granularity</FormLabel>
                    <Input
                      onChange={(e) => setGranularityInput(e.target.value)}
                      value={granularityInput}
                      name="granularity"
                      focusBorderColor="#1a1a1a"
                      placeholder="200"
                    />
                  </FormControl>
                </div>
              )}
              {attribute.type === 'bolean' && (
                <div>
                  <RadioGroup
                    defaultValue="true"
                    value={boleanInput}
                    onChange={handleBoleanInput}
                  >
                    <HStack spacing="1rem">
                      <Wrap>
                        <Radio value="true">Verdadero</Radio>
                        <Radio value="false">Falso</Radio>
                      </Wrap>
                    </HStack>
                  </RadioGroup>
                </div>
              )}
              {attribute.type === 'enum' && (
                <div>
                  <Wrap>
                    {enumItems.map((value, i) => (
                      <>
                        <Tooltip
                          label="Click para eliminar"
                          hasArrow
                          bg="#1a1a1a"
                          placement="top"
                        >
                          <Button
                            key={i}
                            className="m-1"
                            onClick={() => removeEnumItem(value)}
                          >
                            {value}
                          </Button>
                        </Tooltip>
                      </>
                    ))}
                  </Wrap>

                  <FormControl
                    alignItems={'center'}
                    justifyContent={'start'}
                    display={'flex'}
                    flexWrap={'wrap'}
                  >
                    <Input
                      onChange={(e) => setEnumInput(e.target.value)}
                      onKeyDown={handleEnumItemInput}
                      width={'70%'}
                      m={2}
                      value={enumInput}
                      focusBorderColor="#1a1a1a"
                      placeholder="Bajo"
                    />
                    <Button id="addEnumItem" ml={2} onClick={addEnumItem}>
                      agregar
                    </Button>
                  </FormControl>
                </div>
              )}
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              bg="#1a1a1a"
              color="white"
              mr={3}
              _hover={{ bg: '#1a1a1a', color: 'white' }}
              onClick={postAttribute}
            >
              Crear
            </Button>
            <Button
              onClick={() => {
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

export default NewAtributte;
