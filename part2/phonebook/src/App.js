import { useState, useEffect } from "react";
import personServices from "./services/persons";
import Book from "./components/Book";
import Filter from "./components/Filter";
import Form from "./components/Form";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    personServices.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const handleNameInputChange = (e) => {
    setNewName(e.target.value);
  };

  const handleNumberInputChange = (e) => {
    setNewNumber(e.target.value);
  };

  const handleFilterInputChange = (e) => {
    setFilter(e.target.value);
  };

  const addPerson = (e) => {
    e.preventDefault();
    if (!persons.find((e) => e.name === newName)) {
      personServices
        .create({ name: newName, number: newNumber })
        .then((newPerson) => {
          setPersons(persons.concat(newPerson));
          setNewName("");
          setNewNumber("");
        });
    } else {
      alert(`${newName} is already added to phonebook`);
    }
  };

  const deletePerson = (id) => {
    console.log(id);
    personServices
      .remove(id)
      .then(() => setPersons(persons.filter((person) => person.id !== id)))
      .catch((error) => {
        alert(`unable to remove `);
        setPersons(persons.filter((person) => person.id !== id));
      });
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
    addPerson,
  };

  const bookProps = {
    persons,
    filter,
    deletePerson,
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
