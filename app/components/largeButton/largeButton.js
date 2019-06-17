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
            style,
            type,
            icon,
            iconRight,
            // iconContainerStyle
        } = this.props;
        const fromPropsButtonStyle = this.props.buttonStyle ? this.props.buttonStyle : {};
        const fromPropsTitleStyle = this.props.titleStyle ? this.props.titleStyle : {};
        let buttonStyle;
        let titleStyle;
        let loadingProps;
        switch (type) {
            case 'outline':
                buttonStyle = largeButtonStyles.outlineButtonStyle;
                titleStyle = largeButtonStyles.outlineButtonText;
                loadingProps = largeButtonStyles.outlineButtonLoadingProps;
                break;
            case 'clear':
                buttonStyle = largeButtonStyles.clearButtonStyle;
                titleStyle = largeButtonStyles.clearButtonText;
                loadingProps = largeButtonStyles.clearButtonLoadingProps;
                break;
            default:
                buttonStyle = largeButtonStyles.buttonStyle;
                titleStyle = largeButtonStyles.buttonText;
                loadingProps = largeButtonStyles.clearButtonLoadingProps;
        }
        return (
            <Button type={type}
                    title={title}
                    containerViewStyle={largeButtonStyles.containerViewStyle}
                    buttonStyle={{
                        ...buttonStyle,
                        ...fromPropsButtonStyle,
                    }}
                    titleStyle={{
                        ...titleStyle,
                        ...fromPropsTitleStyle
                    }}
                    // iconContainerStyle={iconContainerStyle ? iconContainerStyle : {}}
                    icon={icon ? icon : {}}
                    iconRight={iconRight ? true : false}
                    loadingStyle={largeButtonStyles.loadingStyle}
                    loadingProps={loadingProps}
                    disabled={disabled}
                    loading={loading}
                    onPress={onPress}
                    style={style ? style : {}}
            />
        );
    }
}
