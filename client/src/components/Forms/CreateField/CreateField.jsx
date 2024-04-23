import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Text,
  Tooltip,
  Tag,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';
import ModalField from './ModalField';
const CreateField = ({ messageToast }) => {
  const [fields, setFields] = useState([]);
  const addField = (field) => {
    setFields([...fields, field]);
  };
  useEffect(() => {
    if (!fields.length) {
      axios
        .get(`${import.meta.env.VITE_API_BASE_URL}/field`)
        .then((response) => {
          setFields(response.data ? response.data : []);
        });
    }
  }, [fields.length]);
  return (
    <div>
      <Box
        as="span"
        flex="1"
        textAlign="left"
        justifyContent={'space-between'}
        display={'flex'}
        paddingX={2}
        paddingY={8}
      >
        <h1>Jhon Doe</h1>
        <ModalField addField={addField} messageToast={messageToast} />
      </Box>
      <Accordion allowToggle>
        {fields.map((field, index) => (
          <AccordionItem key={index}>
            <Box display={'flex'} flexDirection={'column'}>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  <Text as="b" marginRight={4}>
                    {field.name}
                  </Text>
                  <button className="badge bg-info m-1">
                    <EditIcon boxSize={3} />
                  </button>
                  <button className="badge bg-danger m-1">
                    <DeleteIcon
                      boxSize={3}
                      onClick={async (event) => {
                        event.stopPropagation();
                        await axios.delete(
                          `${import.meta.env.VITE_API_BASE_URL}/field/${
                            field.id
                          }`
                        );
                        const updatedFields = fields.filter(
                          (f) => f.id !== field.id
                        );
                        setFields(updatedFields);
                        alert('Campo eliminado');
                      }}
                    />
                  </button>
                </Box>
                <Box marginRight={4}>
                  <Link
                    to={`/newPen/${field.name}/${field.id}`}
                    className="btn btn-primary btn-sm mr-2 align-content-center"
                  >
                    Crear Corral
                  </Link>
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <Wrap marginX={3}>
                {field?.pens.map((e, i) => (
                  <WrapItem key={i}>
                    <Tooltip label="Corral">
                      <Tag>{e.name}</Tag>
                    </Tooltip>
                  </WrapItem>
                ))}
              </Wrap>
            </Box>
            <AccordionPanel pb={4}>
              <Accordion>
                {field?.pens.map((pen, i) => (
                  <AccordionItem key={i}>
                    <Box display={'flex'} flexDirection={'column'}>
                      <AccordionButton>
                        <Box flex="1" textAlign="left">
                          <Box display={'flex'} gap={1}>
                            <Text as="b" marginRight={4}>
                              {pen.name}
                            </Text>
                            <button className="badge bg-info m-1">
                              <EditIcon boxSize={3} />
                            </button>
                            <button className="badge bg-danger m-1">
                              <DeleteIcon boxSize={3} />
                            </button>
                          </Box>
                        </Box>
                        <Box marginRight={5}>
                          <Link
                            to={`/measurement/${pen.id}`}
                            className="btn btn-primary btn-sm align-content-center"
                          >
                            Generar Medición
                          </Link>
                        </Box>
                      </AccordionButton>
                      <Wrap marginX={3}>
                        {pen.pen_variable.map((e, i) => (
                          <WrapItem key={i}>
                            <Tooltip label="Variable">
                              <Tag key={i}>{e.variable.name}</Tag>
                            </Tooltip>
                          </WrapItem>
                        ))}
                      </Wrap>
                    </Box>
                  </AccordionItem>
                ))}
              </Accordion>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default CreateField;
