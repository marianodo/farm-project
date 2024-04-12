import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
} from '@chakra-ui/react';
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
  console.log('env:', import.meta.env);
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
            <h2>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left">
                  {field.name}
                </Box>
                <Box marginRight={14}>
                  <Link
                    to={`/newPen/${field.name}/${field.id}`}
                    className="btn btn-primary btn-sm mr-2 align-content-center"
                  >
                    Crear Corral
                  </Link>
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Accordion>
                {field?.pens.map((pen, i) => (
                  <AccordionItem key={i}>
                    <h2>
                      <AccordionButton>
                        <Box as="span" flex="1" textAlign="left">
                          {pen.name}
                        </Box>
                        <Box marginRight={9}>
                          <Link
                            to={`/measurement/${pen.id}`}
                            className="btn btn-primary btn-sm align-content-center"
                          >
                            Generar Medición
                          </Link>
                        </Box>
                      </AccordionButton>
                    </h2>
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
