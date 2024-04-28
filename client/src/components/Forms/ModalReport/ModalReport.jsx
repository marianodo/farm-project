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

const ModalReport = ({ pen_id, setReports }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [attributes, setAttributes] = useState([]);
  const [data, setData] = useState({
    cow_name: "",
    pen_id: "",
    measurements: {},
  });
  const handleClick = (e) => {
    e.stopPropagation();
    onOpen();
  };
  const handleChange = () => {
    setReports((prevReports) => ({
      ...prevReports,
    }));
    // Actualizamos el valor del input
  };

  useEffect(() => {
    let defaultValues = {};
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/penVariable/${pen_id}`)
      .then((response) => {
        response.data.forEach((prop) => {
          defaultValues[prop.id] = "";
        });
        setAttributes(response.data);
        setData({
          ...data,
          pen_id: parseInt(pen_id),
          measurements: defaultValues,
        });
      })
      .catch((error) => console.log(error));
  }, []);
  console.log(attributes);
  return (
    <>
      <Button onClick={handleClick}>Abrir Modal</Button>
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
                  placeholder={`Enter s`}
                  //   value={value[]} // Asignamos el valor del input
                  onChange={handleChange} // Asignamos el evento onChange
                />
              </FormControl>
            ))}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalReport;
