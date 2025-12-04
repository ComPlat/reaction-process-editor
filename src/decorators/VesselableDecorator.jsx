import React from "react";

import StringDecorator from "./StringDecorator";
import OptionsDecorator from "./OptionsDecorator";

export default class VesselableDecorator {

  static getVesselableByParams = (vesselableParams, vesselables) => {
    return vesselables.find((vesselable) =>
      vesselable.id === vesselableParams.vesselable_id &&
      vesselable.vesselable_type === vesselableParams.vesselable_type);
  };

  static vesselTitle = (vessel) => {
    return !!vessel
      ? StringDecorator.toLabelSpelling(vessel.vessel_type)
      : undefined;
  };

  static vesselableType = (vessel) => {
    return !!vessel
      ? vessel.vesselable_type
      : 'Vessel';
  };

  static vesselableTabularData = (vesselData) => {
    return vesselData.map((vessel) => {
      return {
        vesselableValue: { vesselable_type: vessel.vesselable_type, vesselable_id: vessel.id },
        vesselable_type: vessel.vesselable_type,
        short_label: vessel.short_label,
        name: vessel.name,
        template: vessel.vessel_template_name,
        type: vessel.vessel_type,
        material: vessel.material_type,
        volume: this.vesselVolume(vessel),
        environment: vessel.environment_type,
        bar_code: vessel.bar_code,
        qr_code: vessel.qr_code,
      };
    });
  };

  /* Render functions */

  static renderVesselDetails = (vessel) => {
    return (
      <>
        <div>{this.vesselTitle(vessel)}</div>
        <div>{this.vesselVolume(vessel)}</div>
        <div>{this.vesselMaterial(vessel)}</div>
        <div>{StringDecorator.toLabelSpelling(vessel.environment_type)}</div>
      </>
    );
  };

  static vesselableSingleLine = (vessel) => {
    return !!vessel
      ? this.vesselTitle(vessel) + " " + this.vesselVolumeAndMaterial(vessel)
      : undefined;
  };

  static vesselVolume = (vessel) => {
    return vessel.volume_amount + " " + vessel.volume_unit.toLowerCase();
  };

  static vesselMaterial = (vessel) => {
    return StringDecorator.toLabelSpelling(vessel.material_type);
  };

  static vesselVolumeAndMaterial = (vessel) => {
    return this.vesselVolume(vessel) + " (" + this.vesselMaterial(vessel) + ")";
  };

  static vesselablePreparationsLine = (preparations, preparationOptions) => {
    return OptionsDecorator.valuesToLabel(
      preparations,
      preparationOptions
    );
  };
}
