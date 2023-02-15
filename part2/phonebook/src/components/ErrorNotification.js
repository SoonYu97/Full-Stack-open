const ErrorNotification = ({ message }) => {
  if (message === null) {
    return null;
  }

  return <div className="error notification">{message}</div>;
};

export default ErrorNotification;
