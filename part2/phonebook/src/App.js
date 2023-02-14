import { useState } from "react";
import Book from "./components/Book";
import Filter from "./components/Filter";
import Form from "./components/Form";

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-1234567" },
  ]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");

  const handleNameInputChange = (e) => {
    setNewName(e.target.value);
  };

  const handleNumberInputChange = (e) => {
    setNewNumber(e.target.value);
  };

  const handleFilterInputChange = (e) => {
    setFilter(e.target.value);
  };

  const addName = (e) => {
    e.preventDefault();
    if (!persons.find((e) => e.name === newName)) {
      setPersons(persons.concat({ name: newName, number: newNumber }));
      setNewName("");
      setNewNumber("");
    } else {
      alert(`${newName} is already added to phonebook`);
    }
  };

  const filterProps = {
    filter,
    handleFilterInputChange,
  };

  const formProps = {
    newName,
    newNumber,
    handleNameInputChange,
    handleNumberInputChange,
    addName,
  };

  const bookProps = {
    persons,
    filter,
  };

  return (
    <div>
      <Filter {...filterProps} />
      <Form {...formProps} />
      <Book {...bookProps} />
    </div>
  );
};

export default App;
