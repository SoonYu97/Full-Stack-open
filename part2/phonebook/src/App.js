import { useState } from "react";

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
  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        <span>filter shown with </span>
        <input value={filter} onChange={handleFilterInputChange} />
      </div>
      <h2>add a new</h2>
      <form>
        <div>
          name: <input value={newName} onChange={handleNameInputChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberInputChange} />
        </div>
        <div>
          <button type="submit" onClick={addName}>
            add
          </button>
        </div>
      </form>
      <h2>Numbers</h2>
      <table>
        {persons
          .filter((person) => person.name.includes(filter)).length === 0 ?
          "Nothing to show"
          :
          persons
          .filter((person) => person.name.includes(filter)).map(({ name, number }) => (
            <tr key={name}>
              <td>{name}</td>
              <td>{number}</td>
            </tr>
          ))}
      </table>
    </div>
  );
};

export default App;
