import React, { useContext, useState } from 'react'
import { Form } from 'reactstrap';

import MetricFormGroup from '../activities/forms/conditions/MetricFormGroup';
import FormButtons from "../utilities/FormButtons";

import { predefinableMetricNames } from '../../constants/formMetrics';

import { useReactionsFetcher } from '../../fetchers/ReactionsFetcher'

import { SubFormController } from '../../contexts/SubFormController';

const DefaultConditionsForm = (
  {
    defaultConditions,
    preconditions,
    closeForm,
    scope,
    typeColor
  }) => {

  const api = useReactionsFetcher();

  const subFormController = useContext(SubFormController)

  const [defaultConditionsForm, updateDefaultConditionsForm] = useState(defaultConditions)

  const handleWorkupChange = (field) => {
    const { name, value } = field;
    updateDefaultConditionsForm(prevState => ({
      ...prevState, [name]: value
    }));
  }

  const handleSave = () => {
    switch (scope) {
      case 'User':
        api.updateUserDefaultConditions(defaultConditionsForm).then(() => {
          window.dispatchEvent(new Event("userDefaultConditionsRequiresReload"))
        });
        break;
      case 'Reaction':
        api.updateReactionDefaultConditions(defaultConditionsForm)
        break;
      default:
        break;
    }
    closeForm()
  }

  return (
    <Form className={'activity-form condition-form'}>
      {
        predefinableMetricNames.map((metricName) => (
          <MetricFormGroup
            key={metricName}
            metricName={metricName}
            precondition={preconditions[metricName]}
            workup={defaultConditionsForm}
            onWorkupChange={handleWorkupChange}
            typeColor={typeColor}
          />)
        )
      }
      <FormButtons
        onSave={handleSave}
        onCancel={closeForm}
        type={typeColor}
        disabled={subFormController.anyBlockingSubformOpen()}
      />
    </Form>

  )
}

export default DefaultConditionsForm
