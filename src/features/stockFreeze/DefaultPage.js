import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './actions';

export class DefaultPage extends Component {
  static propTypes = {
    stockFreezeEdit: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  render() {
    return (
      <div className="stock-freeze-edit-default-page">
        Page Content: stock-freeze-edit/DefaultPage
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    stockFreezeEdit: state.stockFreezeEdit,
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
