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
  Text,
  useDisclosure,
} from "@chakra-ui/react";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const ModalReport = ({ messageToast, field_id, pens }) => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [report, setReport] = useState({
    name: "",
    comment: "",
    field_id: field_id,
  });
  const [error, setError] = useState("");

  const onSubmit = async () => {
    await axios
      .post(`${import.meta.env.VITE_API_BASE_URL}/report`, report)
      .then((response) => {
        messageToast(
          response.data.message,
          "success",
          `/reportMeasurement/${report.field_id}/${response.data.report.id}`,
          navigate
        );
        onClose();
      })
      .catch((error) => {
        messageToast(error.response.data.error, "error");
      });
  };
  // setTimeout(() => {
  //   window.location.href = `/reportMeasurement/${report.field_id}/${response.data.report.id}`;
  // }, 1200);

  return (
    <>
      <Button
        bg="#edeef1"
        color="#1a1a1a"
        size="xs"
        py={4}
        px={[2, 3]}
        fontSize={["8.4px", "10px"]}
        textTransform="uppercase"
        _hover={{ bg: "white", color: "#1a1a1a" }}
        onClick={(e) => {
          e.stopPropagation();
          onOpen();
        }}
        isDisabled={!pens.length}
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
        <ModalContent marginX={6}>
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
              <FormLabel display={"flex"} gap={1} alignItems={"center"}>
                Nombre{" "}
                <Text as={"sub"} mb={1}>
                  (Opcional)
                </Text>
              </FormLabel>
              <Input
                placeholder={`Ingrese un nombre`}
                onChange={(e) => setReport({ ...report, name: e.target.value })}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel display={"flex"} gap={1} alignItems={"center"}>
                Comentario{" "}
                <Text as={"sub"} mb={1}>
                  (Opcional)
                </Text>
              </FormLabel>
              <Input
                placeholder={`Ingrese un comentario`}
                onChange={(e) =>
                  setReport({ ...report, comment: e.target.value })
                }
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <ButtonGroup spacing={2}>
              <Button
                background={"#11577b"}
                color={"#fff"}
                _hover={{ background: "#144966" }}
                onClick={onSubmit}
              >
                Crear
              </Button>
              <Button mr={3} onClick={onClose} background={"#edeef1"}>
                Cerrar
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalReport;
