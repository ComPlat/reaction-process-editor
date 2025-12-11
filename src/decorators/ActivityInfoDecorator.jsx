import MetricsDecorator from "./MetricsDecorator";
import OptionsDecorator from "./OptionsDecorator";
import StringDecorator from "./StringDecorator";
import TimeDecorator from "./TimeDecorator";

export default class ActivityInfoDecorator {
  static cardTitle = (activity) => {
    let title = this.toLabel(activity.activity_name);
    const workup = activity.workup;

    if (workup && !!Object.keys(workup).length) {
      switch (activity.activity_name) {
        case "PURIFICATION":
          title = 'Purification ' + this.toLabel(activity.activity_name);
          break;
        case "CONDITION":
          title = "Change Condition";
          break;
        case "ANALYSIS":
          if (workup.analysis_type) {
            title += " " + this.toLabel(workup.analysis_type);
          }
          break;
        case "ADD":
        case "REMOVE":
          title += " ";
          if (workup.sample_name) {
            title += this.toLabel(workup.acts_as) + ': ' + workup.sample_name;
          } else {
            title += ' Chemical'
          }
          break;
        case "SAVE":
          title += ' ' + workup.short_label
          break;
        case "TRANSFER":
        case "WAIT":
        default:
          break;
      }
    }
    return title;
  };

  static toLabel = (text) => StringDecorator.toLabelSpelling(text)

  static conditionInfo = (
    metricName,
    conditionWorkup,
    precondition,
    selectOptions
  ) => {
    switch (metricName) {
      case "EQUIPMENT":
        return this.infoLineEquipment(conditionWorkup, selectOptions.equipment);
      case "MOTION":
        return this.infoLineMotion(conditionWorkup, selectOptions);
      case "IRRADIATION":
        return MetricsDecorator.infoLineAmount(conditionWorkup);
      default:
        return MetricsDecorator.infoLineAmountWithDelta(conditionWorkup, precondition);
    }
  };

  static infoLineMotion = (conditionWorkup, selectOptions) => {
    return [
      OptionsDecorator.valueToLabel(
        conditionWorkup?.motion_type,
        selectOptions.FORMS.MOTION.motion_types
      ),
      OptionsDecorator.valueToLabel(
        conditionWorkup?.motion_mode,
        selectOptions.FORMS.MOTION.automation_modes
      ),
      MetricsDecorator.infoLineAmount(conditionWorkup.speed),
    ].join(" ");
  };

  static infoLineWavelengths = (wavelengths) => {
    return wavelengths?.peaks[0] && (
      wavelengths.is_range ?
        'Range ' + wavelengths.peaks[0]?.value + ' - ' + wavelengths.peaks.at(-1)?.value + ' nm'
        :
        '' + wavelengths.peaks.map((peak) => peak.value).join(', ')
    )
  }

  static infoLineEquipment = (equipment, equipmentOptions) => {
    return (
      equipment?.value &&
      OptionsDecorator.valuesToLabel(equipment.value, equipmentOptions)
    );
  };

  static infoLineSampleCondition = (workup) => {
    return [
      "MOTION",
      "VELOCITY",
      "TEMPERATURE",
      "PRESSURE",
    ]
      .map((metric) => {
        return (
          workup[metric]?.value !== undefined &&
          MetricsDecorator.infoLineAmount(workup[metric])
        );
      })
      .filter((el) => el)
      .join(", ");
  };

  static infoLineRemoveConditions = (conditions) => {
    return [
      MetricsDecorator.infoAmount(conditions?.TEMPERATURE),
      MetricsDecorator.infoAmount(conditions?.PRESSURE),
      conditions?.duration && TimeDecorator.timeString(conditions?.duration)
    ].filter((item) => (item)).join(", ");
  }
}
