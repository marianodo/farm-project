import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
} from '@chakra-ui/react';
import axios from 'axios';

const ModalField = ({ addField, messageToast }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [inputField, setInputField] = useState('');

  const postField = () => {
    if (inputField) {
      axios
        .post(`${import.meta.env.VITE_API_BASE_URL}/field`, {
          fieldName: inputField,
        })
        .then((response) => {
          addField(response.data?.field);
          onClose();
          setInputField('');
          messageToast(response.data.message, 'success');
        })
        .catch(() => {
          messageToast('Hubo un error al crear el campo');
        });
    }
  };
  return (
    <>
      {/* <ToastContainer /> */}
      <button
        onClick={onOpen}
        className="btn btn-primary btn-sm mr-2 align-content-center"
      >
        Crear Campo
      </button>

      <Modal style={{ bg: 'red' }} isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent marginX={6}>
          <ModalHeader>Crear campo</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Nombre del campo</FormLabel>
              <Input
                onChange={(e) => {
                  setInputField(e.target.value);
                }}
                value={inputField}
                autoFocus={true}
                focusBorderColor="#1a1a1a"
                placeholder="Campo Maravilla"
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              bg="#1a1a1a"
              color="white"
              mr={3}
              _hover={{ bg: '#1a1a1a', color: 'white' }}
              onClick={postField}
            >
              Crear
            </Button>
            <Button
              onClick={() => {
                onClose();
                setInputField('');
              }}
            >
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalField;
