import React from 'react'

import MetricSubFormSet from '../formsets/MetricSubFormSet'
import TextInputFormSet from '../formsets/TextInputFormSet'
import WavelengthRangeFormSet from '../formsets/WavelengthRangeFormSet'

const DetectorConditionsFormGroup = ({ detectorsOptions, detectorConditions, onChange, disabled }) => {

	const handleChangeDetectorValue = (detectorId, metricName) => (value) => {
		onChange({ ...detectorConditions, [detectorId]: { ...detectorConditions[detectorId], [metricName]: value } })
	}

	const renderDetectorInputs = (detector) => {
		let detectorId = detector.value

		return detector.analysis_defaults?.map(analysis_default => {
			let metricName = analysis_default.metric_name

			let label = '' + detector.label + ' ' + analysis_default.label
			let value = detectorConditions?.[detectorId]?.[metricName]

			switch (analysis_default.data_type) {
				case 'TEXT':
					return (<TextInputFormSet
						key={"text" + analysis_default.label}
						label={label}
						value={value}
						onSave={handleChangeDetectorValue(detectorId, metricName)}
						typeColor='action'
						disabled={disabled}
					/>)
				case 'METRIC':
					return (<MetricSubFormSet
						label={label}
						metricName={analysis_default.metric_name}
						amount={value}
						onSave={handleChangeDetectorValue(detectorId, metricName)}
						disabled={disabled}
					/>)
				case 'WAVELENGTHRANGE':
					return (<WavelengthRangeFormSet
						label={label}
						wavelengths={value}
						onChange={handleChangeDetectorValue(detectorId, metricName)}
						disabled={disabled}
					/>)
				default:
					return <> Detector {detectorId} {detector.label} has no measurements.</>
			}
		})
	}

	return (
		<>
			{detectorsOptions?.map(detector => renderDetectorInputs(detector))}
		</>
	)
}

export default DetectorConditionsFormGroup
