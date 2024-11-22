import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  Flex,
  Image,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

interface SearchResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: any;
}

const SearchResultsModal: React.FC<SearchResultsModalProps> = ({ isOpen, onClose, trip }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/trip/${trip.id}`);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Trip Details</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex direction="column" p={2}>
            <Image
              src={trip.image}
              alt={trip.name}
              mb={4}
              borderRadius="md"
            />
            <Text fontWeight="bold">{trip.name}</Text>
            <Text>{trip.description}</Text>
            <Text>
              {new Date(trip.start_date).toLocaleDateString()} -{" "}
              {new Date(trip.end_date).toLocaleDateString()}
            </Text>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={handleViewDetails} mr={3}>
            View Details
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SearchResultsModal;
