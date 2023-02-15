import Notification from "./Notification";
const Filter = ({ filter, handleFilterInputChange, successMessage }) => {
  return (
    <>
      <h2>Phonebook</h2>
      {successMessage.length > 0 && <Notification message={successMessage} />}
      <div>
        <span>filter shown with </span>
        <input value={filter} onChange={handleFilterInputChange} />
      </div>
    </>
  );
};

export default Filter;
