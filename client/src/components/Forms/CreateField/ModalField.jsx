import "react-toastify/dist/ReactToastify.css";

import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";

import axios from "axios";
import { useState } from "react";

const ModalField = ({
  setFields,
  fieldId,
  fieldName,
  setFieldName,
  editOpen,
  edit,
  setEdit,
  addField,
  messageToast,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [inputField, setInputField] = useState("");
  const [isFormInvalid, setIsFormInvalid] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const handleClose = () => {
    setInputField("");
    setIsFormInvalid(true);
    setErrorMessage("");
    onClose();
  };
  const handleChange = (e) => {
    setInputField(e.target.value);
    if (e.target.value[0] == " ") {
      setErrorMessage("El nombre no puede empezar con un espacio");
      setIsFormInvalid(true);
    } else if (e.target.value.trim().length <= 2) {
      setErrorMessage(
        "El campo no puede estar vacio y tiene que tener una longitud mayor a 2 caracteres"
      );
      setIsFormInvalid(true);
    } else {
      setErrorMessage("");
      setIsFormInvalid(false);
    }
  };

  const postField = () => {
    if (inputField) {
      axios
        .post(`${import.meta.env.VITE_API_BASE_URL}/field`, {
          fieldName: inputField.trim(),
        })
        .then((response) => {
          addField(response.data?.field);
          onClose();
          setInputField("");
          setIsFormInvalid(true);
          messageToast(response.data.message, "success");
        })
        .catch((error) => {
          messageToast(error.response?.data.error);
        });
    }
  };

  return (
    <>
      <Button
        bg="#1a1a1a"
        color="white"
        size="sm"
        py={5}
        fontSize="10px"
        textTransform="uppercase"
        _hover={{ bg: "white", color: "#1a1a1a" }}
        onClick={onOpen}
      >
        Crear Campo
      </Button>
      {edit !== true ? (
        <>
          <Modal isCentered isOpen={isOpen} onClose={handleClose}>
            <ModalOverlay />
            <ModalContent marginX={6}>
              <ModalHeader>Crear campo</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <FormControl>
                  <FormLabel>Nombre del campo</FormLabel>
                  <Input
                    onChange={(e) => handleChange(e)}
                    onKeyDown={(e) => (e.key === "Enter" ? postField() : null)}
                    value={inputField}
                    autoFocus={true}
                    focusBorderColor="#1a1a1a"
                    placeholder="Campo Maravilla"
                  />
                  {errorMessage && <p>{errorMessage}</p>}
                </FormControl>
              </ModalBody>

              <ModalFooter>
                <Button
                  bg="#1a1a1a"
                  color="white"
                  mr={3}
                  _hover={{ bg: "#1a1a1a", color: "white" }}
                  onClick={postField}
                  isDisabled={isFormInvalid}
                >
                  Crear
                </Button>
                <Button onClick={handleClose}>Cancelar</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      ) : (
        <>
          <Modal
            isOpen={editOpen}
            onClose={() => {
              setEdit(false);
            }}
            isCentered
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Editar nombre</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <FormControl>
                  <Input
                    placeholder="First name"
                    value={fieldName}
                    onChange={(e) => {
                      setFieldName(e.target.value);
                    }}
                  />
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button
                  bg="#1a1a1a"
                  color="white"
                  mr={3}
                  _hover={{ bg: "#1a1a1a", color: "white" }}
                  onClick={async () => {
                    try {
                      const response = await axios.put(
                        `${import.meta.env.VITE_API_BASE_URL}/field/${fieldId}`,
                        { fieldName: fieldName }
                      );
                      const fields = (
                        await axios.get(
                          `${import.meta.env.VITE_API_BASE_URL}/field`
                        )
                      ).data;
                      setFields(fields ? fields : []);
                      messageToast(response.data.message, "success");
                      setEdit(false);
                    } catch (error) {
                      messageToast(error.response.data.error);
                    }
                  }}
                >
                  Guardar
                </Button>
                <Button onClick={() => setEdit(false)}>Cancelar</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )}
    </>
  );
};

export default ModalField;
