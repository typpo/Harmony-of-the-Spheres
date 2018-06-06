import * as scenarioActionTypes from '../../action-types/scenario';
import filterScenarios from '../../data/scenarios';

export function getScenario(name) {
  return {
    type: scenarioActionTypes.GET_SCENARIO,
    scenario: filterScenarios(name)
  };
}

export function modifyScenarioProperty(payload) {
  return {
    type: scenarioActionTypes.MODIFY_SCENARIO_PROPERTY,
    payload: {
      key: payload.key,
      value: payload.value
    }
  };
}