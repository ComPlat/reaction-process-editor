import React from "react";

import AmountInput from "./AmountInput";
import MetricsInputFormGroup from "../activities/forms/formgroups/MetricsInputFormGroup";

import MetricsDecorator from "../../decorators/MetricsDecorator";
import { amountInputSetMetricNames } from "../../constants/metrics";

const AmountInputSet = (
  {
    amount,
    maxAmounts,
    onChangeAmount,
  }) => {

  const currentBaseUnit = MetricsDecorator.baseUnit(amount?.unit) || MetricsDecorator.defaultUnit('WEIGHT')

  const currentFraction = amount && maxAmounts?.[currentBaseUnit] ?
    MetricsDecorator.unitType(amount.unit).toBase(amount.value) / maxAmounts[currentBaseUnit]
    : NaN

  const maxAmountInBaseUnit = (metricName) => maxAmounts?.[MetricsDecorator.defaultUnit(metricName)]

  const handlePercentageInput = (percentage) => {
    const convertedValue = MetricsDecorator.unitType(amount.unit)
      .fromBase(maxAmounts[currentBaseUnit]) * percentage.value / 100

    onChangeAmount({ value: convertedValue, unit: amount.unit, percentage: percentage.value })
  }

  const handleChangeAmountInput = (baseUnit) => (amount) => {
    const fraction = maxAmounts?.[baseUnit] ?
      MetricsDecorator.unitType(amount.unit).toBase(amount.value) / maxAmounts[baseUnit] : 1

    onChangeAmount({ value: amount.value, unit: amount.unit, percentage: 100 * fraction })
  }

  return (
    <>
      {
        amountInputSetMetricNames.map((metricName) => (
          <AmountInput
            key={metricName}
            metricName={metricName}
            currentAmount={amount}
            currentFraction={currentFraction}
            maxAmountInBaseUnit={maxAmountInBaseUnit(metricName)}
            onChange={handleChangeAmountInput(MetricsDecorator.defaultUnit(metricName))
            }
          />
        ))
      }
      {maxAmounts?.[currentBaseUnit] ?
        <MetricsInputFormGroup
          key={'PERCENTAGE'}
          metricName={'PERCENTAGE'}
          amount={{ value: 100 * currentFraction || 100, unit: 'PERCENT' }}
          max={MetricsDecorator.overscaledAmount(100)}
          onChange={handlePercentageInput}
          disabled={!maxAmounts?.[currentBaseUnit]}
        /> : <></>
      }
    </>
  );
};

export default AmountInputSet;
