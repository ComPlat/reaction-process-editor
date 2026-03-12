import React, { useEffect, useState } from 'react'
import { FormGroup, Button, Row } from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ButtonGroupToggle from "../formgroups/ButtonGroupToggle";

import IconButton from '../../../utilities/IconButton';
import MetricsInputFormGroup from '../formgroups/MetricsInputFormGroup';
import OptionalFormSet from './OptionalFormSet';
import ActivityInfoDecorator from '../../../../decorators/ActivityInfoDecorator';
import MetricsDecorator from '../../../../decorators/MetricsDecorator';

const WavelengthRangeFormSet = (
  {
    label,
    wavelengths,
    onChange,
    disabled
  }) => {

  const defaultPeak = MetricsDecorator.defaultAmount("WAVELENGTH")
  const newPeak = { value: undefined, unit: 'NM' }

  const [peaks, setPeaks] = useState(wavelengths?.peaks || [])
  const [isRange, setIsRange] = useState(!!wavelengths?.is_range);
  const [sortReverse, setSortReverse] = useState(false)

  useEffect(() => {
    resetForm()
    // eslint-disable-next-line
  }, [wavelengths])

  useEffect(() => {
    setPeaks(sortPeaks(peaks))
    // eslint-disable-next-line
  }, [isRange, sortReverse, peaks.length])


  const sortPeaks = (unsorted) => {
    let sorted = [...unsorted].sort((peak1, peak2) => peak1.value - peak2.value)
    sortReverse && !isRange && sorted.reverse()

    return sorted
  }

  const handleSave = () => {
    onChange({
      is_range: isRange,
      peaks: isRange ? [peaks[0] || defaultPeak, peaks.at(-1) || defaultPeak] : peaks
    })
  }
  const handleCancel = () => { resetForm() }

  const resetForm = () => {
    setIsRange(!!wavelengths?.is_range)
    setPeaks(wavelengths?.peaks || [])
  }

  const addPeak = () => { setPeaks(sortPeaks(peaks.concat(newPeak))); }

  const handleChangePeak = (idx) => (value) => {
    let newPeaks = [...peaks]
    newPeaks[idx] = value
    setPeaks(newPeaks)
  }

  const handleChangeRange = (idx) => (value) => {
    let newPeaks = [...peaks]
    newPeaks[0] ||= defaultPeak
    newPeaks[idx] = value
    setPeaks(newPeaks)
  }

  const resortPeaks = () => {
    setPeaks(sortPeaks(peaks))
  }
  const toggleSortOrder = () => setSortReverse(!sortReverse)

  const deletePeak = (idx) => () => setPeaks(peaks.toSpliced(idx, 1))

  const renderAutomationToggle = () => {
    return (
      <FormGroup className="mb-2">
        <ButtonGroupToggle
          value={isRange}
          options={[{ value: false, label: 'Single' }, { value: true, label: 'Range' }]}
          onChange={setIsRange}
        />
      </FormGroup>
    )
  }

  const renderPeaksForm = () => {
    return (
      <div onMouseOut={resortPeaks} >
        <Row className='gx-1 py-1 px-2 mx-0'>
          <div className='d-flex flex-column justify-content-center'>
            <Button color='action' className='create-button' onClick={addPeak} size={'sm'} >
              <FontAwesomeIcon icon={"plus"} />
              <span>Add Wavelength</span>
            </Button>
          </div>
        </Row>

        {
          peaks.map((peak, index) => {
            return (
              <Row className='gx-2 py-1 px-2 mx-0' key={'peak-' + index + ' + ' + peak.value}>
                <div className='col-11 d-flex flex-column justify-content-end'>
                  <MetricsInputFormGroup
                    initialstep={peaks.at(-2)?.value + 1}
                    label={'Peak'}
                    metricName={'WAVELENGTH'}
                    amount={peak}
                    onChange={handleChangePeak(index)}
                    disabled={disabled}
                  />
                </div>
                <div className='col-1 d-flex flex-column justify-content-center'>
                  <IconButton
                    positive={true}
                    icon='trash'
                    onClick={deletePeak(index)}
                  />
                </div>
              </Row>
            )
          })
        }
      </div>
    )
  }

  const renderRangeForm = () => {
    let amount_start = peaks[0] || defaultPeak
    let amound_end = peaks.length > 1 ? peaks.at(-1) : newPeak
    return (
      <>
        <Row className='gx-2 py-1 px-2 mx-0' key={'peak-0'}>
          <div className='col-11'>
            <MetricsInputFormGroup
              label={'Range min'}
              metricName={'WAVELENGTH'}
              amount={amount_start}
              max={amound_end?.value - 1}
              onChange={handleChangeRange(0)}
            />
          </div>
          <div className='col-1 d-flex flex-column justify-content-center'>
          </div>
        </Row>
        <Row className='gx-2 py-1 px-2 mx-0' key={'peak-1'}>
          <div className='col-11'>
            <MetricsInputFormGroup
              label={'Range max'}
              metricName={'WAVELENGTH'}
              amount={amound_end}
              min={amount_start.value + 1}
              onChange={handleChangeRange(1)}
            />
          </div>
          <div className='col-1 d-flex flex-column justify-content-center'>
          </div>
        </Row>
      </>
    )
  }

  const renderSortButton = () => {
    return (
      <OptionalFormSet.ExtraButton>
        <Button color="condition" onClick={toggleSortOrder} outline>
          <span className={"px-2"}>
            Sort
          </span>
          <FontAwesomeIcon icon={sortReverse ? "sort-down" : 'sort-up'} />
        </Button>
      </OptionalFormSet.ExtraButton>
    )
  }


  return (
    <OptionalFormSet
      subFormLabel={label || "Wavelengths"}
      valueSummary={ActivityInfoDecorator.infoLineWavelengths(wavelengths)}
      onSave={handleSave}
      onCancel={handleCancel}
      typeColor={'action'}
      disabled={disabled}
    >
      {renderAutomationToggle()}
      {isRange ? renderRangeForm() : renderPeaksForm()}

      {isRange || renderSortButton()}
    </OptionalFormSet>
  )
}

export default WavelengthRangeFormSet

