import React, {Component} from "react";
import {textInputStyle} from "./textInputStyle";
import IconsType from "../../constants/IconsType";
import {Input} from 'react-native-elements';
import iconsService from "../../utils/IconsService";
import aboutState from "../../modules/settings/about/aboutState";

export default class TextInput extends Component {
    constructor(props) {
        super(props);
        this.iconPrefix = iconsService.getIconPrefix();
        this.state = {
            hasFocus: false
        };
    }

    setFocus(hasFocus) {
        this.setState({
            hasFocus
        });
    };

    render() {
        const {
            name,
            disabled,
            value,
            errorMessage,
            onChangeText,
            placeholder,
            icon,
            secureTextEntry,
            rightIcon,
            rightIconContainerStyle,
            valid
        } = this.props;
        return (
            <Input name={name}
                   placeholder={placeholder}
                   disabled={disabled}
                   value={value}
                   errorMessage={errorMessage}
                   errorStyle={{position: 'absolute', top: 25, left: 10}}
                   secureTextEntry={secureTextEntry}
                   onChangeText={onChangeText}
                   onFocus={this.setFocus.bind(this, true)}
                   onBlur={this.setFocus.bind(this, false)}
                   containerStyle={this.state.hasFocus || (valid && value) ? textInputStyle.containerStyleFocused : textInputStyle.containerStyle}
                   inputContainerStyle={textInputStyle.inputContainerStyle}
                   leftIconContainerStyle={textInputStyle.leftIconContainerStyle}
                   leftIcon={{
                           type: IconsType.Ionicon,
                           name: `${this.iconPrefix}-${icon}`,
                           color: valid && value ? textInputStyle.leftIconColorFocused : textInputStyle.leftIconColor
                   }}
                   rightIconContainerStyle={rightIconContainerStyle}
                   rightIcon={rightIcon ? rightIcon : {}}
            />
        );
    }
}