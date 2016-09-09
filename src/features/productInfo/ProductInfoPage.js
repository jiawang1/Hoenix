import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './actions';

export class ProductInfoPage extends Component {
  static propTypes = {
    productInfo: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  render() {
    return (
      <div className="product-info-default-page">
        Page Content: product-info/DefaultPage
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    productInfo: state.productInfo,
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
)(ProductInfoPage);
