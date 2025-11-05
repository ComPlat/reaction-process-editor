import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';

import ReactionNavbar from '../reactions/navbar/ReactionNavbar';
import PreparationColumnCard from '../preparations/SamplePreparationColumnCard';
import VesselPreparationColumnCard from '../preparations/VesselPreparationColumnCard';

import SpinnerWithMessage from "../utilities/SpinnerWithMessage";
import StepsContainer from '../steps/StepsContainer';

import { useReactionsFetcher } from '../../fetchers/ReactionsFetcher';
import { useVesselsFetcher } from '../../fetchers/VesselsFetcher';
import { SelectOptions } from '../../contexts/SelectOptions';
import { VesselOptions } from '../../contexts/VesselOptions';

const ReactionProcess = () => {
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
    // React's state model requires `fetchReactionProcess` in the dependencies array to assert state consistency.
    // When done however it will be called every time when dependencies are checked (i.e. after refetch),
    // triggering another refetch (endless loop).
    // Wrapping fetchReactionProcess in a useCallback as recommended by the React guidelines
    // does not work either as it depends on the api = useReactionsFetcher(),
    // which then again can not be used in hooks as useReactionsFetcher() is a hook itself.
    //
    // We ignore the warnings which is recommended only if you know exactly what you are doing which I do not. cbuggle.
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
          <ReactionNavbar reactionProcess={reactionProcess} />
        }
      </>
    )
  }

  return (
    <VesselOptions.Provider value={vessels}>
      {reactionProcess ?
        <SelectOptions.Provider value={reactionProcess.select_options}>
          {renderReactionNavbar()}
          <div className="scroll-body overflow-auto flex-grow-1">
            <div className='px-5 py-6 d-inline-block'>
              <div className='d-inline-flex flex-nowrap align-items-start gap-5'>
                <div className='d-flex gap-5 flex-column'>
                  <PreparationColumnCard reactionProcess={reactionProcess} />
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
    </VesselOptions.Provider>
  );
}

export default ReactionProcess;
