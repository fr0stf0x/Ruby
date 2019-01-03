import React from "react";
import { ActivityIndicator } from "react-native";
import { Overlay } from "react-native-elements";
import { connect } from "react-redux";
import selectors from "~/Selectors";

class Loading extends React.Component {
  render() {
    return (
      <Overlay
        isVisible={this.props.isLoading}
        windowBackgroundColor="rgba(255,255,255, 0.7)"
        overlayBackgroundColor="rgba(0,0,0, 0.7"
        width="auto"
        height="auto"
      >
        <ActivityIndicator color="#000" size="large" />
      </Overlay>
    );
  }
}

export default connect(state => ({
  isLoading: selectors.ui.isLoading(state)
}))(Loading);
