import React, {Component} from "react";
import {textInputStyle} from "./textInputStyle";
import IconsType from "../../constants/IconsType";
import {Icon, Input} from 'react-native-elements';
import iconsService from "../../utils/iconsService";
import aboutState from "../../modules/settings/about/aboutState";
import CommonConstant from "../../constants/CommonConstant";

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
            iconContainerStyle,
            secureTextEntry,
            rightIcon,
            rightIconContainerStyle,
            valid,
            textContentType,
            maxLength,
            keyboardType,
            type,
        } = this.props;
        let keyboardTypeValue = keyboardType ? keyboardType : 'default';
        let containerStyleValue = type === 'outline' ? textInputStyle.containerOutlineStyle: textInputStyle.containerStyle;
        let inputStyleValue = type === 'outline' ? textInputStyle.inputOutlineStyle : textInputStyle.inputStyle;
        let inputContainerStyleValue = type === 'outline' ? textInputStyle.inputOutlineContainerStyle : textInputStyle.inputContainerStyle;
        let placeHolderTextColorValue = type === 'outline' ? '#808080' : 'rgba(255,255,255,0.4)';
        let leftIconColorValue = type === 'outline' ? textInputStyle.leftIconOutlineColor : textInputStyle.leftIconColor;
        return (
            <Input name={name}
                   placeholder={placeholder}
                   disabled={disabled}
                   value={value}
                   maxLength={maxLength ? maxLength : CommonConstant.MAX_NAME_LENGTH}
                   errorMessage={errorMessage}
                   errorStyle={{position: 'absolute', top: 25, left: 10}}
                   secureTextEntry={secureTextEntry}
                   onChangeText={onChangeText}
                   keyboardType={keyboardTypeValue}
                   onFocus={this.setFocus.bind(this, true)}
                   onBlur={this.setFocus.bind(this, false)}
                   inputStyle={inputStyleValue}
                   placeholderTextColor={placeHolderTextColorValue}
                   containerStyle={containerStyleValue}
                   inputContainerStyle={inputContainerStyleValue}
                   textContentType={textContentType}
                   leftIconContainerStyle={{...textInputStyle.leftIconContainerStyle, ...iconContainerStyle}}
                   leftIcon={<Icon type={IconsType.Ionicon}
                                   name={`${this.iconPrefix}-${icon}`}
                                   color={leftIconColorValue}
                                   underlayColor={'transparent'}/>}
                   rightIconContainerStyle={rightIconContainerStyle}
                   rightIcon={rightIcon ? rightIcon : {}}
            />
        );
    }
}
