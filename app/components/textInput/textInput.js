import React, {Component} from "react";
import {textInputStyle} from "./textInputStyle";
import IconsType from "../../constants/IconsType";
import {Icon, Input} from 'react-native-elements';
import iconsService from "../../utils/iconsService";
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
            valid,
            maxLength
        } = this.props;
        return (
            <Input name={name}
                   placeholder={placeholder}
                   disabled={disabled}
                   value={value}
                   maxLength={maxLength ? maxLength : 40}
                   errorMessage={errorMessage}
                   errorStyle={{position: 'absolute', top: 25, left: 10}}
                   secureTextEntry={secureTextEntry}
                   onChangeText={onChangeText}
                   onFocus={this.setFocus.bind(this, true)}
                   onBlur={this.setFocus.bind(this, false)}
                   inputStyle={textInputStyle.inputStyle}
                   placeholderTextColor={'rgba(255,255,255,0.4)'}
                   containerStyle={this.state.hasFocus || (valid && value) ? textInputStyle.containerStyleFocused : textInputStyle.containerStyle}
                   inputContainerStyle={textInputStyle.inputContainerStyle}
                   leftIconContainerStyle={textInputStyle.leftIconContainerStyle}
                   leftIcon={<Icon type={IconsType.Ionicon}
                                   name={`${this.iconPrefix}-${icon}`}
                                   color={valid && value ? textInputStyle.leftIconColorFocused : textInputStyle.leftIconColor}
                                   underlayColor={'transparent'}/>}
                   rightIconContainerStyle={rightIconContainerStyle}
                   rightIcon={rightIcon ? rightIcon : {}}
            />
        );
    }
}
