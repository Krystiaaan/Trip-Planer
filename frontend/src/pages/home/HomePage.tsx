import { useState, useEffect } from "react";
import {
  Box,
  List,
  ListItem,
  Text,
  Image,
  Button,
  Grid,
  Card,
  CardBody,
  Stack,
  Heading,
  ButtonGroup,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import AddDestinationModal from "./components/AddDestinationModal";
import UpdateTripModal from "./components/UpdateTripModal";
import { fetchTrips, deleteTrip, updateTrip, deleteDestination } from "../../services/api";
import { BaseLayout } from "../../layout/BaseLayout";

function TripMain() {
  const [trips, setTrips] = useState([]);
  const [isAddDestinationOpen, setAddDestinationOpen] = useState(false);
  const [isUpdateTripOpen, setUpdateTripOpen] = useState(false);
  const [currentTripId, setCurrentTripId] = useState<number | null>(null);
  const [selectedTrip, setSelectedTrip] = useState<any>(null);
  const navigate = useNavigate();

  const loadTrips = async () => {
    try {
      const trips = await fetchTrips();
      setTrips(trips);
    } catch (error) {
      console.error("Error fetching trips:", error);
    }
  };

  useEffect(() => {
    loadTrips();
  }, []);

  const handleDeleteTrip = async (id: number) => {
    try {
      await deleteTrip(id);
      loadTrips();
    } catch (error) {
      console.error("Error deleting trip:", error);
    }
  };

  const handleUpdateTrip = async (id: number, updatedTrip: any) => {
    try {
      console.log("Updating trip with ID:", id, "with data:", updatedTrip);
      await updateTrip(id, updatedTrip);
      loadTrips();
      setUpdateTripOpen(false); 
    } catch (error) {
      console.error("Error updating trip:", error);
    }
  };

  const handleDeleteDestination = async (tripId: number, destinationId: number) => {
    try {
      await deleteDestination(tripId, destinationId);
      loadTrips();
    } catch (error) {
      console.error("Error deleting destination:", error);
    }
  };

  const openAddDestinationModal = (tripId: number) => {
    setCurrentTripId(tripId);
    setAddDestinationOpen(true);
  };

  const closeAddDestinationModal = () => {
    setAddDestinationOpen(false);
    setCurrentTripId(null);
  };

  const openUpdateTripModal = (trip: any) => {
    setSelectedTrip(trip);
    setUpdateTripOpen(true);
  };

  const closeUpdateTripModal = () => {
    setSelectedTrip(null);
    setUpdateTripOpen(false);
  };

  const navigateToTrip = (id: number) => {
    navigate(`/trip/${id}`);
  };

  return (
    <BaseLayout>
      <Box>
        <Grid templateColumns="repeat(5, 1fr)" gap={1}>
          {trips.map((trip: any, tripIndex: number) => (
            <Card key={trip.id} maxW="100%" p={2}>
              <CardBody>
                <Stack spacing={4}>
                  <Heading>{trip.name}</Heading>
                  <Text>{trip.description}</Text>
                  <Text>Start Date: {new Date(trip.start_date).toDateString()}</Text>
                  <Text>End Date: {new Date(trip.end_date).toDateString()}</Text>
                  <Text>Participants: {trip.participants}</Text>
                  {trip.image &&
                    trip.image.split(";").map((imageUrl: string, imageIndex: number) => (
                      <Image key={`${tripIndex}-${imageIndex}`} src={imageUrl.trim()} alt={`Trip ${tripIndex + 1}`} />
                    ))}
                  <List>
                    {trip.destinations.map((destination: any, destinationIndex: number) => (
                      <ListItem key={destination.id}>
                        <Text>Destination Name: {destination.name}</Text>
                        <Text>Destination Description: {destination.description}</Text>
                        <Text>Destination Date: {new Date(destination.date).toDateString()}</Text>
                        <Text>Destination Activities: {destination.activities}</Text>
                        <Box>
                          {destination.photos &&
                            destination.photos.split(";").map((photoUrl: string, photoIndex: number) => (
                              <Image key={`${destinationIndex}-${photoIndex}`} src={photoUrl.trim()} alt={`Destination ${destinationIndex + 1}`} />
                            ))}
                        </Box>
                        <Button bg="gray.300" _hover={{ bg: "gray.400" }} onClick={() => handleDeleteDestination(trip.id, destination.id)}>
                          Delete Destination
                        </Button>
                      </ListItem>
                    ))}
                  </List>
                  <ButtonGroup>
                    <Button bg="gray.300" _hover={{ bg: "gray.400" }} onClick={() => handleDeleteTrip(trip.id)}>
                      Delete Trip
                    </Button>
                    <Button bg="gray.300" _hover={{ bg: "gray.400" }} onClick={() => openAddDestinationModal(trip.id)}>
                      Add Destination
                    </Button>
                    <Button bg="gray.300" _hover={{ bg: "gray.400" }} onClick={() => openUpdateTripModal(trip)}>
                      Edit Trip
                    </Button>
                  </ButtonGroup>
                  <Button bg="blue.300" _hover={{ bg: "blue.400" }} onClick={() => navigateToTrip(trip.id)}>
                    Show Trip
                  </Button>
                </Stack>
              </CardBody>
            </Card>
          ))}
        </Grid>
        {currentTripId !== null && (
          <AddDestinationModal isOpen={isAddDestinationOpen} onClose={closeAddDestinationModal} tripId={currentTripId} />
        )}
        {selectedTrip !== null && (
          <UpdateTripModal isOpen={isUpdateTripOpen} onClose={closeUpdateTripModal} trip={selectedTrip} onUpdateTrip={handleUpdateTrip} />
        )}
      </Box>
    </BaseLayout>
  );
}

export default TripMain;