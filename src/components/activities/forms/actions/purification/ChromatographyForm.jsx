import React, { useContext } from 'react'
import { FormGroup, Input } from 'reactstrap';

import ChromatographyStepForm from "./ChromatographyStepForm";

import DetectorConditionsFormGroup from '../../formgroups/DetectorConditionsFormGroup';
import MetricsInputFormGroup from '../../formgroups/MetricsInputFormGroup';
import OntologySelectFormGroup from '../../formgroups/OntologySelectFormGroup';
import OntologyMultiSelectFormGroup from '../../formgroups/OntologyMultiSelectFormGroup.jsx';
import SingleLineFormGroup from '../../formgroups/SingleLineFormGroup';

import CreateButton from "../../../../utilities/CreateButton";
import FormSection from '../../../../utilities/FormSection'

import OntologiesDecorator from '../../../../../decorators/OntologiesDecorator';
import OptionsDecorator from '../../../../../decorators/OptionsDecorator';

import withActivitySteps from '../../../../utilities/WithActivitySteps';

import { OntologyConstants } from '../../../../../constants/OntologyConstants';

import { SelectOptions } from '../../../../../contexts/SelectOptions';

const ChromatographyForm = (
  {
    activity,
    workup,
    onWorkupChange,
    activitySteps,
    showNewStepForm,
    addStep,
    onSaveStep,
    onCancelStep,
    onDeleteStep
  }) => {


  const isAutomated = OntologyConstants.isAutomated(workup.automation_mode)
  const ontologies = useContext(SelectOptions).ontologies

  const currentDeviceOption = OptionsDecorator.inclusiveOptionForValue(workup.device, ontologies)
  const currentMethodOption = OptionsDecorator.inclusiveOptionForValue(workup.method, currentDeviceOption?.methods)
  const currentStationaryPhaseOption = OptionsDecorator.inclusiveOptionForValue(workup.stationary_phase, currentMethodOption?.stationary_phase)

  const filteredOntologiesByRoleName = (roleName) => OntologiesDecorator.activeOptionsForWorkupDependencies({ roleName: roleName, ontologies: ontologies, workup: workup })

  const filterMethodsByDetectors = (detectors, methods) => {
    if (!methods) { return [] }
    return (detectors?.length > 0) ?
      methods.filter((method) => detectors.every(detector => method.detectors?.map(item => item.value)?.includes(detector)))
      :
      methods
  }
  const currentDetectorsOptions = OptionsDecorator.optionsForValues(workup.detector, currentDeviceOption?.detectors)
  const filteredMethodOptions = filterMethodsByDetectors(workup.detector, currentDeviceOption?.methods)

  const hasStationaryPhaseAnalysisType = (analysisType) => !!currentStationaryPhaseOption?.analysis_defaults?.[analysisType]

  const handleWorkupChange = (workupKey) => (value) => onWorkupChange({ name: workupKey, value: value })

  const handleSelectChange = (workupKey) => (selected) => onWorkupChange({ name: workupKey, value: selected.value })

  const handleMultiSelectChange = (workupKey) => (selected) => {
    onWorkupChange({ name: workupKey, value: selected?.map(item => item.value) })
  }

  const handleChangeType = (newType) => {
    if (newType?.value !== workup.type) {
      onWorkupChange({ name: 'type', value: newType?.value })
      handleChangeSubType({ value: undefined })
    }
  }

  const handleChangeSubType = (newSubType) => {
    if (newSubType?.value !== workup.subtype) {
      onWorkupChange({ name: 'subtype', value: newSubType?.value })
      handleChangeDevice({ value: undefined })
    }
  }


  const handleChangeDevice = (device) => {
    onWorkupChange({ name: 'device', value: device?.value })
    if (device?.value !== workup.device) { handleChangeMethod(undefined) }
  }

  const handleChangeMethod = (method) => {
    onWorkupChange({ name: 'method', value: method?.value })
    onWorkupChange({ name: 'inject_volume', value: method?.default_inject_volume })
    onWorkupChange({ name: 'mobile_phase', value: method?.mobile_phase?.map(phase => phase.value) })
    onWorkupChange({ name: 'purification_steps', value: method?.steps })
    onWorkupChange({ name: 'detector', value: method?.detectors?.map(el => el.value) })

    handleChangeStationaryPhase(method?.stationary_phase?.[0])
    isAutomated && setMethodAnalysisDefaults(method)
  }

  const handleChangeStationaryPhase = (phase) => {
    onWorkupChange({ name: 'stationary_phase', value: phase?.value })
    isAutomated && setStationaryPhaseDefaults(phase)
  }

  const handleChangeDetectors = (detectors) => {
    onWorkupChange({ name: 'detector', value: detectors?.map(detector => detector.value) })
    isAutomated && setMethodAnalysisDefaults(currentMethodOption)
  }

  const setMethodAnalysisDefaults = (method) => {
    let newConditions = {}

    method?.detectors &&
      method.detectors
        .filter(detector => !!detector.analysis_defaults)
        .forEach((detector) => {
          newConditions[detector.value] = {}
          detector.analysis_defaults.forEach(defaults => {
            newConditions[detector.value][defaults.metric_name] = defaults.values
          })
        })
    onWorkupChange({ name: 'detector_conditions', value: newConditions })
  }

  const setStationaryPhaseDefaults = (phase) => {
    onWorkupChange({ name: 'STATIONARY_PHASE_TEMPERATURE', value: phase?.analysis_defaults?.['TEMPERATURE'] })
  }

  const mobilePhasePlaceHolder = isAutomated ? "Depends on Method" : workup.device ? "Please Select" : "Depends on Device"

  const renderAutomationSpecificFields = () => {
    switch (workup.automation_mode) {
      case OntologyConstants.isAutomated(workup.automation_mode):
      case OntologyConstants.isSemiAutomated(workup.automation_mode):
        return (
          <>
            <OntologySelectFormGroup
              key={"device" + workup.device}
              roleName={'device'}
              workup={workup}
              onChange={handleChangeDevice}
            />
            <OntologyMultiSelectFormGroup
              key={"detector" + workup.detector}
              label={'Detectors'}
              roleName={'detector'}
              workup={workup}
              onChange={handleChangeDetectors}
            />
            <OntologyMultiSelectFormGroup
              key={"mobile_phase" + workup.mobile_phase}
              roleName={'mobile_phase'}
              workup={workup}
              onChange={handleMultiSelectChange('mobile_phase')}
              options={currentMethodOption?.mobile_phase || currentDeviceOption?.mobile_phase}
              placeholder={mobilePhasePlaceHolder}
              disabled={isAutomated || !workup.device}
            />

            {isAutomated &&
              <>
                <OntologySelectFormGroup
                  key={"method" + workup.method}
                  roleName={'method'}
                  workup={workup}
                  options={filteredMethodOptions}
                  onChange={handleChangeMethod}
                />
                <FormGroup>
                  {currentMethodOption?.description}
                </FormGroup>
              </>}
            {isAutomated ||
              <OntologySelectFormGroup
                key={"stationary_phase" + workup.stationary_phase}
                roleName={'stationary_phase'}
                options={currentDeviceOption?.stationary_phase}
                workup={workup}
                onChange={handleChangeStationaryPhase}
              />
            }
            <>{(isAutomated ? "Stationary Phase " : '') + (workup.stationary_phase || "-")}</>

            {hasStationaryPhaseAnalysisType("TEMPERATURE") &&
              <MetricsInputFormGroup
                label={'Stat. Phases Temp'}
                metricName={"TEMPERATURE"}
                amount={workup.STATIONARY_PHASE_TEMPERATURE}
                onChange={handleWorkupChange('STATIONARY_PHASE_TEMPERATURE')}
                disabled={isAutomated}
              />
            }
            <MetricsInputFormGroup
              label={'Inj. Volume'}
              metricName={"INJECT_VOLUME"}
              amount={workup.inject_volume}
              onChange={handleWorkupChange('inject_volume')}
            />
          </>)
      case OntologyConstants.isManual(workup.automation_mode):
        return (
          <>
            <OntologySelectFormGroup
              key={"material" + workup.material}
              roleName={'material'}
              workup={workup}
              onChange={handleSelectChange('material')}
            />

            {filteredOntologiesByRoleName('stationary_phase')?.length > 0 ?
              <OntologySelectFormGroup
                key={"stationary_phase" + workup.stationary_phase}
                roleName={'stationary_phase'}
                workup={workup}
                onChange={handleChangeStationaryPhase}
              /> :
              <SingleLineFormGroup
                label={'Stationary Phase'}
              >
                <Input
                  type="textarea"
                  name="stationary_phase"
                  value={workup.stationary_phase}
                  onChange={(event) => onWorkupChange({ name: 'stationary_phase', value: event.target.value })}
                />
              </SingleLineFormGroup>
            }
            <MetricsInputFormGroup
              metricName={'LENGTH'}
              label={'Diameter'}
              amount={workup.jar_diameter}
              onChange={handleWorkupChange('jar_diameter')}
            />
            <MetricsInputFormGroup
              metricName={'LENGTH'}
              label={'Height'}
              amount={workup.jar_height}
              onChange={handleWorkupChange('jar_height')}
            />
            <MetricsInputFormGroup
              metricName={'LENGTH'}
              label={'Filling Height'}
              amount={workup.jar_filling_height}
              max={workup.jar_height?.value}
              onChange={handleWorkupChange('jar_filling_height')}
            />
          </ >)
      default:
        break;
    }
  }

  const renderDetectorFormSection = () => {
    return (
      <>
        <DetectorConditionsFormGroup
          detectorsOptions={currentDetectorsOptions}
          conditions={workup.detector_conditions}
          onChange={handleWorkupChange('detector_conditions')}
          disabled={isAutomated}
        />
      </>
    )
  }

  return (
    <>
      <FormSection type='action'>
        <OntologySelectFormGroup
          key={"type" + workup.type}
          roleName={'type'}
          workup={workup}
          onChange={handleChangeType}
        />
        <OntologySelectFormGroup
          key={"subtype" + workup.subtype + "type" + workup.type}
          roleName={'subtype'}
          workup={workup}
          onChange={handleChangeSubType}
        />
        {renderAutomationSpecificFields()}
      </FormSection>
      {renderDetectorFormSection()}

      {activitySteps.map((step, idx) =>
        <ChromatographyStepForm
          key={'chromatography-step-' + idx + '-' + activitySteps.length}
          label={'Chromatography Step ' + (idx + 1)}
          workup={step}
          solventOptions={filteredOntologiesByRoleName('solvent')}
          onSave={onSaveStep(idx)}
          onCancel={onCancelStep(idx)}
          onDelete={onDeleteStep(idx)}
          canDelete={activitySteps.length > 1}
          disabled={isAutomated}
        />
      )}
      {showNewStepForm &&
        <ChromatographyStepForm
          label={'Chromatography Step ' + (activitySteps.length + 1)}
          workup={activitySteps.at(-1) || {}}
          solventOptions={filteredOntologiesByRoleName('solvent')}
          initialShowForm={true}
          onSave={onSaveStep(activitySteps.length)}
          onCancel={onCancelStep(activitySteps.length)}
        />
      }
      {!isAutomated &&
        <FormSection type='action'>
          <CreateButton
            label='Chromatography Step'
            type='action'
            onClick={addStep}
            size='sm'
          />
        </FormSection>
      }
    </>
  )
}

export default withActivitySteps(ChromatographyForm, 'purification_steps')
