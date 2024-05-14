import {
  Button,
  FormControl,
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
  Radio,
  RadioGroup,
  Text,
  Tooltip,
  Wrap,
  useDisclosure,
} from "@chakra-ui/react";

import { EditIcon } from "@chakra-ui/icons";
import { useState } from "react";

export default function EditAttribute({
  messageToast,
  attribute,
  changeAttribute,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editAttribute, setEditAtributte] = useState(attribute);
  const [enumInput, setEnumInput] = useState([]);

  const onChange = (e, type, selectValue) => {
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

    if (type === "boolean") {
      setEditAtributte({
        ...editAttribute,
        default_parameters: {
          value: selectValue,
        },
      });
    }
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
      <EditIcon
        cursor={"pointer"}
        backgroundColor={"#1F9BCF"}
        fontSize={30}
        paddingX={"0.2rem"}
        paddingY={"0.12rem"}
        margin={1}
        maxWidth={"26px"}
        height={"18px"}
        onClick={() => {
          setEditAtributte(attribute);
          onOpen();
        }}
      />
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
                    onChange={(e) => onChange(e, attribute.type)}
                    value={editAttribute?.default_parameters?.granularity}
                    name="granularity"
                    focusBorderColor="#1a1a1a"
                    placeholder="200"
                  />
                </FormControl>
              </>
            )}
            {editAttribute.type === "boolean" && (
              <>
                <RadioGroup
                  defaultValue="true"
                  value={editAttribute.default_parameters.value}
                  onChange={(e) => onChange(e, editAttribute.type, e)}
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
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={() => onSave()}>
              Guardar
            </Button>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
