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

  const ontologiesByRoleName = (roleName) => OntologiesDecorator.activeOptionsForRoleName({ roleName: roleName, options: ontologies })

  const currentDeviceOption = OptionsDecorator.inclusiveOptionForValue(workup.device, ontologies)

  const renderDeviceOntologiesForm = () => {
    const deviceFormIncluded = actionTypeName === 'ANALYSIS' || (actionTypeName === 'PURIFICATION' && workup['purification_type'] === 'CHROMATOGRAPHY')

    return deviceFormIncluded ? <></> :
      <>
        <Label>Mode</Label>
        <ButtonGroupToggle
          value={workup.automation_mode}
          options={ontologiesByRoleName('automation_mode')}
          onChange={handleChangeAutomation} />

        <OntologySelectFormGroup
          key={"device" + workup.device}
          roleName={'device'}
          workup={workup}
          options={ontologiesByRoleName('device')}
          onChange={handleChangeDevice}
        />
        <OntologySelectFormGroup
          key={"method" + workup.method}
          roleName={'method'}
          workup={workup}
          options={currentDeviceOption?.methods}
          onChange={handleChangeMethod}
        />
      </>
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
