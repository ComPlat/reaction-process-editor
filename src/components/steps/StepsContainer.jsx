import React, { useState } from 'react';

import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import CreateButton from '../utilities/CreateButton';
import StepColumCard from "./StepColumnCard";

const StepsContainer = ({ reactionProcess }) => {

  const [displayNewStep, setDisplayNewStep] = useState(false)

  const toggleNewStep = () => {
    setDisplayNewStep(!displayNewStep)
  }

  const steps_count = reactionProcess.reaction_process_steps.length

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        {reactionProcess.reaction_process_steps.map((processStep, index) => (
          <StepColumCard
            key={processStep.id}
            reactionProcess={reactionProcess}
            processStep={processStep}
            previousStep={index > 0 ? reactionProcess.reaction_process_steps[index - 1] : undefined}
            totalSteps={steps_count}
          />
        ))}
        {displayNewStep ?
          <StepColumCard
            reactionProcess={reactionProcess}
            previousStep={steps_count > 0 ? reactionProcess.reaction_process_steps[steps_count - 1] : undefined}
            onCloseForm={toggleNewStep}
          />
          :
          <CreateButton label='New Step' type='step' onClick={toggleNewStep} />
        }
      </DndProvider>
    </>
  );
};


export default StepsContainer
