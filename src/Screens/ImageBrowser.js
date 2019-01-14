import React, { Component } from "react";
import ImageBrowser from "~/Components/ImageBrowser";

export default class ImageBrowserScreen extends Component {
  render() {
    return <ImageBrowser navigation={this.props.navigation} />;
  }
}
