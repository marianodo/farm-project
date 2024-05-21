import "./loader.css";

import { Box, Spinner, Text } from "@chakra-ui/react";

const Loader = () => {
  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      width={"100%"}
      height={"80vh"}
      justifyContent={"center"}
      alignItems={"center"}
      gap={4}
    >
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="#11577b"
        size="xl"
      />
      <Text as={"h1"} color={"#edeef1"} marginLeft={7}>
        Cargando...
      </Text>
    </Box>
  );
};

export default Loader;
