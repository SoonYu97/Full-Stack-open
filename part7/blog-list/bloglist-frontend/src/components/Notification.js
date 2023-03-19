import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector(state => state.notification)

  const { body, type } = notification

  return (
    <>
      {notification !== '' &&
        <div className={`notification ${type}`}>
          {body}
        </div>
      }
    </>
  )
}

export default Notification
