import React from 'react';
import { Button, Row, Col } from "reactstrap";
import { actionTypeClusters } from "../../constants/actionTypeClusters";

const TypeSelectionPanel = ({ onSelect }) => {
  const columns = actionTypeClusters


  const renderActionCluster = (cluster, cIndex) => {
    return (
      <div className="type-selection-panel__action">
        <h5>{cluster.label}</h5>
        {cluster.actions.map((action, aIndex) => (
          <Button
            key={action.id + ' ' + cIndex + ' ' + aIndex}
            onClick={onSelect(action.activity)}
            className='col-12 btn-action'
          >
            {action.createLabel}
          </Button>
        ))}
      </div>)
  }

  return (
    <Row className='type-selection-panel'>
      {columns.map((column, cIndex) => (
        <Col key={" " + column.id + cIndex} className='type-selection-panel__cluster col-6'>
          {column.map((cluster) => renderActionCluster(cluster))}
        </Col>
      ))}
    </Row>
  );
};

export default TypeSelectionPanel;
