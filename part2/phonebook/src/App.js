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
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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

  const setSuccMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage("");
    }, 1000);
  };

  const setErrMessage = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage("");
    }, 1000);
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
          setSuccMessage(`Added ${newPerson.name} successfully`);
        })
        .catch((error) => {
          setErrMessage(error.response.data.error);
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
            setSuccMessage(`Updated ${newPerson.name}'s number successfully`);
          })
          .catch(() => {
            setErrMessage(
              `Information of ${changedPerson.name} has already been removed from server`
            );
            setPersons(persons.filter((person) => person.name !== newName));
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
          setSuccMessage(`Remove ${person.name} succesfully`);
        })
        .catch(() => {
          setErrMessage(
            `Information of ${person.name} has already been removed from server`
          );
          setPersons(persons.filter((person) => person.id !== id));
        });
    }
  };

  const filterProps = {
    filter,
    successMessage,
    errorMessage,
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
