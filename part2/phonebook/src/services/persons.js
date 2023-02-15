import axios from "axios";
const baseUrl = "http://localhost:3001/persons";

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = (newPerson) => {
  const request = axios.post(baseUrl, newPerson);
  return request.then((response) => response.data);
};

const remove = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`);
  return request.then((response) => response.data);
};

const update = (changedPerson) => {
  const request = axios.put(`${baseUrl}/${changedPerson.id}`, changedPerson);
  return request.then((response) => response.data);
};

const personServices = { getAll, create, remove, update };

export default personServices;
