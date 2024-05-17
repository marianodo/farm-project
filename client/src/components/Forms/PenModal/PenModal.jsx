import "react-toastify/dist/ReactToastify.css";

import {
  Button,
  Checkbox,
  CheckboxGroup,
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
  Stack,
  Wrap,
} from "@chakra-ui/react";

import axios from "axios";
import { useState } from "react";

const PenModal = ({
  open,
  setOpen,
  pen,
  setPen,
  penVariablesValues,
  setPenVariablesValues,
  setPensUpdated,
  messageToast,
}) => {
  const [isFormInvalid, setIsFormInvalid] = useState(true);
  const [penNameModified, setPenNameModified] = useState("");
  const [errorMessage, setErrorMessage] = useState({
    name: "",
    pen_variable: "",
  });
  const [data, setData] = useState({
    name: "",
    pen_variables_id: [],
  });
  const handleClose = () => {
    setIsFormInvalid(true);
    setErrorMessage({
      name: "",
      pen_variable: "",
    });
    setData({
      name: "",
      pen_variables_id: [],
    });
    setPenNameModified("");
    setOpen(false);
    setPen(null);
    setPenVariablesValues({});
    setPensUpdated(false);
  };
  const handleChange = (e) => {
    if (e.target.value[0] == " ") {
      setErrorMessage({
        ...errorMessage,
        name: "El nombre no puede empezar con un espacio",
      });
      setIsFormInvalid(true);
      setData({ ...data, name: "" });
    } else if (e.target.value.trim().length <= 2) {
      setErrorMessage({
        ...errorMessage,
        name: "El nombre del corral no puede estar vacio y tiene que tener una longitud mayor a 2 caracteres",
      });
      setIsFormInvalid(true);
      setData({ ...data, name: "" });
    } else {
      setErrorMessage({ ...errorMessage, name: "" });
      if (errorMessage.pen_variable === "") {
        setIsFormInvalid(false);
      }
      setPenNameModified(e.target.value);
      setData({
        ...data,
        name: e.target.value,
      });
    }
  };

  const handleCheck = (value) => {
    if (value.length >= Object.keys(penVariablesValues).length) {
      setErrorMessage({
        ...errorMessage,
        pen_variable:
          "No puedes eliminar todas las asociaciones debe quedar al menos 1",
      });
      setIsFormInvalid(true);
      return;
    }
    setErrorMessage({
      ...errorMessage,
      pen_variable: "",
    });
    let penVariablesIds = [];
    value.map((name) => {
      penVariablesIds.push(penVariablesValues[name]);
    });
    setData({
      ...data,
      pen_variables_id: penVariablesIds,
    });

    if (errorMessage.name === "" && value.length > 0) {
      setIsFormInvalid(false);
    }

    if (value.length === 0 && penNameModified === "") {
      setIsFormInvalid(true);
    }
  };

  const updatePen = async () => {
    if (data.name) {
      await axios
        .put(`${import.meta.env.VITE_API_BASE_URL}/pen/${pen.id}`, {
          name: data.name.trim(),
        })
        .catch((error) => {
          messageToast(error.response?.data.error);
        });
    }
    if (data.pen_variables_id) {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/penVariable/variable`,
        {
          data: { penVariables: data.pen_variables_id },
        }
      );
    }
    await messageToast("Corral actualizado correctamente", "success");
    setPensUpdated(true);
    setOpen(false);
    setIsFormInvalid(true);
    setErrorMessage({
      name: "",
      pen_variable: "",
    });
  };

  return (
    <>
      <Modal isCentered isOpen={open} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent marginX={6}>
          <ModalHeader>Editar corral</ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDirection={"column"} gap={6} pb={6}>
            <FormControl>
              <FormLabel>Nombre del corral</FormLabel>
              <Input
                onChange={(e) => handleChange(e)}
                onKeyDown={(e) => (e.key === "Enter" ? updatePen() : null)}
                defaultValue={pen?.name}
                autoFocus={true}
                focusBorderColor="#1a1a1a"
                placeholder="Campo Maravilla"
              />
              {errorMessage.name && <p>{errorMessage.name}</p>}
            </FormControl>
            {pen?.pen_variable?.length ? (
              <FormControl>
                <FormLabel>Elimar asociacion con variables</FormLabel>

                <CheckboxGroup colorScheme="red" onChange={handleCheck}>
                  <Stack
                    paddingBottom={2}
                    spacing={[1, 5]}
                    direction={["column", "row"]}
                  >
                    <Wrap>
                      {pen?.pen_variable?.map((p, i) => (
                        <Checkbox
                          key={i}
                          value={
                            p?.variable?.name +
                            "-" +
                            p?.variable?.type_of_object?.name
                          }
                        >
                          {p?.variable?.name} -{" "}
                          {p?.variable?.type_of_object?.name}
                        </Checkbox>
                      ))}
                    </Wrap>
                  </Stack>
                </CheckboxGroup>

                {errorMessage.pen_variable && (
                  <p>{errorMessage.pen_variable}</p>
                )}
              </FormControl>
            ) : null}
          </ModalBody>

          <ModalFooter>
            <Button
              bg="#1a1a1a"
              color="white"
              mr={3}
              _hover={{ bg: "#1a1a1a", color: "white" }}
              onClick={updatePen}
              isDisabled={isFormInvalid}
            >
              Guardar
            </Button>
            <Button onClick={handleClose}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PenModal;
