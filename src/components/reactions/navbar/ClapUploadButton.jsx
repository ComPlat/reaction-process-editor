import React, { useContext, useState } from 'react';

import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'reactstrap';

import NotificationContext from '../../../contexts/NotificationContext';
import { useReactionsFetcher } from '../../../fetchers/ReactionsFetcher';

const ClapUploadButton = ({ reactionProcessId }) => {
  const api = useReactionsFetcher();
  const { addNotification } = useContext(NotificationContext);
  const [isUploading, setIsUploading] = useState(false);

  const uploadClap = async () => {
    setIsUploading(true);

    try {
      const response = await api.uploadClap(reactionProcessId);
      if (response?.uploaded) {
        addNotification({
          title: 'Send to Lab',
          message: JSON.stringify(response),
          type: 'success',
        });
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Button
      aria-label="Send to Lab"
      className="icon-button icon-button--positive"
      color="transparent"
      disabled={isUploading}
      onClick={uploadClap}
      size="lg"
      title="Send the reaction to the configured laboratory endpoint."
    >
      <FontAwesomeIcon icon={faUpload} />
    </Button>
  );
};

export default ClapUploadButton;
