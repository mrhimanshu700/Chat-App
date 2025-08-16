import { Avatar, Box } from "@chakra-ui/react";
import React from "react";

function UserListItem({ user, handleFunction }) {
  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      bg="#E8E8E8"
      _hover={{
        background: "#38B2AC",
        color: "white",
      }}
      w="100%"
      display="flex"
      alignItems="center"
      color="black"
      px={3}
      py={2}
      mb={2}
      mt={3}
      borderRadius="lg"
    >
      <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={user.username}
        src={user.pic}
      />
      <div>
        <h3>{user.username}</h3>
        <h3 fontSize="xs">
          <b>Email : </b>
          {user.email}
        </h3>
      </div>
    </Box>
  );
}

export default UserListItem;
