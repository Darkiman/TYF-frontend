import React, {Component} from "react";
import {textInputStyle} from "./textInputStyle";
import IconsType from "../../constants/IconsType";
import {Input} from 'react-native-elements';
import iconsService from "../../utils/IconsService";

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
            onChange,
            placeholder,
            icon,
            secureTextEntry
        } = this.props;
        return (
            <Input name={name}
                   placeholder={placeholder}
                   disabled={disabled}
                   value={value}
                   secureTextEntry={secureTextEntry}
                   onChange={onChange}
                   onFocus={this.setFocus.bind(this, true)}
                   onBlur={this.setFocus.bind(this, false)}
                   containerStyle={this.state.hasFocus ? textInputStyle.containerStyleFocused : textInputStyle.containerStyle}
                   inputContainerStyle={textInputStyle.inputContainerStyle}
                   leftIconContainerStyle={textInputStyle.leftIconContainerStyle}
                   leftIcon={{
                           type: IconsType.Ionicon,
                           name: `${this.iconPrefix}-${icon}`,
                           color: this.state.hasFocus ? textInputStyle.leftIconColorFocused : textInputStyle.leftIconColor
                   }}
            />
        );
    }
}
