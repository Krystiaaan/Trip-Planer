import { Flex, Input, Box, Text, List, ListItem } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import axios from "axios";

const SearchTrips = ({ onTripSelect }: { onTripSelect: (trip: any) => void }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300); 

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  useEffect(() => {
    if (debouncedQuery.trim()) {
      const fetchTrips = async () => {
        try {
          const response = await axios.get("http://localhost:3000/api/trips/search", {
            params: { query: debouncedQuery },
          });
          setSuggestions(response.data);
        } catch (error) {
          console.error("Error fetching trips:", error);
          setSuggestions([]); 
        }
      };

      fetchTrips();
    } else {
      setSuggestions([]); 
    }
  }, [debouncedQuery]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSuggestionClick = (trip: any) => {
    onTripSelect(trip);
    setSearchQuery("");
    setSuggestions([]);
  };

  return (
    <Flex direction="column" align="center" position="relative">
      <Input
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Search by name, date or destination"
        bg="white"
        mr={2}
      />
      {suggestions.length > 0 && (
        <Box position="absolute" top="100%" left={0} right={0} bg="white" border="1px solid #ccc" zIndex={10}>
          <List spacing={0}>
            {suggestions.map((trip, index) => (
              <ListItem key={index} onClick={() => handleSuggestionClick(trip)} cursor="pointer" p={2} _hover={{ bg: "gray.200" }}>
                <Text fontWeight="bold">{trip.name}</Text>
                <Text>{new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}</Text>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Flex>
  );
};

export default SearchTrips;
