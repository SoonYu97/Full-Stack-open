const Filter = ({ filter, handleFilterInputChange }) => {
  return (
    <>
      <h2>Phonebook</h2>
      <div>
        <span>filter shown with </span>
        <input value={filter} onChange={handleFilterInputChange} />
      </div>
    </>
  );
};

export default Filter;
