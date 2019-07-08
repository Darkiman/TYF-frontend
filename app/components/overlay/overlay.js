import React, {Component} from "react";
import Modal from "react-native-modal";
import {View} from "react-native";


const styles = {
    container: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 4
    }
};

export default class ModalOverlay extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            isVisible,
            containerStyle,
            onBackdropPress,
            windowBackgroundColor,
            overlayBackgroundColor,
            width,
            height,
        } = this.props;
        return (
            <Modal
                isVisible={isVisible}
                onBackdropPress={onBackdropPress}
                swipeDirection={['left', 'right']}
                animationIn="slideInLeft"
                animationOut="slideOutRight"
                onSwipeComplete={onBackdropPress}
                backdropColor={windowBackgroundColor ? windowBackgroundColor : "rgba(0, 0, 0, 0.35)"}
                // width={width ? width : '90%'}
                // height={height ? height : 'auto'}
            >
               <View style={{...styles.container, ...containerStyle}}>
                   {this.props.children}
               </View>
            </Modal>
        );
    }
}
