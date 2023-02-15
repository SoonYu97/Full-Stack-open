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
    if (!persons.find((person) => person.name === newName)) {
      personServices
        .create({ name: newName, number: newNumber })
        .then((newPerson) => {
          setPersons(persons.concat(newPerson));
          setNewName("");
          setNewNumber("");
        });
    } else {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        const changedPerson = persons.find((person) => person.name === newName);
        personServices
          .update({ ...changedPerson, number: newNumber })
          .then((newPerson) => {
            console.log(newPerson);
            setPersons(
              persons.map((person) =>
                person.name === newName ? newPerson : person
              )
            );
            setNewName("");
            setNewNumber("");
          });
      }
    }
  };

  const deletePerson = (id) => {
    const person = persons.find((person) => person.id === id);
    if (window.confirm(`Delete ${person.name}?`)) {
      personServices
        .remove(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));
        })
        .catch(() => {
          alert(`Unable to remove ${person.name}`);
          setPersons(persons.filter((person) => person.id !== id));
        });
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
