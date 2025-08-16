import { ViewIcon } from "@chakra-ui/icons";
import {
  Button,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Image,
  Text,
  Box,
  Avatar,
  useToast,
} from "@chakra-ui/react";
import React from "react";

function ProfileModel({ user, children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Function to get initials from username
  const getInitials = (name) => {
    if (!name) return "";
    const names = name.split(" ");
    return names
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Handle case when image fails to load
  const handleImageError = (e) => {
    e.target.style.display = "none";
    toast({
      title: "Profile image not available",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          display={{ base: "flex" }}
          icon={<ViewIcon />}
          onClick={onOpen}
          colorScheme="teal"
        />
      )}

      <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay backdropFilter="blur(5px)" />
        <ModalContent h="410px" borderRadius="xl" boxShadow="xl">
          <ModalHeader
            fontSize="2xl"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
            textAlign="center"
            pb={0}
            color="#38B2AC"
          >
            {user.username || "User Profile"}
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
            py={6}
          >
            <Box position="relative">
              {user.image ? (
                <Image
                  borderRadius="full"
                  boxSize="150px"
                  src={user.image}
                  alt={user.username}
                  onError={handleImageError}
                  fallback={
                    <Avatar
                      size="xl"
                      name={user.username}
                      bg="#38B2AC"
                      color="white"
                    />
                  }
                />
              ) : (
                <Avatar
                  size="xl"
                  name={user.username}
                  bg="#38B2AC"
                  color="white"
                  fontSize="3xl"
                />
              )}
            </Box>

            <Box textAlign="center" mt={4}>
              <Text fontSize="xl" fontWeight="bold" mb={2} color="#38B2AC">
                {user.username}
              </Text>
              <Text fontSize="md" color="gray.600">
                Email: {user.email || "Not provided"}
              </Text>
            </Box>
          </ModalBody>

          <ModalFooter justifyContent="center">
            <Button
              bg="#38B2AC"
              _hover={{ bg: "#2C8C8C" }}
              color="white"
              px={8}
              onClick={onClose}
              borderRadius="full"
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ProfileModel;
