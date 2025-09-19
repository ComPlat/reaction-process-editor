import React, { useContext } from 'react';

import { Label } from 'reactstrap';

import ActivityForm from "../ActivityForm";
import AddSampleForm from "./AddSampleForm";
import AnalysisForm from "./AnalysisForm";
import PurificationForm from "./PurificationForm";
import RemoveForm from "./RemoveForm";
import SaveSampleForm from "./SaveSampleForm";
import TransferForm from "./TransferForm";
import DefineFractionForm from './DefineFractionForm';
import DiscardForm from './DiscardForm';

import ButtonGroupToggle from '../formgroups/ButtonGroupToggle';
import FractionFormGroup from '../formgroups/FractionFormGroup';
import OntologySelectFormGroup from '../formgroups/OntologySelectFormGroup';

import OptionsDecorator from '../../../../decorators/OptionsDecorator';
import OntologiesDecorator from '../../../../decorators/OntologiesDecorator';

import { SelectOptions } from '../../../../contexts/SelectOptions';

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

  let ontologies = useContext(SelectOptions).ontologies

  const customActivityForm = () => {
    switch (actionTypeName) {
      case "ADD":
        return (
          <AddSampleForm
            workup={workup}
            preconditions={preconditions}
            onWorkupChange={onWorkupChange}
          />
        )
      case "SAVE":
        return (
          <SaveSampleForm
            workup={workup}
            onWorkupChange={onWorkupChange}
            reactionProcessVessel={activity.reaction_process_vessel}
            onChangeVessel={onChangeVessel}
          />
        )
      case "TRANSFER":
        return (
          <TransferForm
            workup={workup}
            onWorkupChange={onWorkupChange}
            isPersisted={!!activity.id}
          />
        )
      case "REMOVE":
        return (
          <RemoveForm
            workup={workup}
            preconditions={preconditions}
            onWorkupChange={onWorkupChange}
          />
        )
      case "PURIFICATION":
        return (
          <>
            <PurificationForm
              workup={workup}
              onWorkupChange={onWorkupChange}
              preconditions={preconditions}
              reactionProcessVessel={activity.reaction_process_vessel}
              onChangeVessel={onChangeVessel}
            />
          </>
        )
      case "ANALYSIS":
        return (
          <>
            <AnalysisForm
              workup={workup}
              onWorkupChange={onWorkupChange}
            />
          </>
        )
      case "DISCARD":
        return (
          <DiscardForm
            workup={workup}
            onChangeVessel={onChangeVessel}
            reactionProcessVessel={activity.reaction_process_vessel}
          />
        )
      case "DEFINE_FRACTION":
        return (
          <DefineFractionForm
            workup={workup}
            onChangeVessel={onChangeVessel}
            reactionProcessVessel={activity.reaction_process_vessel}
          />
        )
      case "WAIT":
        return (<></>)
      default:
        return (<div>Error in ActivityForm: Unknown action type '{actionTypeName}'</div>)
    }
  }

  const handleChangeAutomation = (newAutomationMode) => {
    onWorkupChange({ name: 'automation_mode', value: newAutomationMode })
  }

  const handleChangeDevice = (device) => {
    onWorkupChange({ name: 'device', value: device?.value })
  }

  const handleChangeMethod = (method) => {
    onWorkupChange({ name: 'method', value: method?.value })
  }

  const filteredOntologiesForRole = (roleName) => OntologiesDecorator.activeOptionsMeetingDependencies({ roleName: roleName, options: ontologies, workup: workup })


  const currentDeviceOption = OptionsDecorator.inclusiveOptionForValue(workup.device, ontologies)

  const filterMethodsByDetectors = (detectors, methods) => {
    if (!methods) { return [] }
    return (detectors?.length > 0) ?
      methods.filter((method) => detectors.every(detector => method.detectors?.map(item => item.value)?.includes(detector)))
      :
      methods
  }

  const filteredMethodOptions = filterMethodsByDetectors(workup.detector, currentDeviceOption?.methods)


  const renderDeviceOntologiesForm = () => {
    return (
      <>
        <Label>Mode</Label>
        <ButtonGroupToggle
          value={workup.automation_mode}
          options={filteredOntologiesForRole('automation_mode')}
          onChange={handleChangeAutomation} />

        <OntologySelectFormGroup
          key={"device" + workup.device}
          roleName={'device'}
          workup={workup}
          onChange={handleChangeDevice}
        />
        <OntologySelectFormGroup
          key={"method" + workup.method}
          roleName={'method'}
          workup={workup}
          options={filteredMethodOptions}
          onChange={handleChangeMethod}
        />
      </>
    )
  }

  return (
    <ActivityForm
      type='action'
      activity={activity}
      onCancel={onCancel}
      onSave={onSave}
      onWorkupChange={onWorkupChange}
      onChangeDuration={onChangeDuration}>
      <FractionFormGroup fraction={activity.consumed_fraction} />
      {renderDeviceOntologiesForm()}
      {customActivityForm()}
    </ActivityForm>
  );
};

export default ActionForm;
