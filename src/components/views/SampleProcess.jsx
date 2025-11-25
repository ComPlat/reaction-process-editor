import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';

import {
  SubFormController,
  SubFormToggle,
} from "../../contexts/SubFormController";

import SampleNavbar from '../reactions/navbar/SampleNavbar';
import CreateTransferZone from '../preparations/CreateTransferZone';
import ProcessSampleSetupCard from '../preparations/ProcessSampleSetupCard';
import VesselPreparationColumnCard from '../preparations/VesselPreparationColumnCard';

import ActivityCard from '../activities/ActivityCard';

import SpinnerWithMessage from "../utilities/SpinnerWithMessage";
import StepsContainer from '../steps/StepsContainer';

import { useReactionsFetcher } from '../../fetchers/ReactionsFetcher';
import { useVesselsFetcher } from '../../fetchers/VesselsFetcher';

import { SelectOptions } from '../../contexts/SelectOptions';
import { VesselOptions } from '../../contexts/VesselOptions';

const SampleProcess = () => {
  const api = useReactionsFetcher();
  const vesselApi = useVesselsFetcher();

  const { reactionId, sampleId } = useParams()
  const location = useLocation();
  const auth_token = new URLSearchParams(useLocation().search).get('auth');
  const username = new URLSearchParams(useLocation().search).get('username');

  const [reactionProcess, setReactionProcess] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [vessels, setVessels] = useState([])

  useEffect(() => {
    vesselApi.index().then((data) => {
      setVessels(data?.vesselables || [])
    })

    const reloadDone = () => {
      setIsLoading(false)
    }
    const indicateSave = () => {
      setIsLoading(true)
    }
    const requireReload = () => {
      fetchReactionProcess()
      setIsLoading(true)
    }

    window.addEventListener('indicateSave', indicateSave);
    window.addEventListener('requireReload', requireReload);
    window.addEventListener('reloadDone', reloadDone);

    return () => {
      window.removeEventListener('indicateSave', indicateSave);
      window.removeEventListener('requireReload', requireReload);
      window.removeEventListener('reloadDone', reloadDone);
    };
    // eslint-disable-next-line
  }, [location]);

  useEffect(() => {
    if (auth_token) {
      localStorage.setItem('bearer_auth_token', auth_token);
    }
    if (username) {
      localStorage.setItem('username', username)
    }
    setReactionProcess(null);
    fetchReactionProcess()
    // eslint-disable-next-line
  }, [location, auth_token, username])

  const fetchReactionProcess = () => {
    if (reactionId) {
      api.getReactionProcess(reactionId).then((data) => {
        data ? setReactionProcess(data['reaction_process']) : setReactionProcess(null)
        window.dispatchEvent(new Event("reloadDone"))
      })
    } else if (sampleId) {
      api.getSampleProcess(sampleId).then((data) => {
        data ? setReactionProcess(data['reaction_process']) : setReactionProcess(null)
        window.dispatchEvent(new Event("reloadDone"))
      })
    }
  }

  const renderReactionNavbar = () => {
    return (
      <>
        {isLoading ?
          <SpinnerWithMessage message={'Storing process data'} isOpen={true} />
          :
          <SampleNavbar reactionProcess={reactionProcess} />
        }
      </>
    )
  }

  const onSave = (actionForm) => {
    api.updateActivity(actionForm)
  }

  const renderTransfers = () => {
    return reactionProcess.initial_sample_transfers.map((activity) => {
      return (<ActivityCard
        key={'initial-sample-transfer-' + activity.id}
        activity={activity}
        type={"preparation"}
        onSave={onSave}
        preconditions={activity.preconditions}
        hideMoveButton
      />)
    })
  }

  return (
    <SubFormController.Provider value={SubFormToggle()}>
      <VesselOptions.Provider value={vessels}>
        {reactionProcess ?
          <SelectOptions.Provider value={reactionProcess.select_options}>
            {renderReactionNavbar()}
            <div className="scroll-body overflow-auto flex-grow-1">
              <div className='px-5 py-6 d-inline-block'>
                <div className='d-inline-flex flex-nowrap align-items-start gap-5'>
                  <div className='d-flex gap-5 flex-column'>
                    <ProcessSampleSetupCard reactionProcess={reactionProcess} key={"react-is-so-freaking-marvelously-great-it-needs-an-extra-key-with-the-id-value-to-notice-that-the-reaction_process_vessel-has-changed" + reactionProcess.reaction_process_vessel?.id} />
                    {renderTransfers()}
                    <CreateTransferZone reactionProcess={reactionProcess} />
                    <VesselPreparationColumnCard reactionProcess={reactionProcess} />
                  </div>
                  <StepsContainer reactionProcess={reactionProcess} />
                </div>
              </div>
            </div>
          </SelectOptions.Provider>
          :
          <SpinnerWithMessage message={'Fetching reaction process data'} isOpen={true} />
        }
      </VesselOptions.Provider >
    </SubFormController.Provider>
  );
}

export default SampleProcess;
