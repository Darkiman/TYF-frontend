import React, {Component} from "react";
import {searchBarStyle} from "./searchBarStyle";
import {Icon, SearchBar} from "react-native-elements";
import IconsType from "../../constants/IconsType";
import iconsService from "../../utils/iconsService";
import CommonConstant from "../../constants/CommonConstant";

export default class CustomSearchBar extends Component {
    constructor(props) {
        super(props);
        this.iconPrefix = iconsService.getIconPrefix();
    }

    render() {
        const {
            value,
            placeholder,
            onChangeText,
            onClear,
            maxLength
        } = this.props;
        return (
            <SearchBar
                placeholder={placeholder}
                onChangeText={onChangeText}
                onClear={onClear}
                value={value}
                platform={'default'}
                inputStyle={searchBarStyle.inputStyle}
                containerStyle={searchBarStyle.searchBarContainer}
                inputContainerStyle={searchBarStyle.searchBarInput}
                placeholderTextColor={'white'}
                textContentType={'none'}
                maxLength={maxLength ? maxLength : CommonConstant.MAX_NAME_LENGTH}
                searchIcon={
                    <Icon type={IconsType.Ionicon}
                          name={`${this.iconPrefix}-search`}
                          size={25}
                          color={'white'}
                    />
                }
                clearIcon={
                    <Icon type={IconsType.Ionicon}
                          name={`${this.iconPrefix}-close-circle-outline`}
                          size={25}
                          color={'white'}
                          underlayColor={'transparent'}
                          containerStyle={searchBarStyle.searchIconContainer}
                          onPress={() => {
                              if(onChangeText) {
                                  onChangeText('');
                              }
                          }}
                    />
                }
            />
        );
    }
}
