import React from 'react';
import Dropdown from '../Dropdown';
import Tooltip from '../Tooltip';

export default function(props) {
  return (
    <React.Fragment>
      <h2>Camera</h2>
      <label className="top">
        Rotating Reference Frame{' '}
        <Tooltip
          position="left"
          content="Specifying a rotating reference frames allows us to observe the universe unfold relative to a fixed point, for instance Earth. While Earth orbits the Sun regardless of the reference frame being considered, in a rotating reference frame, the sun, for example, will appear to orbit the Earth, which is fixed at the center of the coordinate system."
        />
      </label>
      <div className="tabs-dropdown-wrapper">
        <Dropdown selectedOption={props.rotatingReferenceFrame}>
          <div
            name="Origo"
            key="Origo"
            callback={() =>
              props.modifyScenarioProperty({
                key: 'rotatingReferenceFrame',
                value: 'Origo'
              })
            }
          >
            Origo
          </div>
          {props.masses.map(mass => (
            <div
              name={mass.name}
              key={mass.name}
              callback={() =>
                props.modifyScenarioProperty({
                  key: 'rotatingReferenceFrame',
                  value: mass.name
                })
              }
            >
              {mass.name}
            </div>
          ))}
        </Dropdown>
      </div>
      <label className="top">
        Camera Position{' '}
        <Tooltip
          position="left"
          content="Select the position of the camera. If the position is set to free, you can zoom in on and orbit around the focus of the camera with your mouse or touch screen."
        />
      </label>
      <div className="tabs-dropdown-wrapper">
        <Dropdown selectedOption={props.cameraPosition}>
          <div
            name="Free"
            key="Free"
            callback={() =>
              props.modifyScenarioProperty({
                key: 'cameraPosition',
                value: 'Free'
              })
            }
          >
            Free
          </div>
          {props.masses.map(mass => (
            <div
              name={mass.name}
              key={mass.name}
              callback={() =>
                props.modifyScenarioProperty({
                  key: 'cameraPosition',
                  value: mass.name
                })
              }
            >
              {mass.name}
            </div>
          ))}
        </Dropdown>
      </div>
      <label className="top">
        Camera Focus{' '}
        <Tooltip
          position="left"
          content="Select the focus of the camera, or in other words, what the camera should be looking at."
        />
      </label>
      <div className="tabs-dropdown-wrapper">
        <Dropdown selectedOption={props.cameraFocus}>
          <div
            name="Origo"
            key="Origo"
            callback={() =>
              props.modifyScenarioProperty({
                key: 'cameraFocus',
                value: 'Origo'
              })
            }
          >
            Origo
          </div>
          {props.masses.map(mass => (
            <div
              name={mass.name}
              key={mass.name}
              callback={() =>
                props.modifyScenarioProperty({
                  key: 'cameraFocus',
                  value: mass.name
                })
              }
            >
              {mass.name}
            </div>
          ))}
        </Dropdown>
      </div>
    </React.Fragment>
  );
}
