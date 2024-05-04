import {
  Button,
  ButtonGroup,
  FormControl,
  FormErrorMessage,
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
import { useEffect, useState } from "react";

import axios from "axios";

const ModalReport = ({ messageToast, field_id }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [report, setReport] = useState({
    name: "",
    comment: "",
    field_id: field_id,
  });
  const [error, setError] = useState("");

  const onSubmit = () => {
    // let data = {
    //   ...report,
    //   measurements,
    // };
    axios
      .post(`${import.meta.env.VITE_API_BASE_URL}/report`, report)
      .then((response) => {
        onClose();
        console.log("Respuesta: ", response);
        messageToast(response.data.message, "success");
        setTimeout(() => {
          window.location.href = `/newReport/${response.data.report.field_id}`;
        }, 1200);
      })
      .catch((error) => {
        messageToast(error.response.data.error, "error");
      });
  };

  return (
    <>
      <Button
        bg="#1a1a1a"
        color="white"
        size="sm"
        px={[2, 3]}
        fontSize={["8.4px", "10px"]}
        textTransform="uppercase"
        _hover={{ bg: "white", color: "#1a1a1a" }}
        onClick={onOpen}
      >
        Crear Reporte
      </Button>
      <Modal
        isCentered
        onClose={onClose}
        isOpen={isOpen}
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Reporte</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isInvalid={error != ""}>
              <FormErrorMessage
                fontWeight={100}
                textShadow={"0.4px 0.4px black"}
              >
                {error}
              </FormErrorMessage>
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Nombre:</FormLabel>
              <Input
                placeholder={`Ingrese un nombre - (Opcional)`}
                //   value={value[]} // Asignamos el valor del input
                onChange={(e) => setReport({ ...report, name: e.target.value })} // Asignamos el evento onChange
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Comentario:</FormLabel>
              <Input
                placeholder={`Ingrese un comentario - (Opcional)`}
                //   value={value[]} // Asignamos el valor del input
                onChange={(e) =>
                  setReport({ ...report, comment: e.target.value })
                } // Asignamos el evento onChange
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <ButtonGroup spacing={2}>
              <Button
                // isDisabled={!Object.keys(measurements).length}
                variant="ghost"
                onClick={onSubmit}
              >
                Crear
              </Button>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalReport;
