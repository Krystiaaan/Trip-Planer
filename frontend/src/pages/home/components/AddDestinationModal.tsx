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
} from "@chakra-ui/react";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import { InputControl, TextareaControl, SubmitButton } from "formik-chakra-ui";

interface AddDestinationModalProps {
    isOpen: boolean;
    onClose: () => void;
    tripId: number;
}

const initialDestinationValues = {
    name: "",
    description: "",
    date: "",
    activities: "",
    photos: [""],
};

const destinationValidationSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    description: Yup.string().required("Required"),
    date: Yup.date().required("Required"),
    activities: Yup.string().required("Required"),
    photos: Yup.array().of(Yup.string().url("Invalid URL").required("Required")),
});

const handleAddDestinationSubmit = async (values: any, tripId: number) => {
    try {
        const response = await fetch("http://localhost:3000/api/dest", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                destinations: [{ ...values, trip_id: tripId }],
                trip_id: tripId,
            }),
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Error adding destination: ${errorMessage}`);
        }

        alert("Destination added successfully!");
        window.location.reload();
    } catch (error) {
        console.error("Error adding destination:", error);
        alert(`Failed to add destination. Please try again.`);
    }
};

const AddDestinationModal: React.FC<AddDestinationModalProps> = ({ isOpen, onClose, tripId }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Add Destination</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Formik
                        initialValues={initialDestinationValues}
                        validationSchema={destinationValidationSchema}
                        onSubmit={(values) => handleAddDestinationSubmit(values, tripId)}
                    >
                        {({ values }) => (
                            <Form>
                                <InputControl name="name" label="Destination Name" />
                                <TextareaControl name="description" label="Description" />
                                <InputControl name="date" label="Date" inputProps={{ type: "date" }} />
                                <TextareaControl name="activities" label="Activities" />
                                <FieldArray name="photos">
                                    {({ push, remove }) => (
                                        <div>
                                            {values.photos.map((_, index) => (
                                                <div key={index}>
                                                    <InputControl name={`photos[${index}]`} label={`Photo URL ${index + 1}`} />
                                                    <Button type="button" onClick={() => remove(index)}>Remove Photo</Button>
                                                </div>
                                            ))}
                                            <Button type="button" onClick={() => push("")}>Add Another Photo</Button>
                                        </div>
                                    )}
                                </FieldArray>
                                <SubmitButton>Submit</SubmitButton>
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

export default AddDestinationModal;