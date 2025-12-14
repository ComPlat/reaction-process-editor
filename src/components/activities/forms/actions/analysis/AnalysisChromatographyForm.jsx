import React, { useContext } from 'react'
import { Label, FormGroup, Input } from 'reactstrap';

import AnalysisChromatographyStepForm from "./AnalysisChromatographyStepForm";

import ButtonGroupToggle from "../../formgroups/ButtonGroupToggle";
import DetectorConditionsFormGroup from '../../formgroups/DetectorConditionsFormGroup';
import MetricsInputFormGroup from '../../formgroups/MetricsInputFormGroup';
import OntologySelectFormGroup from '../../formgroups/OntologySelectFormGroup';
import OntologyMultiSelectFormGroup from '../../formgroups/OntologyMultiSelectFormGroup.jsx';
import SingleLineFormGroup from '../../formgroups/SingleLineFormGroup';

import CreateButton from "../../../../utilities/CreateButton";
import FormSection from '../../../../utilities/FormSection'
import SamplesIconSelect from '../../../../utilities/SamplesIconSelect.jsx';

import OntologiesDecorator from '../../../../../decorators/OntologiesDecorator';
import OptionsDecorator from '../../../../../decorators/OptionsDecorator';

import withActivitySteps from '../../../../utilities/WithActivitySteps';

import { ontologyId } from '../../../../../constants/ontologyId'

import { SelectOptions } from '../../../../../contexts/SelectOptions';

const AnalysisChromatographyForm = (
  {
    workup,
    onWorkupChange,
    activitySteps,
    showNewStepForm,
    addStep,
    onSaveStep,
    onCancelStep,
    onDeleteStep
  }) => {


  const isAutomated = workup.automation_mode === ontologyId.automation_modes.automated

  const selectOptions = useContext(SelectOptions);

  const currentDeviceOption = OptionsDecorator.inclusiveOptionForValue(workup.device, selectOptions.ontologies)
  const currentMethodOption = OptionsDecorator.inclusiveOptionForValue(workup.method, currentDeviceOption?.methods)
  const currentStationaryPhaseOption = OptionsDecorator.inclusiveOptionForValue(workup.stationary_phase, currentMethodOption?.stationary_phase)

  const filteredOntologiesByRoleName = (roleName) => OntologiesDecorator.activeOptionsForWorkupDependencies({ roleName: roleName, options: selectOptions.ontologies, workup: workup })

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

  const handleChangeAutomation = (newAutomationMode) => {
    switch (newAutomationMode) {
      case ontologyId.automation_modes.automated:
        handleChangeDevice(currentDeviceOption)
        setMethodAnalysisDefaults(currentMethodOption)
        setStationaryPhaseDefaults(currentStationaryPhaseOption)
        onWorkupChange({ name: 'mobile_phase', value: undefined })
        break;
      case ontologyId.automation_modes.semiAutomated:
        handleChangeDevice(currentDeviceOption)
        onWorkupChange({ name: 'method', value: undefined })
        onWorkupChange({ name: 'stationary_phase', value: undefined })
        break;
      case ontologyId.automation_modes.manual:
        handleChangeDevice(undefined)
        onWorkupChange({ name: 'stationary_phase', value: undefined })
        break;
      default:
    }
    onWorkupChange({ name: 'automation_mode', value: newAutomationMode })
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

  const filterDevicesByDetectors = () => {
    let devices = OntologiesDecorator.activeOptionsForRoleName({ roleName: 'device', options: selectOptions.ontologies })

    if (workup.detector?.length) {
      devices = devices.filter(device =>
        workup.detector.every(detectorInWorkup =>
          !!device.detectors.find(detector =>
            detector.value === detectorInWorkup)))
    }
    return devices
  }

  const renderAutomationSpecificFields = () => {
    switch (workup.automation_mode) {
      case ontologyId.automation_modes.automated:
      case ontologyId.automation_modes.semiAutomated:
        return (
          <>
            <OntologySelectFormGroup
              key={"device" + workup.device}
              roleName={'device'}
              workup={workup}
              onChange={handleChangeDevice}
              options={filterDevicesByDetectors()}
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
              amount={workup.inject_volume || { unit: 'mcl' }}
              onChange={handleWorkupChange('inject_volume')}
            />
          </>)
      case ontologyId.automation_modes.manual:
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
        <FormGroup>
          <Label>Sample</Label>
          <SamplesIconSelect
            isMulti
            isClearable={false}
            options={selectOptions.materials['SAMPLE']}
            samples={workup.samples}
            onChange={handleWorkupChange('samples')}
          />
        </FormGroup>
        <FormGroup>
          <Label>Molecular Entity</Label>
          <SamplesIconSelect
            isMulti
            isClearable={false}
            options={selectOptions.materials['MOLECULAR_ENTITITES']}
            samples={workup.molecular_entitites}
            onChange={handleWorkupChange('molecular_entities')}
          />
        </FormGroup>

        <Label>Mode</Label>
        <ButtonGroupToggle
          value={workup.automation_mode}
          options={filteredOntologiesByRoleName('automation_mode')}
          onChange={handleChangeAutomation} />

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
      </FormSection >
      {renderDetectorFormSection()}

      {
        activitySteps.map((step, idx) =>
          <AnalysisChromatographyStepForm
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
        )
      }
      {
        showNewStepForm &&
        <AnalysisChromatographyStepForm
          label={'Chromatography Step ' + (activitySteps.length + 1)}
          workup={activitySteps.at(-1) || {}}
          solventOptions={filteredOntologiesByRoleName('solvent')}
          initialShowForm={true}
          onSave={onSaveStep(activitySteps.length)}
          onCancel={onCancelStep(activitySteps.length)}
        />
      }
      {
        !isAutomated &&
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

export default withActivitySteps(AnalysisChromatographyForm, 'purification_steps')

