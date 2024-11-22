import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Box,
} from "@chakra-ui/react";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import { InputControl, TextareaControl, SubmitButton } from "formik-chakra-ui";

interface AddTripModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const combinedInitialValues = {
  trip: {
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    participants: 1,
    images: [""],
    finances: {
      budget: 0,
      expenses: [],
    },
  },
  destinations: [
    {
      name: "",
      description: "",
      date: "",
      activities: "",
      photos: [""],
      finances: {
        budget: 0,
        expenses: [],
      },
    },
  ],
};

const validationSchema = Yup.object().shape({
  trip: Yup.object().shape({
    name: Yup.string().required("Required"),
    description: Yup.string().required("Required"),
    start_date: Yup.date().required("Required"),
    end_date: Yup.date().required("Required"),
    participants: Yup.number().required("Required"),
    images: Yup.array().of(Yup.string().url("Invalid URL").required("Required")),
    finances: Yup.object().shape({
      budget: Yup.number().min(0, "Budget must be greater than or equal to 0").required("Required"),
      expenses: Yup.array().of(
        Yup.object().shape({
          title: Yup.string().required("Title is required"),
          amount: Yup.number().min(0, "Amount must be greater than or equal to 0").required("Amount is required"),
        })
      ).test('sum', 'Expenses exceed budget', function(expenses) {
        const totalExpenses = expenses ? expenses.reduce((acc, curr) => acc + curr.amount, 0) : 0;
        const budget = this.parent.budget;
        return totalExpenses <= budget || this.createError({ message: 'Expenses exceed budget' });
      }),
    }),
  }),
  destinations: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().optional(),
      description: Yup.string().optional(),
      date: Yup.date().optional(),
      activities: Yup.string().optional(),
      photos: Yup.array().of(Yup.string().url("Invalid URL").optional()),
    }),
  ),
});

const handleSubmit = async (values: any) => {
  try {
    const { trip, destinations } = values;

    const tripResponse = await fetch("http://localhost:3000/api/trips", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(trip),
    });

    if (!tripResponse.ok) {
      const errorMessage = await tripResponse.text();
      throw new Error(`Error adding trip: ${errorMessage}`);
    }

    const tripData = await tripResponse.json();
    const tripId = tripData.id;

    const filteredDestinations = destinations.filter((destination: any) =>
      destination.name || destination.description || destination.date || destination.activities || destination.photos.some((photo: string) => photo)
    );

    if (filteredDestinations.length > 0) {
      const combinedDestinations = filteredDestinations.map((destination: any) => ({
        ...destination,
        trip_id: tripId,
        photos: destination.photos.join(";"),
      }));

      const destinationResponse = await fetch("http://localhost:3000/api/dest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ destinations: combinedDestinations, trip_id: tripId }),
      });

      if (!destinationResponse.ok) {
        const errorMessage = await destinationResponse.text();
        throw new Error(`Error adding destinations: ${errorMessage}`);
      }
    }

    alert("Trip and destinations added successfully!");
    window.location.reload();
  } catch (error) {
    console.error("Error adding trip or destinations:", error);
    alert(`Failed to add trip or destinations. Please try again.`);
  }
};

const AddTripModal: React.FC<AddTripModalProps> = ({ isOpen, onClose }) => {
  const [showDestinations, setShowDestinations] = useState(false);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Trip</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Formik
            initialValues={combinedInitialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched }) => (
              <Form>
                <InputControl name="trip.name" label="Name" />
                <TextareaControl name="trip.description" label="Description" />
                <InputControl name="trip.start_date" label="Start Date" inputProps={{ type: "date" }} />
                <InputControl name="trip.end_date" label="End Date" inputProps={{ type: "date" }} />
                <InputControl name="trip.participants" label="Participants" inputProps={{ type: "number" }} />
                <InputControl name="trip.finances.budget" label="Budget" inputProps={{ type: "number" }} />
                <FieldArray name="trip.finances.expenses">
                  {({ push, remove }) => (
                    <div>
                      {values.trip.finances.expenses.map((_, index) => (
                        <div key={index}>
                          <InputControl name={`trip.finances.expenses[${index}].title`} label={`Expense Title ${index + 1}`} />
                          <InputControl name={`trip.finances.expenses[${index}].amount`} label={`Amount ${index + 1}`} inputProps={{ type: 'number' }} />
                          <Button type="button" onClick={() => remove(index)}>Remove Expense</Button>
                        </div>
                      ))}
                      <Button type="button" onClick={() => push({ title: '', amount: 0 })}>Add Another Expense</Button>  
                    </div>
                  )}
                </FieldArray>
                {Array.isArray(errors.trip?.finances?.expenses) && touched.trip?.finances?.expenses && (
                  <Box color="red.500" mt={2}>
                    {errors.trip.finances.expenses.map((error: any, index: number) => (
                      <div key={index}>{error.title || error.amount || error}</div>
                    ))}
                  </Box>
                )}
                {typeof errors.trip?.finances?.expenses === 'string' && (
                  <Box color="red.500" mt={2}>
                    {errors.trip.finances.expenses}
                  </Box>
                )}
                <FieldArray name="trip.images">
                  {({ push, remove }) => (
                    <div>
                      {values.trip.images.map((_, index) => (
                        <div key={index}>
                          <InputControl name={`trip.images[${index}]`} label={`Image URL ${index + 1}`} />
                          <Button type="button" onClick={() => remove(index)}>Remove Image</Button>
                        </div>
                      ))}
                      <Button type="button" onClick={() => push("")}>Add Another Image</Button>
                    </div>
                  )}
                </FieldArray>

                {!showDestinations && (
                  <Button mt={4} onClick={() => setShowDestinations(true)}>
                    Add Destination
                  </Button>
                )}

                {showDestinations && (
                  <>
                    <FieldArray name="destinations">
                      {({ push, remove }) => (
                        <div>
                          {values.destinations.map((_, destIndex) => (
                            <div key={destIndex}>
                              <InputControl name={`destinations[${destIndex}].name`} label={`Destination Name ${destIndex + 1}`} />
                              <TextareaControl name={`destinations[${destIndex}].description`} label="Description" />
                              <InputControl name={`destinations[${destIndex}].date`} label="Date" inputProps={{ type: "date" }} />
                              <TextareaControl name={`destinations[${destIndex}].activities`} label="Activities" />

                              <FieldArray name={`destinations[${destIndex}].photos`}>
                                {({ push, remove }) => (
                                  <div>
                                    {values.destinations[destIndex].photos.map((_, photoIndex) => (
                                      <div key={photoIndex}>
                                        <InputControl name={`destinations[${destIndex}].photos[${photoIndex}]`} label={`Photo URL ${photoIndex + 1}`} />
                                        <Button type="button" onClick={() => remove(photoIndex)}>Remove Photo</Button>
                                      </div>
                                    ))}
                                    <Button type="button" onClick={() => push("")}>Add Another Photo</Button>
                                  </div>
                                )}
                              </FieldArray>
                              <Button type="button" onClick={() => remove(destIndex)}>Remove Destination</Button>
                            </div>
                          ))}
                          <Button type="button" onClick={() => push({ name: "", description: "", date: "", activities: "", photos: [""] })}>
                            Add Another Destination
                          </Button>
                        </div>
                      )}
                    </FieldArray>
                  </>
                )}

                <SubmitButton mt={4}>Submit</SubmitButton>
              </Form>
            )}
          </Formik>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddTripModal;
