import MetricsDecorator from "./MetricsDecorator";
import StringDecorator from "./StringDecorator";
export default class PurificationDecorator {

  static purificationStepInfo = (stepData, purificationSolventOptions) => {

    const solventsList = stepData.solvents?.map((solvent) => solvent.label).join(', ')

    let ratioList = "";

    if (stepData.solvents?.length > 1) {
      ratioList = StringDecorator.brackets(
        stepData.solvents.map((solvent) => solvent.ratio).join(":")
      );
    }

    const infoStrings = [
      MetricsDecorator.infoLineAmount(stepData.amount),
      solventsList,
      ratioList,
    ];

    if (stepData.step_mode) {
      infoStrings.push(
        StringDecorator.brackets(
          StringDecorator.toLabelSpelling(stepData.step_mode)
        )
      );
    }

    if (stepData.prod_mode) {
      infoStrings.push(
        StringDecorator.brackets(
          "prod: " + StringDecorator.toLabelSpelling(stepData.prod_mode)
        )
      );
    }

    if (stepData.repetitions) {
      infoStrings.push(
        StringDecorator.brackets(
          stepData.repetitions.value +
          " " +
          MetricsDecorator.label("REPETITIONS")
        )
      );
    }

    return infoStrings.join(" ");
  };

  static infoLineSolvents = (solvents) => {
    return solvents?.map((solvent) => solvent.label).join(", ")
  }

  static infoLineSolventsWithRatio = (stepData) => {
    let ratioList = "";

    if (!stepData.solvents) { return "no StepData" }
    if (stepData.solvents.length > 1) {
      ratioList = StringDecorator.brackets(
        stepData.solvents.map((solvent) => solvent.ratio).join(":")
      );
    }

    return [
      MetricsDecorator.infoLineAmount(stepData.amount),
      stepData.solvents.map((solvent) => solvent.label),
      ratioList,
    ].join(" ");

  };

  static infoLinePurificationSolvents = (activity, purificationSolventOptions) => {
    let infoLines = []
    let workup = activity.workup

    if (activity.activity_name === 'CRYSTALLIZATION') {
      infoLines.push(PurificationDecorator.infoLineSolvents(workup.solvents, purificationSolventOptions))
    } else { }
    let steps = workup["purification_steps"];

    if (steps) {
      for (let i = 0; i < steps.length; i++) {
        if (steps.length > 1) {
          infoLines.push("Step " + (i + 1));
        }
        infoLines.push(
          PurificationDecorator.purificationStepInfo(steps[i], purificationSolventOptions)
        );
      }
    }
    return infoLines
  }
}
