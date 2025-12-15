import React, { useState } from "react";
import { UncontrolledTooltip } from "reactstrap";

import { useDrag, useDrop } from "react-dnd";
import { DndItemTypes } from "../../constants/dndItemTypes";

import Activity from "../activities/Activity";
import ActivityCreator from "../activities/ActivityCreator";
import StepInfo from "./StepInfo";
import StepForm from "./StepForm";
import StepLockButton from "./StepLockButton";

import IconButton from "../utilities/IconButton";
import ProcedureCard from "../utilities/ProcedureCard";

import StepAutomationStatusDecorator from "../../decorators/StepAutomationStatusDecorator";

import { StepSelectOptions } from "../../contexts/StepSelectOptions";
import { StepLock } from "../../contexts/StepLock";

import { useReactionsFetcher } from "../../fetchers/ReactionsFetcher";

const StepColumCard = ({ processStep, reactionProcess, previousStep, onCloseForm }) => {
  const isInitialised = !!processStep;
  const [showForm, setShowForm] = useState(!isInitialised);
  const cardTitle = isInitialised ? processStep.label : "New Step";
  const api = useReactionsFetcher();
  const isLocked = !!processStep?.locked;

  const displayMode = () => {
    return showForm ? "form" : "info";
  };

  const confirmDeleteStep = () => {
    window.confirm(
      "Deleting the ProcessStep will irreversably delete this Step and all associated Activities. " +
      "This can not be undone. Are you sure?"
    ) && deleteStep();
  };

  const deleteStep = () => api.deleteProcessStep(processStep.id);

  const closeForm = () => isInitialised ? setShowForm(false) : onCloseForm()

  const handleSave = (reactionProcessStep) => {
    isInitialised ?
      api.updateProcessStep(reactionProcessStep)
      :
      api.createProcessStep(reactionProcess.id, reactionProcessStep)
    closeForm();
  };

  const toggleForm = () => setShowForm(!showForm);

  /* React-DnD drag source and drop target */
  const [{ isDragging }, dragRef, previewRef] = useDrag(
    () => ({
      type: DndItemTypes.STEP,
      item: { processStep: processStep },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
        canDrag: monitor.canDrag(),
      }),
      canDrag: () => processStep && !isLocked,
    }),
    [processStep]
  );

  const [{ isOver }, dropRef] = useDrop(
    () => ({
      accept: DndItemTypes.STEP,
      drop: (monitor) => dropItem(monitor, processStep),
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
      canDrop: () => processStep && !isLocked,
    }),
    [processStep]
  );

  const dropItem = (monitor, processStep) => {
    api.updateProcessStepPosition(monitor.processStep.id, processStep.position);
  };

  const renderActivities = () => {
    return processStep.activities.map((activity) => (
      <Activity
        key={activity.id}
        activity={activity}
        processStep={processStep}
      />
    ));
  };

  const renderTitleBar = (title) => {
    return (
      <div className="d-md-flex gap-2">
        <div id={"actual_automation_status_" + processStep?.id}>
          <IconButton disabled
            positive={false}
            icon={StepAutomationStatusDecorator.iconForStatus(processStep?.actual_automation_status)}
            color={StepAutomationStatusDecorator.colorForStatus(processStep?.actual_automation_status)} />
        </div>
        <UncontrolledTooltip target={"actual_automation_status_" + processStep?.id} >
          {StepAutomationStatusDecorator.labelForStatus(processStep?.actual_automation_status)}
        </UncontrolledTooltip>
        {title}
      </div>
    )

  }

  return (
    <StepSelectOptions.Provider value={processStep?.select_options}>
      <div ref={dropRef} style={{ opacity: isOver ? 0.5 : 1 }}>
        <div
          ref={previewRef}
          className={
            "draggable-element" +
            (isDragging ? " draggable-element--dragging" : "")
          }
        >
          <StepLock.Provider value={isLocked}>
            <ProcedureCard
              title={renderTitleBar(cardTitle)}
              type="step"
              showEditBtn={!showForm && !isLocked}
              showMoveBtn={!showForm && !isLocked}
              showDeleteBtn={!showForm && !isLocked}
              showCancelBtn={showForm && !isLocked}
              onDelete={confirmDeleteStep}
              onEdit={toggleForm}
              onCancel={closeForm}
              displayMode={displayMode()}
              dragRef={dragRef}
              customClass="procedure-card--column"
            >
              <ProcedureCard.Info>
                <StepInfo processStep={processStep} />
              </ProcedureCard.Info>
              <ProcedureCard.Form>
                <StepForm
                  processStep={processStep}
                  reactionProcess={reactionProcess}
                  previousStep={previousStep}
                  nameSuggestionOptions={
                    reactionProcess.select_options.step_name_suggestions
                  }
                  initialSampleVessel={reactionProcess.reaction_process_vessel}
                  onSave={handleSave}
                  onCancel={closeForm}
                />
              </ProcedureCard.Form>
              {isInitialised && (
                <ProcedureCard.Details>
                  <div className="step-column-card__condition-container">
                    {renderActivities()}
                    {!isLocked && (
                      <ActivityCreator
                        processStep={processStep}
                        preconditions={processStep.final_conditions}
                        insertNewBeforeIndex={processStep.activities.length}
                        onClose={(e => { })}
                      />
                    )}
                  </div>
                </ProcedureCard.Details>
              )}
              {isInitialised && !showForm && (
                <ProcedureCard.ExtraButtons>
                  <div className="d-md-flex gap-2">
                    <StepLockButton
                      stepId={processStep?.id}
                      locked={isLocked}
                    />
                  </div>
                </ProcedureCard.ExtraButtons>
              )}
            </ProcedureCard>
          </StepLock.Provider>
        </div>
      </div>
    </StepSelectOptions.Provider>
  );
};

export default StepColumCard;
