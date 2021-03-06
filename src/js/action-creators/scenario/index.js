import * as scenarioActionTypes from '../../action-types/scenario';
import filterScenarios from '../../data/scenarios';
import { getObjFromArrByKeyValuePair } from '../../utils';
import { getA, rotateVector, getOrbit } from '../../Physics/utils';

export function getScenario(name) {
  return {
    type: scenarioActionTypes.GET_SCENARIO,
    scenario: filterScenarios(name)
  };
}

export function modifyScenarioProperty(...args) {
  return dispatch => {
    args.forEach(arg =>
      dispatch({
        type: scenarioActionTypes.MODIFY_SCENARIO_PROPERTY,
        payload: { key: arg.key, value: arg.value }
      })
    );
  };
}

export function modifyMassProperty(payload) {
  return {
    type: scenarioActionTypes.MODIFY_MASS_PROPERTY,
    payload: {
      name: payload.name,
      key: payload.key,
      value: payload.value
    }
  };
}

export function addMass(payload) {
  return (dispatch, getState) => {
    const scenario = getState().scenario;

    const primary = getObjFromArrByKeyValuePair(
      scenario.masses,
      'name',
      payload.primary
    );

    let { apsisOne, apsisTwo, argumentOfPeriapsis } = payload.secondary;

    const periapsis = apsisOne > apsisTwo ? apsisTwo : apsisOne;

    let { x, y, z } = rotateVector(periapsis, 0, 0, argumentOfPeriapsis);

    const a = getA(apsisOne, apsisTwo);

    dispatch({
      type: scenarioActionTypes.ADD_MASS,
      payload: getOrbit(
        primary,
        {
          ...payload.secondary,
          x: primary.x + x,
          y: primary.y + y,
          z: primary.z + z
        },
        scenario.g,
        a
      )
    });
  };
}

export function deleteMass(name) {
  return {
    type: scenarioActionTypes.DELETE_MASS,
    name
  };
}
