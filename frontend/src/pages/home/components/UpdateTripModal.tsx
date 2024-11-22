import React, { useEffect, useState } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter,
  ModalBody, ModalCloseButton, Button, Box,
} from '@chakra-ui/react';
import { Formik, Form, FieldArray } from 'formik';
import * as Yup from 'yup';
import { InputControl, TextareaControl, SubmitButton } from 'formik-chakra-ui';

interface UpdateTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: any;
  onUpdateTrip: (id: number, updatedTrip: any) => void;
}

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
      ).test('sum', 'Expenses exceed budget', function (expenses) {
        const totalExpenses = expenses ? expenses.reduce((acc, curr) => acc + curr.amount, 0) : 0;
        const budget = this.parent.budget;
        return totalExpenses <= budget || this.createError({ message: 'Expenses exceed budget' });
      }),
    }),
  }),
});

const UpdateTripModal: React.FC<UpdateTripModalProps> = ({ isOpen, onClose, trip, onUpdateTrip }) => {
  const [initialValues, setInitialValues] = useState({
    trip: {
      name: '',
      description: '',
      start_date: '',
      end_date: '',
      participants: 0,
      images: [''], 
      finances: {
        budget: 0,
        expenses: [{ title: '', amount: 0 }],
      },
    },
  });

  useEffect(() => {
    if (trip) {
      setInitialValues({
        trip: {
          name: trip.name || '',
          description: trip.description || '',
          start_date: trip.start_date || '',
          end_date: trip.end_date || '',
          participants: trip.participants || 0,
          images: trip.images && trip.images.length > 0 ? trip.images : [''], 
          finances: {
            budget: trip.finances?.budget || 0,
            expenses: trip.finances?.expenses || [{ title: '', amount: 0 }],
          },
        },
      });
    }
  }, [trip]);

  const handleSubmit = async (values: any) => {
    try {
      const { trip: updatedTrip } = values;
      onUpdateTrip(trip.id, updatedTrip);
    } catch (error) {
      console.error('Error updating trip:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Update Trip</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Formik
            enableReinitialize
            initialValues={initialValues}
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
                          <InputControl name={`trip.images[${index}]`} label={`Image URL ${index + 1}`}/>
                          <Button type="button" onClick={() => remove(index)}>Remove Image</Button>
                        </div>
                      ))}
                      <Button type="button" onClick={() => push('')}>Add Another Image</Button>
                    </div>
                  )}
                </FieldArray>
                <SubmitButton mt={4}>Save</SubmitButton>
              </Form>
            )}
          </Formik>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UpdateTripModal;
