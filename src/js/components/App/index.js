import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as scenarioActionCreators from '../../action-creators/scenario';
import App from './App';

class AppContainer extends Component {
  componentWillMount() {
    this.props.getScenario(this.props.scenarioName);
  }

  componentWillReceiveProps(nextProps) {
    const nextScenarioName = nextProps.scenarioName;

    if (nextScenarioName !== this.props.scenarioName)
      this.props.getScenario(nextScenarioName);
  }

  render() {
    return (
      <App
        scenario={this.props.scenario}
        modifyScenarioProperty={this.props.modifyScenarioProperty}
      />
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  scenarioName: ownProps.match.params.name,
  scenario: state.scenario
});

const mapDispatchToProps = dispatch => {
  return {
    getScenario: name => dispatch(scenarioActionCreators.getScenario(name)),
    modifyScenarioProperty: property =>
      dispatch(scenarioActionCreators.modifyScenarioProperty(property))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);
