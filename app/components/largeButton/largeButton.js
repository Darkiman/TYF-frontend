import React, {Component} from "react";
import {largeButtonStyles} from "./largeButtonStyle";
import {Button} from 'react-native-elements';

export default class LargeButton extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            title,
            loading,
            disabled,
            onPress,
            type
        } = this.props;
        const fromPropsButtonStyle = this.props.buttonStyle ? this.props.buttonStyle : {};
        const fromPropsTitleStyle = this.props.buttonText ? this.props.buttonText : {};
        let buttonStyle;
        let titleStyle;
        switch (type) {
            case 'outline':
                buttonStyle = largeButtonStyles.outlineButtonStyle;
                titleStyle = largeButtonStyles.outlineButtonText;
                break;
            case 'clear':
                buttonStyle = largeButtonStyles.clearButtonStyle;
                titleStyle = largeButtonStyles.clearButtonText;
                break;
            default:
                buttonStyle = largeButtonStyles.buttonStyle;
                titleStyle = largeButtonStyles.buttonText;
        }
        return (
            <Button type={type}
                    title={title}
                    containerViewStyle={largeButtonStyles.containerViewStyle}
                    buttonStyle={{
                        ...buttonStyle,
                        ...fromPropsButtonStyle
                    }}
                    titleStyle={{
                        ...titleStyle,
                        ...fromPropsTitleStyle
                    }}
                    loadingStyle={largeButtonStyles.loadingStyle}
                    loadingProps={largeButtonStyles.indicatorSize}
                    disabled={disabled}
                    loading={loading}
                    onPress={onPress}
            />
        );
    }
}
