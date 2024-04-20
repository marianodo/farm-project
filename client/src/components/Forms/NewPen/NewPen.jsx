import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import NewAtributte from '../NewAttribute/NewAttribute';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { FormControl, FormLabel, Input, Tooltip } from '@chakra-ui/react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import EditAttribute from '../EditAttribute/EditAttribute';

const NewPen = ({ messageToast }) => {
  const params = useParams();
  const [attributes, setAttributes] = useState([]);

  const [redirect, setRedirect] = useState(false);
  const [data, setData] = useState({
    field_id: params.id,
    name: '',
    variables: [],
  });
  const onSubmit = () => {
    let body = {
      ...data,
      variables: data.variables.map((v) => ({
        id: v.id,
        parameters: v.default_parameters,
      })),
    };
    axios
      .post(`${import.meta.env.VITE_API_BASE_URL}/pen`, body)
      .then((response) => {
        messageToast(response.data.message, 'success');
        setRedirect(true);
      })
      .catch((error) => {
        messageToast(error.response.data.error);
      });
  };

  const addNewAttribute = (attribute) => {
    setAttributes([...attributes, attribute]);
  };

  const handleAttribute = (id) => {
    if (attributeInUse(id)) {
      setData({
        ...data,
        variables: data.variables.filter((variable) => variable.id != id),
      });
    } else {
      let attribute = attributes.find((attribute) => attribute.id == id);
      setData({
        ...data,
        variables: [...data.variables, attribute],
      });
    }
  };

  const attributeInUse = (id) => {
    return data.variables.find((variable) => variable.id === id);
  };
  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/variable`)
      .then((response) => {
        setAttributes(response.data);
      })
      .catch((error) => console.log(error));
  }, [attributes.length]);

  function editAttribute(attribute) {
    setData({
      ...data,
      variables: data.variables.map((oldAttribute) => {
        if (oldAttribute.id === attribute.id) {
          return attribute;
        }
        return oldAttribute;
      }),
    });
  }

  if (redirect) return <Navigate to="/field" />;
  return (
    <div>
      <h2 className="text-center">{params.field}</h2>

      <FormControl>
        <FormLabel>Nombre del Corral:</FormLabel>
        <Input
          type="text"
          id="name"
          name="name"
          autoFocus={true}
          onChange={handleChange}
          required
          focusBorderColor="#1a1a1a"
          placeholder="Toro Dorado"
        />
      </FormControl>

      <div className="card border-primary bg-transparent mb-3 my-2">
        <div className="card-header ">Atributos seleccionados </div>
        <div className=" d-flex flex-wrap">
          {data.variables.map((attribute, i) => (
            <div
              key={`${attribute.name}-${i}`}
              className={'badge bg-primary m-2  d-flex '}
            >
              <Tooltip
                label={JSON.stringify(attribute.default_parameters)}
                placement="top"
              >
                <span className={'m-1 text-uppercase align-content-center'}>
                  {attribute.name}
                </span>
              </Tooltip>
              <EditAttribute
                messageToast={messageToast}
                attribute={attribute}
                changeAttribute={editAttribute}
              />
              <button
                className="badge bg-danger m-1"
                onClick={() => handleAttribute(attribute.id)}
              >
                <DeleteIcon boxSize={4} />
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="card border-primary bg-transparent mb-3 my-2">
        <div className="card-header d-flex  justify-content-between">
          <span className="align-content-center">Atributos</span>
          <NewAtributte addAttribute={addNewAttribute} />
        </div>
        <div className=" d-flex flex-wrap">
          {attributes.map((attribute, i) => {
            let inUse = attributeInUse(attribute.id);
            return (
              <div key={`${attribute.name}-${i}`} className="my-2 m-2">
                <span
                  className={
                    inUse
                      ? 'badge bg-secondary text-uppercase p-2 '
                      : 'badge text-uppercase bg-dark p-2'
                  }
                >
                  {attribute.name}
                  {!inUse && (
                    <button
                      size="xs"
                      onClick={() => handleAttribute(attribute.id)}
                    >
                      <AddIcon marginLeft={2} />
                    </button>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <button onClick={onSubmit} className="btn btn-primary btn-sm">
        Crear corral
      </button>
      <Link
        to="/field"
        className="btn btn-secondary btn-sm align-content-center mx-2"
      >
        Cancelar
      </Link>
    </div>
  );
};

export default NewPen;
