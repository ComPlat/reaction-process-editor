import React, { useContext, useState, useEffect } from "react";
import {
  Offcanvas,
  OffcanvasBody,
  Toast,
  ToastBody,
  ToastHeader,
} from "reactstrap";
import NotificationContext from "../../contexts/NotificationContext";

import { defaultlMessageCloseTime } from "../../constants";

const GlobalNotification = () => {
  const { notifications } = useContext(NotificationContext);
  const [latestNotification, setLatestNotification] = useState({});
  const [showNotification, setShowNotification] = useState(false);
  const [notificationTimeout, setNotificationTimeout] = useState(null);
  const colorTypes = {
    info: "action",
    warning: "warning",
    error: "danger",
    success: "success",
  };

  const changeShowNotification = (show) => {
    if (notificationTimeout) {
      clearTimeout(notificationTimeout);
      setNotificationTimeout(null);
    }
    setShowNotification(show);
  };

  const toastClass = (notificationType) => {
    return (
      "toast--" + (notificationType ? colorTypes[notificationType] : "action")
    );
  };

  useEffect(() => {
    const notification = notifications.at(-1);
    if (notification) {
      setLatestNotification(notification);
      changeShowNotification(true);
      setNotificationTimeout(
        setTimeout(() => { changeShowNotification(false); },
          notification.messageCloseTime || defaultlMessageCloseTime[notification.type]
        )
      );
    }
    // eslint-disable-next-line
  }, [notifications]);

  return (
    <Offcanvas
      isOpen={showNotification}
      direction="end"
      className="global-notification"
      autoFocus={false}
      backdrop={false}
    >
      <OffcanvasBody className="d-flex flex-row-reverse align-items-start">
        {latestNotification && (
          <Toast className={toastClass(latestNotification.type)}>
            {latestNotification.title && (
              <ToastHeader
                toggle={() => changeShowNotification(false)}
                tag="h5"
              >
                {latestNotification.title}
              </ToastHeader>
            )}
            {(latestNotification.message || latestNotification.details) && (
              <ToastBody>
                {latestNotification.message && latestNotification.message}
                {latestNotification.details && (
                  <ul>
                    {latestNotification.details.map((detail, index) => (
                      <li key={index}>{detail}</li>
                    ))}
                  </ul>
                )}
              </ToastBody>
            )}
          </Toast>
        )}
      </OffcanvasBody>
    </Offcanvas>
  );
};

export default GlobalNotification;
