import React, {Component} from "react";
import {searchBarStyle} from "./searchBarStyle";
import {Icon, SearchBar} from "react-native-elements";
import IconsType from "../../constants/IconsType";
import iconsService from "../../utils/iconsService";

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
        } = this.props;
        return (
            <SearchBar
                placeholder={placeholder}
                onChangeText={onChangeText}
                onClear={onClear}
                value={value}
                platform={'default'}
                containerStyle={searchBarStyle.searchBarContainer}
                inputContainerStyle={searchBarStyle.searchBarInput}
                searchIcon={
                    <Icon type={IconsType.Ionicon}
                          name={`${this.iconPrefix}-search`}
                          size={25}
                          color={'#86939e'}
                          containerStyle={searchBarStyle.searchIconContainer}
                    />
                }
            />
        );
    }
}
