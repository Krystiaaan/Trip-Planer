import * as yup from 'yup';

export const tripSchema = yup.object().shape({
    id: yup.number().integer().positive().optional(),
    name: yup.string().max(255).required(),
    description: yup.string().required(),
    image: yup.array().of(yup.string()).optional(),
    start_date: yup.date().required(),
    end_date: yup.date().required(),
    participants: yup.number().integer().min(0).required(),
    finances: yup.object().optional() 
});

export const destinationSchema = yup.object().shape({
    id: yup.number().integer().positive().optional(),
    trip_id: yup.number().integer().required(),
    name: yup.string().max(255).required(),
    description: yup.string().required(),
    date: yup.date().required(),
    activities: yup.string().optional(),
    photos: yup.array().of(yup.string()).optional(),
});