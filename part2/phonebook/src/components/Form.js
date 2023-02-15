const Form = ({
  newName,
  newNumber,
  handleNameInputChange,
  handleNumberInputChange,
  addPerson,
}) => {
  return (
    <>
      <h2>add a new</h2>
      <form>
        <div>
          name: <input value={newName} onChange={handleNameInputChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberInputChange} />
        </div>
        <div>
          <button type="submit" onClick={addPerson}>
            add
          </button>
        </div>
      </form>
    </>
  );
};

export default Form;
