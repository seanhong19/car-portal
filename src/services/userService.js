import API from "../api/axios";

export const getUsers = () => API.get("/users");

export const getUserByEmail = (email) => API.get(`/users?email=${email}`);

export const addUser = (userData) => API.post("/users", userData);

export const updateUser = (id, userData) => API.patch(`/users/${id}`, userData);