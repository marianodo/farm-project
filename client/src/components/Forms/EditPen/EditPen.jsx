import { AddIcon, DeleteIcon, TriangleDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  ButtonGroup,
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
import Loader from "../../Loader/Loader";
import NewAtributte from "../NewAttribute/NewAttribute";
import axios from "axios";
import messageToast from "../../../utils/messageToast";

const EditPen = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [attributes, setAttributes] = useState([]);
  const [pens, setPens] = useState([]);
  const [loader, setLoader] = useState(true);
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
        setLoader(false);
      })
      .catch((error) => {
        setLoader(false);
        console.log(error);
      });
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

  if (loader) return <Loader />;

  return (
    <Box paddingTop={6}>
      <Text as="h2" color={"#fff"} textAlign={"center"}>
        {params.field}
      </Text>
      <Box display={"flex"} flexDirection={"column"} w="100%" marginTop={4}>
        <Text
          textAlign={"center"}
          as="u"
          fontWeight={600}
          marginBottom={4}
          color={"#fff"}
        >
          Corrales asociados:
        </Text>
        <Wrap marginBottom={2} alignSelf={"center"}>
          {pens.map((e, i) => (
            <WrapItem key={i}>
              <Tooltip label="Corral">
                <Tag
                  backgroundColor={"#1F9ACF"}
                  color={"#fff"}
                  size={"sm"}
                  fontSize={"11px"}
                >
                  {e.name}
                </Tag>
              </Tooltip>
            </WrapItem>
          ))}
        </Wrap>
      </Box>
      <FormControl>
        <FormLabel color={"#fff"}>Nombre del Corral:</FormLabel>
        <Input
          type="text"
          id="name"
          name="name"
          autoFocus={true}
          value={data.name}
          onChange={handleChange}
          required
          color="#fff"
          focusBorderColor="#fff"
          placeholder="Hospital"
          _placeholder={{ color: "#55595c" }}
        />
      </FormControl>

      <Box
        className="card  bg-transparent mb-3 my-2"
        border={"1px solid #85898b"}
        color={"#fff"}
      >
        <Box
          className="card-header"
          borderBottom={data.variables.length ? "1px solid #11577b" : ""}
          marginBottom={1}
        >
          <Text fontSize={14} fontWeight={600} margin={0}>
            Atributos seleccionados
          </Text>
        </Box>
        <Box px={2} className=" d-flex flex-wrap">
          {data.variables.map((attribute, i) => (
            <Box pb={1} key={`${attribute.name}-${i}`}>
              <Box
                display={"flex"}
                backgroundColor={"#343A40"}
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
                    fontWeight={600}
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
                  backgroundColor={"#d9534f"}
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
                  color={"#fff"}
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
        </Box>
      </Box>
      <Box
        className="card  bg-transparent mb-3 my-2"
        color={"#fff"}
        border={"1px solid #85898b"}
      >
        <Box
          className="card-header d-flex  justify-content-between"
          borderBottom={attributes.length ? "1px solid #11577b" : ""}
          mb={1}
        >
          <Text fontSize={14} fontWeight={600} margin={0} alignSelf={"center"}>
            Atributos
          </Text>
          <NewAtributte
            messageToast={messageToast}
            addAttribute={addNewAttribute}
            typeObjects={typeObjects}
          />
        </Box>
        <Box className=" px-2 py-1 d-flex flex-wrap">
          {attributes.map((attribute, i) => {
            let inUse = attributeInUse(attribute.id);
            return (
              <Box key={`${attribute.name}-${i}`} className="my-1 m-1">
                <Box display={"flex"} flexDirection={"column"} gap={1}>
                  <Box
                    rounded={4}
                    onClick={() => handleAttribute(attribute.id)}
                    cursor={"pointer"}
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
                      color={inUse ? "#fff" : "#989898"}
                      boxSize={2}
                      fontSize={2}
                      marginBottom={1}
                      alignSelf={"center"}
                    />
                    <Text
                      as="sub"
                      color={inUse ? "#fff" : "#989898"}
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
              </Box>
            );
          })}
        </Box>
      </Box>
      <ButtonGroup spacing={2}>
        <Button
          isDisabled={
            (data.name === "" && data.variables.length) === 0 ||
            data.name === "" ||
            data.variables.length === 0
          }
          bg="#11577b"
          color="#fff"
          _hover={{ background: "#144966" }}
          _disabled={{ background: "#0d2f44" }}
          size="xs"
          py={4}
          fontSize="10px"
          textTransform="uppercase"
          onClick={onSubmit}
          className="btn btn-primary btn-sm"
        >
          Crear corral
        </Button>
        <Button
          bg="#edeef1"
          color="#1a1a1a"
          size="xs"
          py={4}
          fontSize="10px"
          textTransform="uppercase"
          _hover={{ bg: "white", color: "#1a1a1a" }}
          onClick={() => navigate(-1)}
        >
          Volver
        </Button>
      </ButtonGroup>
    </Box>
  );
};

export default EditPen;
