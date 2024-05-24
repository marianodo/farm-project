import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";

import axios from "axios";

const ModalAlert = ({ open, setOpen, fieldId, fields, setFields }) => {
  return (
    <>
      <AlertDialog isCentered isOpen={open}>
        <AlertDialogOverlay>
          <AlertDialogContent marginX={6}>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Borrar Campo
            </AlertDialogHeader>

            <AlertDialogBody>
              Esta seguro que desea borrar el campo?
            </AlertDialogBody>

            <AlertDialogFooter gap={2}>
              <Button
                colorScheme="red"
                onClick={async () => {
                  await axios.delete(
                    `${import.meta.env.VITE_API_BASE_URL}/field/${fieldId}`
                  );
                  const updatedFields = fields?.filter(
                    (f) => f?.id !== fieldId
                  );
                  setFields(updatedFields);
                  alert("Campo eliminado");
                  setOpen(false);
                }}
                ml={3}
              >
                Borrar
              </Button>
              <Button
                onClick={async () => {
                  setOpen(false);
                }}
              >
                Cancelar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default ModalAlert;
