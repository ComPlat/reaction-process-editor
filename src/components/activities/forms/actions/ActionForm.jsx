import React, { useEffect } from 'react';

import FiltrationForm from './purification/FiltrationForm';
import ExtractionForm from './purification/ExtractionForm';
import CrystallizationForm from './purification/CrystallizationForm';
import ChromatographyForm from './purification/ChromatographyForm';
import CentrifugationForm from './purification/CentrifugationForm';

import AnalysisChromatographyForm from './analysis/AnalysisChromatographyForm';
import AnalysisSpectroscopyForm from './analysis/AnalysisSpectroscopyForm';

import ActivityForm from "../ActivityForm";
import AddSampleForm from "./AddSampleForm";

import SaveSampleForm from "./SaveSampleForm";
import TransferForm from "./TransferForm";
import DefineFractionForm from './DefineFractionForm';
import DiscardForm from './DiscardForm';
import EvaporationForm from './EvaporationForm';
import MixingForm from './MixingForm';
import GasExchangeForm from './GasExchangeForm';
import WaitForm from './WaitForm';


import FractionFormGroup from '../formgroups/FractionFormGroup';

import FormSection from '../../../utilities/FormSection';

import DeviceMethodFormSet from '../formsets/DeviceMethodFormSet';

import { ontologyId } from '../../../../constants/ontologyId';

const ActionForm = (
  {
    activity,
    preconditions,
    onCancel,
    onSave,
    onWorkupChange,
    onChangeDuration,
    onChangeVessel
  }) => {

  const actionTypeName = activity.activity_name
  const workup = activity.workup

  useEffect(() => {
    let ontologyValue = ontologyId.class[activity.activity_name]

    onWorkupChange({ name: 'class', value: ontologyValue })
    // eslint-disable-next-line
  }, [activity.activity_name])

  const customActivityFormSection = {
    'ADD': AddSampleForm,
    'SAVE': SaveSampleForm,
    'TRANSFER': TransferForm,
    'EVAPORATION': EvaporationForm,
    'MIXING': MixingForm,
    'GAS_EXCHANGE': GasExchangeForm,
    'ANALYSIS_CHROMATOGRAPHY': AnalysisChromatographyForm,
    'ANALYSIS_SPECTROSCOPY': AnalysisSpectroscopyForm,
    'CHROMATOGRAPHY': ChromatographyForm,
    'CENTRIFUGATION': CentrifugationForm,
    'CRYSTALLIZATION': CrystallizationForm,
    'EXTRACTION': ExtractionForm,
    'FILTRATION': FiltrationForm,
    'DEFINE_FRACTION': DefineFractionForm,
    'WAIT': WaitForm,
    'DISCARD': DiscardForm
  }


  const renderCustomActivityForm = () => {

    let CustomActivityForm = customActivityFormSection[activity.activity_name]

    return CustomActivityForm ?
      <CustomActivityForm
        workup={workup}
        onWorkupChange={onWorkupChange}
        preconditions={preconditions}
        reactionProcessVessel={activity.reaction_process_vessel}
        onChangeVessel={onChangeVessel}
        isPersisted={!!activity.id}
      /> :
      <>Activity of type {activity.activity_name} has no Form</>
  }
  const renderDeviceOntologiesForm = () => {
    const deviceFormIncluded = ['ANALYSIS', 'ANALYSIS_CHROMATOGRAPHY', 'ANALYSIS_SPECTROSCOPY', 'CHROMATOGRAPHY'].includes(actionTypeName)

    return deviceFormIncluded ? <></> :
      <FormSection type="action">
        <DeviceMethodFormSet
          activity={activity}
          onWorkupChange={onWorkupChange} />
      </FormSection>
  }

  return (
    <ActivityForm
      type='action'
      activity={activity}
      onCancel={onCancel}
      onSave={onSave}
      onWorkupChange={onWorkupChange}
      onChangeDuration={onChangeDuration} >
      <FractionFormGroup fraction={activity.consumed_fraction} />
      {renderDeviceOntologiesForm()}
      {renderCustomActivityForm()}
    </ActivityForm >
  );
};


export default ActionForm;
