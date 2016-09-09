import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './actions';

export class DefaultPage extends Component {
  static propTypes = {
    stockLevel: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  render() {
    return (
      <div className="stock-level-default-page">
        Page Content: stock-level/DefaultPage
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    stockLevel: state.stockLevel,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...actions }, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DefaultPage);
