import { Flex, Text, Button } from "@chakra-ui/react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import AddMain from "../pages/home/components/AddTripModal"; 
import SearchTrips from "../components/SearchTrips"; 
import SearchResultsModal from "../pages/home/components/SearchResultsModal";

export type BaseLayoutProps = {
  children: React.ReactNode;
};

export const BaseLayout = ({ children }: BaseLayoutProps) => {
  const [isAddMainOpen, setAddMainOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<any>(null);
  const [isSearchModalOpen, setSearchModalOpen] = useState(false);

  const openAddMain = () => setAddMainOpen(true);
  const closeAddMain = () => setAddMainOpen(false);
  const openSearchModal = () => setSearchModalOpen(true);
  const closeSearchModal = () => setSearchModalOpen(false);

  const handleTripSelect = (trip: any) => {
    setSelectedTrip(trip);
    openSearchModal();
  };

  return (
    <Flex width="100vw" bg="gray.100" flexDirection="column" position="relative">
      <Flex h="50px" bg="gray.200" align="center" justify="space-between" p={4} position="absolute" top={0} left={0} right={0} zIndex={10}>
        <Link to="/">
          <Text fontWeight="bold" fontSize="xl">
            Trip App
          </Text>
        </Link>
        <Flex align="center">
          <SearchTrips onTripSelect={handleTripSelect} />
          <Button onClick={openAddMain} bg="gray.300" _hover={{ bg: "gray.400" }} ml={2}>
            Add Trip
          </Button>
        </Flex>
      </Flex>
      <Flex flex={1} p={4} mt="50px" align="center" justify="center" width="100%">
        {children}
      </Flex>
      <AddMain isOpen={isAddMainOpen} onClose={closeAddMain} />
      {selectedTrip && <SearchResultsModal isOpen={isSearchModalOpen} onClose={closeSearchModal} trip={selectedTrip} />}
    </Flex>
  );
};
