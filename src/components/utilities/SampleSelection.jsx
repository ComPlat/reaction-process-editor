import React, { useState } from "react";
import Select from "react-select";
import { Col, Row } from "reactstrap";
import SamplesDecorator from "../../decorators/SamplesDecorator";
import OptionsDecorator from "../../decorators/OptionsDecorator";

const SampleSelection = ({ sampleOptions, sample, onChange }) => {
  const [previewSample, setPreviewSample] = useState(sample);

  const updatePreview = (id) => {
    if (!id) {
      setPreviewSample(sample);
    } else {
      setPreviewSample(OptionsDecorator.optionForValue(id, sampleOptions))
    }
  };

  const formatOptionLabel = ({ label, value }) => (
    <div
      onMouseEnter={() => updatePreview(value)}
      onMouseLeave={() => updatePreview()}
    >
      {label}
    </div>
  );

  return (
    <div className="sample-selection mb-3">
      <div className="sample-selection__preview">
        <h5>{previewSample ? previewSample.label : "Select sample"}</h5>
        <Row className="gx-2 mb-2">
          <Col xs={6}>
            {previewSample && previewSample.sample_svg_file ? (
              SamplesDecorator.sampleSvgImg(previewSample)
            ) : (
              <div className="sample-molecule-image bg-white border rounded-3" />
            )}
          </Col>
          <Col xs={6}>
            {previewSample && SamplesDecorator.infoAvailableAmounts(previewSample["unit_amounts"])}
          </Col>
        </Row>
        <Select
          className="react-select--overwrite sample-selection__select"
          classNamePrefix="react-select"
          name="sample_id"
          options={sampleOptions}
          value={sample}
          onChange={(selected) =>
            onChange({ sampleId: selected.value, label: selected.label })
          }
          formatOptionLabel={formatOptionLabel}
        />
      </div>
    </div>
  );
};

export default SampleSelection;
