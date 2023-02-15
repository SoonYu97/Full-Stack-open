const SuccessNotification = ({ message }) => {
  if (message === null) {
    return null;
  }

  return <div className="success notification">{message}</div>;
};

export default SuccessNotification;
