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
import React, { useState } from "react";

import { ToastContainer } from "react-toastify";
import axios from "axios";

const ModalField = ({ addField, messageToast }) => {
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
  console.log(inputField[0] == " ");
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
          messageToast(error.response.data.error);
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

      <Modal
        style={{ bg: "red" }}
        isCentered
        isOpen={isOpen}
        onClose={handleClose}
      >
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
  );
};

export default ModalField;
