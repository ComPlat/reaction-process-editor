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

  function validateAdd(action) {
    let errors = [];
    action.workup["sample_id"] || errors.push("Sample");
    return errors;
  }

  function validateSave(action) {
    let errors = [];
    action.reaction_process_vessel || errors.push("Vessel");
    return errors;
  }

  function validateTransfer(action) {
    let errors = [];
    action.workup["sample_id"] || errors.push("Sample");
    action.workup["transfer_target_step_id"] || errors.push("Transfer Target");
    return errors;
  }

  function validateVessel(vessel) {
    let errors = [];

    !vessel && errors.push("Vessel must be defined")
    vessel.cleanup || errors.push("Vessel Cleanup must be defined")

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
    switch (action.activity_name) {
      case "ADD":
        errors.push(...validateAdd(action));
        break;
      case "TRANSFER":
        errors.push(...validateTransfer(action));
        break;
      case "SAVE":
        errors.push(...validateSave(action));
        break;
      default:
        break;
    }
    if (action.reaction_process_vessel) {
      errors.push(...validateVessel(action.reaction_process_vessel))
    }

    if (errors.length > 0) { displayNotifications(errors); }
    return errors.length === 0;
  }

  function validateStep(_name, vessel, _automationStatus) {
    let errors = validateVessel(vessel)

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
    let errors = validateVessel(preparation.vesselable)
    if (errors.length > 0) { displayNotifications(errors); }

    return errors.length === 0;
  }
}
