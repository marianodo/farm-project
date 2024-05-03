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
import { useEffect, useState } from "react";

import axios from "axios";

const ModalMeasurements = ({ pen_id, addMeasurements }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [attributes, setAttributes] = useState([]);
  const [measurements, setMeasurements] = useState({});
  const handleClick = (e) => {
    e.stopPropagation();
    onOpen();
  };
  const handleChange = (e) => {
    setMeasurements({ ...measurements, [e.target.name]: e.target.value });
  };
  console.log("corral measurments:", measurements);
  useEffect(() => {
    let defaultValues = {};
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/penVariable/${pen_id}`)
      .then((response) => {
        response.data.forEach((prop) => {
          defaultValues[prop.id] = "";
        });
        setAttributes(response.data);
        setMeasurements({
          ...defaultValues,
        });
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <>
      <Button
        bg="#18181b"
        color="white"
        size="sm"
        px={[2, 3]}
        fontSize={["8.4px", "10px"]}
        textTransform="uppercase"
        _hover={{ bg: "white", color: "#1a1a1a" }}
        onClick={handleClick}
      >
        Medir
      </Button>
      <Modal
        isCentered
        onClose={onClose}
        isOpen={isOpen}
        scrollBehavior={"inside"}
      >
        <ModalOverlay />
        <ModalContent marginX={6}>
          <ModalHeader>Report </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {attributes?.map((e, i) => (
              <FormControl key={i} mt={4}>
                <FormLabel>{e.variable.name}</FormLabel>
                <Input
                  name={e.id}
                  placeholder={``}
                  //   value={value[]} // Asignamos el valor del input
                  onChange={handleChange} // Asignamos el evento onChange
                />
              </FormControl>
            ))}
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={() => {
                addMeasurements(measurements);
                onClose();
              }}
              colorScheme="blue"
              mr={3}
            >
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalMeasurements;
