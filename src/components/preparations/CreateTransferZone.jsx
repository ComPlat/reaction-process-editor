import React, { useState } from 'react';
import { Button } from "reactstrap";

import ActivityCard from '../activities/ActivityCard';

import { SubFormController, SubFormToggle } from '../../contexts/SubFormController';

import { useReactionsFetcher } from "../../fetchers/ReactionsFetcher";

const CreateTransferZone = ({ sample }) => {
  const api = useReactionsFetcher();
  const [showCreator, setShowCreator] = useState(false)

  const toggleShowCreator = () => {
    setShowCreator(!showCreator)
  }

  const zoneStateClassName = () => {
    let stateAppendix = showCreator ? 'creator' : 'default'
    return 'insert-zone--' + stateAppendix
  }

  console.log("CreateTransferZone")
  console.log(sample)
  const initialTransferActivity = {
    activity_name: 'TRANSFER', workup: { sample_id: sample?.id }
  }

  const handleSave = (activity) => {
    let processStepId = activity.workup.target_step_id
    api.createActivity(processStepId, activity);

    setShowCreator(false)
  }

  const handleCancel = () => {
    setShowCreator(false)
  }

  return (
    <SubFormController.Provider value={SubFormToggle()}>
      <div className={'insert-zone ' + zoneStateClassName()}>
        {showCreator ?
          <ActivityCard
            key={"sample-transfer-zone"}
            activity={initialTransferActivity}
            forceShowForm
            type={'preparation'}
            onSave={handleSave}
            onCancel={handleCancel}
            processStep={{}}
          /> :
          <>
            <Button
              color='transparent'
              className='insert-zone__visible-creator-button'
              onClick={toggleShowCreator}
            >
              + Transfer
            </Button>
          </>
        }
      </div>
    </SubFormController.Provider>
  );
};

export default CreateTransferZone;
