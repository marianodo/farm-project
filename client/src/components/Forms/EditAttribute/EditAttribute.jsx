import { useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Text,
  Button,
  RadioGroup,
  HStack,
  Wrap,
  Radio,
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
export default function EditAttribute({
  messageToast,
  attribute,
  changeAttribute,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editAttribute, setEditAtributte] = useState(attribute);
  const [enumInput, setEnumInput] = useState([]);

  const onChange = (e, type, selectValue) => {
    // if (!e.target.name == 'granularity') {
    if (type === "number") {
      setEditAtributte({
        ...editAttribute,
        default_parameters:
          e.target.name !== "granularity"
            ? {
                ...editAttribute.default_parameters,
                value: {
                  ...editAttribute.default_parameters.value,
                  [e.target.name]: e.target.value && Number(e.target.value),
                },
              }
            : {
                ...editAttribute.default_parameters,
                [e.target.name]: e.target.value,
              },
      });
    }

    if (type === "enum") {
      setEditAtributte({
        ...editAttribute,
        default_parameters: {
          value: editAttribute.default_parameters.value.filter(
            (item) => item != selectValue
          ),
        },
      });
    }

    if (type === "bolean"){
      setEditAtributte({
        ...editAttribute,
        default_parameters: {
          value: selectValue
        },
      });
    }
    // }

    // setEditAtributte({
    //   ...editAttribute,
    //   default_parameters: {
    // ...editAttribute.default_parameters,
    // [e.target.name]: e.target.value && parseInt(e.target.value),
    //   },
    // });
  };

  const addEnumItem = (enumInput) => {
    setEditAtributte({
      ...editAttribute,
      default_parameters: {
        value: [...editAttribute.default_parameters.value, enumInput],
      },
    });
    setEnumInput("");
  };
  const onSave = () => {
    changeAttribute(editAttribute);
    messageToast("Cambios guardados exitosamente", "success");
    return onClose();
  };

  return (
    <>
      <button
        className="badge bg-info m-1"
        onClick={() => {
          setEditAtributte(attribute);
          onOpen();
        }}
      >
        <EditIcon boxSize={4} />
      </button>
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Modificar valores de la variable:{" "}
            <Text as="b">{editAttribute?.name}</Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {editAttribute.type === "number" && (
              <>
                <FormControl>
                  <FormLabel>Valor minimo</FormLabel>
                  <Input
                    type="number"
                    onChange={(e) => onChange(e, attribute.type)}
                    value={editAttribute?.default_parameters?.value?.min}
                    name="min"
                    focusBorderColor="#1a1a1a"
                    placeholder="1"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Valor maximo</FormLabel>
                  <Input
                    type="number"
                    onChange={(e) => onChange(e, attribute.type)}
                    value={editAttribute?.default_parameters?.value?.max}
                    name="max"
                    focusBorderColor="#1a1a1a"
                    placeholder="1000"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Optimo minimo</FormLabel>
                  <Input
                    type="number"
                    onChange={(e) => onChange(e, attribute.type)}
                    value={editAttribute?.default_parameters?.value?.optimo_min}
                    name="optimo_min"
                    focusBorderColor="#1a1a1a"
                    placeholder="100"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Optimo maximo</FormLabel>
                  <Input
                    type="number"
                    onChange={(e) => onChange(e, attribute.type)}
                    value={editAttribute?.default_parameters?.value?.optimo_max}
                    name="optimo_max"
                    focusBorderColor="#1a1a1a"
                    placeholder="200"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Granularity</FormLabel>
                  <Input
                    // type="text"
                    onChange={(e) => onChange(e, attribute.type)}
                    value={editAttribute?.default_parameters?.granularity}
                    name="granularity"
                    focusBorderColor="#1a1a1a"
                    placeholder="200"
                  />
                </FormControl>
              </>
            )}
            {editAttribute.type === "bolean" && (
              <>
                <RadioGroup
                  defaultValue="true"
                  value={editAttribute.default_parameters.value}
                  onChange={(e)=> onChange(e,editAttribute.type,e)}
                >
                  <HStack spacing="1rem">
                    <Wrap>
                      <Radio value="true">Verdadero</Radio>
                      <Radio value="false">Falso</Radio>
                    </Wrap>
                  </HStack>
                </RadioGroup>
              </>
            )}
            {editAttribute.type === "enum" && (
              <div>
                {console.log("ATRIBUTO:", attribute)}
                <Wrap>
                  {editAttribute.default_parameters.value.map((value, i) => (
                    <div key={i}>
                      <Tooltip
                        label="Click para eliminar"
                        hasArrow
                        bg="#1a1a1a"
                        placement="top"
                      >
                        <Button
                          key={i}
                          className="m-1"
                          onClick={(e) =>
                            onChange(e, editAttribute.type, value)
                          }
                        >
                          {value}
                        </Button>
                      </Tooltip>
                    </div>
                  ))}
                </Wrap>

                <FormControl
                  alignItems={"center"}
                  justifyContent={"start"}
                  display={"flex"}
                  flexWrap={"wrap"}
                >
                  <Input
                    onChange={(e) => setEnumInput(e.target.value)}
                    // onKeyDown={handleEnumItemInput}
                    width={"70%"}
                    m={2}
                    value={enumInput}
                    focusBorderColor="#1a1a1a"
                    placeholder="Bajo"
                  />
                  <Button
                    id="addEnumItem"
                    ml={2}
                    onClick={() => addEnumItem(enumInput)}
                  >
                    agregar
                  </Button>
                </FormControl>
              </div>
            )}
            {/* <Lorem count={2} /> */}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={() => onSave()}>
              Guardar
            </Button>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            {/* <Button variant="ghost">Secondary Action</Button> */}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
