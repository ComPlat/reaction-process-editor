
import { useContext } from "react";
import { useDrag, useDrop } from 'react-dnd'

import ActivityCard from "./ActivityCard";
import InsertZone from "./InsertZone";

import { DndItemTypes } from '../../constants/dndItemTypes';
import { StepLock } from "../../contexts/StepLock";
import { SubFormController, SubFormToggle } from '../../contexts/SubFormController';

import { useReactionsFetcher } from '../../fetchers/ReactionsFetcher';


const Activity = ({ activity, processStep }) => {
  const api = useReactionsFetcher()
  const stepLock = useContext(StepLock)

  const onSave = (actionForm) => {
    api.updateActivity(actionForm)
  }

  const isInSameStep = (dropActivity) => {
    return activity.step_id === dropActivity.step_id
  }

  const dropClassName = () => {
    if (stepLock) {
      return 'activity--locked'
    } else {
      return canDrop && activity.position > getItem.source_position ?
        'activity--below-drag-position' : 'activity--above-drag-position'
    }
  }

  /* React-DnD drag source and drop target */
  const [{ isDragging }, dragRef, previewRef] = useDrag(() => ({
    type: DndItemTypes.ACTION,
    item: {
      activity: activity,
      source_position: activity.position,
      step_id: activity.step_id
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
      canDrag: monitor.canDrag()
    }),
    canDrag: () => !stepLock,
  }), [processStep])

  const [{ isOver, getItem, canDrop }, dropRef] = useDrop(() => ({
    accept: DndItemTypes.ACTION,
    drop: (monitor) => dropItem(monitor),
    canDrop: (dropActivity) => !stepLock && isInSameStep(dropActivity),
    collect: (monitor) => ({
      canDrop: monitor.canDrop(),
      isOver: monitor.isOver() && monitor.canDrop(),
      getItem: monitor.getItem()
    }),
  }), [processStep])

  const dropItem = (monitor) => {
    if (activity.id !== monitor.activity.id) {
      api.updateActivityPosition(monitor.activity.id, activity.position)
    }
  }

  const renderActivity = () => {
    const type = activity.activity_name === 'CONDITION' ? 'condition' : 'action'
    return (
      <ActivityCard
        type={type}
        activity={activity}
        preconditions={activity.preconditions}
        processStep={processStep}
        dragRef={dragRef}
        onSave={onSave}
      />
    )
  }

  const insertZoneState = () => {
    let state = 'default'
    if (isDragging) {
      state = 'inactive'
    } else if (isOver) {
      state = 'target'
    }
    return state
  }

  return (
    <div ref={dropRef} className={'activity ' + dropClassName()}>
      {!stepLock &&
        <InsertZone
          state={insertZoneState()}
          processStep={processStep}
          preconditions={activity.preconditions}
          insertNewBeforeIndex={activity.position}
        />
      }
      <div
        ref={previewRef}
        className={'draggable-element' + (isDragging ? ' draggable-element--dragging' : '')}
      >
        <SubFormController.Provider value={SubFormToggle()}>
          {renderActivity()}
        </SubFormController.Provider>
      </div>
    </div>
  )
};

export default Activity;
