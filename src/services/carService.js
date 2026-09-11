import API from "../api/axios";

export const getCar = () => API.get("/cars");

export const getCarById = (id) => API.get(`/cars/${id}`);

export const addCar = (carData) => API.post("/cars", carData);

export const updateCar = (id, carData) => API.patch(`/cars/${id}`, carData);

export const deleteCar = (id) => API.delete(`/cars/${id}`);