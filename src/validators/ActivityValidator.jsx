import { useContext } from "react";
import NotificationContext from "../contexts/NotificationContext";

export { useActivityValidator };

function useActivityValidator() {
  const { addNotification } = useContext(NotificationContext);

  return {
    validateActivity,
    validateVesselPreparation,
    validateSamplePreparation,
    validateStep
  };

  function errorsOnAdd(action) {
    let errors = [];
    action.workup["sample_id"] || errors.push("Sample");
    return errors;
  }


  function errorsOnTransfer(action) {
    let errors = [];
    action.workup["sample_id"] || errors.push("Sample");
    action.workup["transfer_target_step_id"] || errors.push("Transfer Target");
    return errors;
  }

  function errorsOnVessel(vessel) {
    let errors = [];

    vessel?.id || errors.push("Vessel must be defined")
    vessel?.cleanup || errors.push("Vessel Cleanup must be defined")
    return errors;
  }

  function displayNotifications(errors) {
    addNotification({
      title: "Cannot save Activity",
      message: "Missing input:",
      details: errors,
      type: "warning",
    });
  }

  function validateActivity(action) {
    let errors = [];

    let requiresVessel =
      ['DEFINE_FRACTION', 'DISCARD', 'SAVE', 'FILTRATION'].includes(action.activity_name)

    switch (action.activity_name) {
      case "ADD":
        errors.push(...errorsOnAdd(action));
        break;
      case "TRANSFER":
        errors.push(...errorsOnTransfer(action));
        break;
      default:
        break;
    }

    if (requiresVessel) {
      errors.push(...errorsOnVessel(action.reaction_process_vessel))
    }

    if (errors.length > 0) { displayNotifications(errors); }
    return errors.length === 0;
  }

  function validateStep(_name, vessel, _automationStatus) {
    let errors = errorsOnVessel(vessel)

    if (errors.length > 0) { displayNotifications(errors); }
    return errors.length === 0;
  }

  function validateSamplePreparation(preparation) {
    let errors = [];
    preparation.sample_id || errors.push("Sample");

    if (errors.length > 0) { displayNotifications(errors); }
    return errors.length === 0;
  }

  function validateVesselPreparation(preparation) {
    let errors = errorsOnVessel(preparation.vesselable)
    if (errors.length > 0) { displayNotifications(errors); }

    return errors.length === 0;
  }
}
