import React from 'react'

import { apiHostname } from '../constants'

import MetricsDecorator from './MetricsDecorator'

import { amountsDefaultUnits } from '../constants/metrics'

export default class SamplesDecorator {
  static sampleSvgImg = (sample) => {
    if (sample && sample.svg_file) {
      return (
        <img
          src={this.sampleSvgPath(sample)}
          alt={sample.short_label}
          className='sample-molecule-image bg-white border rounded-3'
        />
      )
    }
  }

  static sampleSvgPath = (sample) => `${apiHostname}/images/samples/${sample.svg_file}`

  static infoAvailableAmounts = (availableAmounts) => {
    return amountsDefaultUnits.map((unit) =>
      availableAmounts && availableAmounts[unit] &&
      MetricsDecorator.infoLineAmount({ value: Number(availableAmounts[unit]).toFixed(2), unit: unit })
    ).filter((el) => el).map((amount, index) => (
      <p key={index + "" + amount} className="mb-0">
        {amount}
      </p>
    ))
  }
}
