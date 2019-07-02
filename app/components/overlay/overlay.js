import React, {Component} from "react";
import { Overlay} from 'react-native-elements';

export default class ModalOverlay extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            isVisible,
            onBackdropPress,
            windowBackgroundColor,
            overlayBackgroundColor,
            width,
            height,
        } = this.props;
        return (
            <Overlay
                isVisible={isVisible}
                onBackdropPress={onBackdropPress}
                windowBackgroundColor={windowBackgroundColor ? windowBackgroundColor : "rgba(0, 0, 0, 0.35)"}
                overlayBackgroundColor={overlayBackgroundColor ? overlayBackgroundColor : "#ffffff"}
                width={width ? width : '90%'}
                height={height ? height : 'auto'}>
              {this.props.children}
            </Overlay>
        );
    }
}
