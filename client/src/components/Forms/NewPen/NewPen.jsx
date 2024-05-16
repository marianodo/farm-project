import { AddIcon, DeleteIcon, TriangleDownIcon } from "@chakra-ui/icons";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Tag,
  Text,
  Tooltip,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import EditAttribute from "../EditAttribute/EditAttribute";
import NewAtributte from "../NewAttribute/NewAttribute";
import axios from "axios";

const NewPen = ({ messageToast }) => {
  const navigate = useNavigate();
  const params = useParams();
  const [attributes, setAttributes] = useState([]);
  const [pens, setPens] = useState([]);

  const [typeObjects, setTypeObjects] = useState({});
  const [data, setData] = useState({
    field_id: parseInt(params.id),
    name: "",
    variables: [],
  });

  const resetStates = () => {
    setData({
      field_id: parseInt(params.id),
      name: "",
      variables: [],
    });
  };

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
        messageToast(response.data.message, "success");
        addNewPen(data.name);
        resetStates();
      })
      .catch((error) => {
        messageToast(error.response.data.error);
      });
  };

  const addNewPen = (pen) => {
    setPens([...pens, pen]);
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

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/field/${params.id}`)
      .then((response) => {
        setPens(response.data.pens);
      })
      .catch((error) => console.log(error));
    if (Object.keys(typeObjects).length === 0) {
      let types = {};
      axios
        .get(`${import.meta.env.VITE_API_BASE_URL}/typeofobjects`)
        .then((response) => {
          response.data.forEach((object) => {
            types[object.name] = object.id;
          });
          setTypeObjects(types);
        })
        .catch((error) => console.log(error));
    }
  }, [pens.length, params.id, typeObjects.length]);

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

  return (
    <div>
      <h2 className="text-center">{params.field}</h2>
      <Box display={"flex"} flexDirection={"column"} w="100%" marginTop={4}>
        <Text textAlign={"center"} as="u" fontWeight={600} marginBottom={4}>
          Corrales asociados:
        </Text>
        <Wrap marginBottom={2} alignSelf={"center"}>
          {pens.map((e, i) => (
            <WrapItem key={i}>
              <Tooltip label="Corral">
                <Tag p>{e.name}</Tag>
              </Tooltip>
            </WrapItem>
          ))}
        </Wrap>
      </Box>
      <FormControl>
        <FormLabel>Nombre del Corral:</FormLabel>
        <Input
          type="text"
          id="name"
          name="name"
          autoFocus={true}
          value={data.name}
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
            <Box key={`${attribute.name}-${i}`}>
              <Box
                display={"flex"}
                backgroundColor={"#1A1A1A"}
                margin={1}
                p={1}
                color={"white"}
                borderRadius={4}
              >
                <Tooltip
                  label={JSON.stringify(attribute.default_parameters)}
                  placement="top"
                >
                  <Text
                    as="span"
                    fontSize={7}
                    fontWeight={400}
                    alignSelf={"center"}
                    alignItems={"center"}
                    paddingX={1}
                  >
                    {attribute.name}
                  </Text>
                </Tooltip>
                <EditAttribute
                  messageToast={messageToast}
                  attribute={attribute}
                  changeAttribute={editAttribute}
                />
                <DeleteIcon
                  cursor={"pointer"}
                  backgroundColor={"red"}
                  fontSize={24}
                  paddingX={"0.2rem"}
                  paddingY={"0.12rem"}
                  marginY={1}
                  maxWidth={"26px"}
                  height={"18px"}
                  onClick={() => handleAttribute(attribute.id)}
                />
              </Box>
              <Box
                display={"flex"}
                justifyContent={"center"}
                alignContent={"center"}
                flexDirection={"column"}
              >
                <TriangleDownIcon
                  color={"#1A1A1A"}
                  boxSize={2}
                  fontSize={2}
                  marginBottom={1}
                  alignSelf={"center"}
                />
                <Text
                  as="sub"
                  color={"##1A1A1A"}
                  alignSelf={"center"}
                  fontSize={8}
                  fontWeight={800}
                  paddingBottom={2}
                  textTransform={"uppercase"}
                >
                  {attribute?.type_of_object?.name}
                </Text>
              </Box>
            </Box>
          ))}
        </div>
      </div>
      <div className="card border-primary bg-transparent mb-3 my-2">
        <div className="card-header d-flex  justify-content-between">
          <span className="align-content-center">Atributos</span>
          <NewAtributte
            messageToast={messageToast}
            addAttribute={addNewAttribute}
            typeObjects={typeObjects}
          />
        </div>
        <div className=" d-flex flex-wrap">
          {attributes.map((attribute, i) => {
            let inUse = attributeInUse(attribute.id);
            return (
              <div key={`${attribute.name}-${i}`} className="my-1 m-1">
                <Box display={"flex"} flexDirection={"column"} gap={1}>
                  <Box
                    display={"flex"}
                    className={
                      inUse
                        ? "badge bg-secondary text-uppercase p-1 "
                        : "badge text-uppercase bg-dark p-1"
                    }
                    justifyContent={"center"}
                  >
                    <Text
                      as="span"
                      fontSize={8}
                      alignSelf={"center"}
                      alignItems={"center"}
                      padding={1}
                    >
                      {attribute.name}
                    </Text>

                    {!inUse && (
                      <AddIcon
                        cursor={"pointer"}
                        onClick={() => handleAttribute(attribute.id)}
                        fontSize={10}
                        marginRight={1}
                        marginLeft={2}
                        alignSelf={"center"}
                      />
                    )}
                  </Box>
                  <Box
                    display={"flex"}
                    justifyContent={"center"}
                    alignContent={"center"}
                    flexDirection={"column"}
                  >
                    <TriangleDownIcon
                      color={inUse ? "#fff" : "#343A40"}
                      boxSize={2}
                      fontSize={2}
                      marginBottom={1}
                      alignSelf={"center"}
                    />
                    <Text
                      as="sub"
                      color={inUse ? "#fff" : "#343A40"}
                      alignSelf={"center"}
                      fontSize={8}
                      fontWeight={800}
                      paddingBottom={2}
                      textTransform={"uppercase"}
                    >
                      {attribute?.type_of_object?.name}
                    </Text>
                  </Box>
                </Box>
              </div>
            );
          })}
        </div>
      </div>
      <button onClick={onSubmit} className="btn btn-primary btn-sm">
        Crear corral
      </button>
      <button
        onClick={() => navigate(-1)}
        className="btn btn-secondary btn-sm align-content-center mx-2"
      >
        Volver
      </button>
    </div>
  );
};

export default NewPen;
