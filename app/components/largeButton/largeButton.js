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
            loadingProps,
            // iconContainerStyle
        } = this.props;
        const fromPropsButtonStyle = this.props.buttonStyle ? this.props.buttonStyle : {};
        const fromPropsTitleStyle = this.props.titleStyle ? this.props.titleStyle : {};
        let buttonStyle;
        let titleStyle;
        let loadingPropsValue;
        switch (type) {
            case 'outline':
                buttonStyle = largeButtonStyles.outlineButtonStyle;
                titleStyle = largeButtonStyles.outlineButtonText;
                loadingPropsValue = {...largeButtonStyles.outlineButtonLoadingProps, ...loadingProps};
                break;
            case 'clear':
                buttonStyle = largeButtonStyles.clearButtonStyle;
                titleStyle = largeButtonStyles.clearButtonText;
                loadingPropsValue = {...largeButtonStyles.clearButtonLoadingProps, ...loadingProps};
                break;
            default:
                buttonStyle = largeButtonStyles.buttonStyle;
                titleStyle = largeButtonStyles.buttonText;
                loadingPropsValue = {...largeButtonStyles.clearButtonLoadingProps, ...loadingProps};
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
                    loadingProps={loadingPropsValue}
                    disabled={disabled}
                    loading={loading}
                    onPress={onPress}
                    style={style ? style : {}}
            />
        );
    }
}
