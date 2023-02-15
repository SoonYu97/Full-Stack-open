import SuccessNotification from "./SuccessNotification";
import ErrorNotification from "./ErrorNotification";

const Filter = ({
  filter,
  handleFilterInputChange,
  successMessage,
  errorMessage,
}) => {
  return (
    <>
      <h2>Phonebook</h2>
      {successMessage.length > 0 && (
        <SuccessNotification message={successMessage} />
      )}
      {errorMessage.length > 0 && <ErrorNotification message={errorMessage} />}
      <div>
        <span>filter shown with </span>
        <input value={filter} onChange={handleFilterInputChange} />
      </div>
    </>
  );
};

export default Filter;
