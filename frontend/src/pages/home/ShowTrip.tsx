import { useState, useEffect } from "react";
import { Box, Text, Image, Button, List, ListItem, Card, CardBody, Stack, Heading } from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchTripById, deleteTrip, updateTrip, deleteDestination } from "../../services/api";
import AddDestinationModal from "./components/AddDestinationModal";
import UpdateTripModal from "./components/UpdateTripModal";
import { BaseLayout } from "../../layout/BaseLayout";

function ShowTrip() {
  const { id } = useParams<{ id: string }>();
  const [trip, setTrip] = useState<any>(null);
  const [isAddDestinationOpen, setAddDestinationOpen] = useState(false);
  const [isUpdateTripOpen, setUpdateTripOpen] = useState(false);
  const navigate = useNavigate();

  const loadTrip = async () => {
    try {
      const tripData = await fetchTripById(parseInt(id || "", 10));
      setTrip(tripData);
    } catch (error) {
      console.error("Error fetching trip:", error);
    }
  };

  useEffect(() => {
    loadTrip();
  }, [id]);

  const handleDeleteTrip = async (id: number) => {
    try {
      await deleteTrip(id);
      navigate("/");
    } catch (error) {
      console.error("Error deleting trip:", error);
    }
  };

  const handleUpdateTrip = async (id: number, updatedTrip: any) => {
    try {
      await updateTrip(id, updatedTrip);
      loadTrip();
      setUpdateTripOpen(false);
    } catch (error) {
      console.error("Error updating trip:", error);
    }
  };

  const handleDeleteDestination = async (tripId: number, destinationId: number) => {
    try {
      await deleteDestination(tripId, destinationId);
      loadTrip();
    } catch (error) {
      console.error("Error deleting destination:", error);
    }
  };

  const openAddDestinationModal = () => {
    setAddDestinationOpen(true);
  };

  const closeAddDestinationModal = () => {
    setAddDestinationOpen(false);
  };

  const openUpdateTripModal = () => {
    setUpdateTripOpen(true);
  };

  const closeUpdateTripModal = () => {
    setUpdateTripOpen(false);
  };

  if (!trip) return <Text>Loading...</Text>;

  return (
    <BaseLayout>
      <Box>
          <Card maxW="100%" p={2}>
            <CardBody>
              <Stack spacing={4}>
                <Heading>{trip.name}</Heading>
                <Text>{trip.description}</Text>
                <Text>Start Date: {new Date(trip.start_date).toDateString()}</Text>
                <Text>End Date: {new Date(trip.end_date).toDateString()}</Text>
                <Text>Participants: {trip.participants}</Text>
                <Text>Budget: {trip.finances.budget} €</Text>
                <Text>Expenses: </Text>
                <List spacing={3}>
                {trip.finances.expenses.map((expense: any, index: number) => (
                  <ListItem key={index}>
                    <Text>Title: {expense.title}</Text>
                    <Text>Amount: {expense.amount} €</Text>
                  </ListItem>
                ))}
                </List>
                {trip.image &&
                  trip.image.split(";").map((imageUrl: string, index: number) => (
                    <Box key={index} width="600px" height="400px">
                    <Image key={index} src={imageUrl.trim()} alt={`Trip ${index + 1}`} />
                    </Box>
                  ))}
                <List>
                  {trip.destinations.map((destination: any, index: number) => (
                    <ListItem key={destination.id}>
                      <Text>Destination Name: {destination.name}</Text>
                      <Text>Destination Description: {destination.description}</Text>
                      <Text>Destination Date: {new Date(destination.date).toDateString()}</Text>
                      <Text>Destination Activities: {destination.activities}</Text>
                      <Box>
                        {destination.photos &&
                          destination.photos.split(";").map((photoUrl: string, photoIndex: number) => (
                            <Box key={`${index}-${photoIndex}`} width="600px" height="400px">
                            <Image key={`${index}-${photoIndex}`} src={photoUrl.trim()} alt={`Destination ${index + 1}`} />
                            </Box>
                          ))}
                      </Box>
                      <Button bg="gray.300" _hover={{ bg: "gray.400" }} onClick={() => handleDeleteDestination(trip.id, destination.id)}>
                        Delete Destination
                      </Button>
                    </ListItem>
                  ))}
                </List>
                <Button bg="gray.300" _hover={{ bg: "gray.400" }} onClick={() => handleDeleteTrip(trip.id)}>
                  Delete Trip
                </Button>
                <Button bg="gray.300" _hover={{ bg: "gray.400" }} onClick={openAddDestinationModal}>
                  Add Destination
                </Button>
                <Button bg="gray.300" _hover={{ bg: "gray.400" }} onClick={openUpdateTripModal}>
                  Edit Trip
                </Button>
              </Stack>
            </CardBody>
          </Card>
        {trip.id !== null && (
          <AddDestinationModal isOpen={isAddDestinationOpen} onClose={closeAddDestinationModal} tripId={trip.id} />
        )}
        {trip.id !== null && (
          <UpdateTripModal isOpen={isUpdateTripOpen} onClose={closeUpdateTripModal} trip={trip} onUpdateTrip={handleUpdateTrip} />
        )}
      </Box>
    </BaseLayout>
  );
}

export default ShowTrip;
