import React, {Component} from "react";
import {Platform, View} from "react-native";
import {Icon} from "react-native-elements";
import IconsType from "../../constants/IconsType";
import iconsService from "../../utils/iconsService";

const styles = {
    container: {
        height: 33,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingLeft: 16,
        paddingTop: Platform.OS === 'ios' ? 0 : 30
    }
};

export default class NavigationBack extends Component {
    constructor(props) {
        super(props);
        this.iconPrefix = iconsService.getIconPrefix();
    }

    render() {
        const {
            onPress,
            style
        } = this.props;
        const containerStyle = {...styles.container, ...style};
        return (
            <View style={containerStyle}>
                <Icon type={IconsType.Ionicon}
                      name={`${this.iconPrefix}-arrow-back`}
                      size={35}
                      color={'white'}
                      underlayColor={'transparent'}
                      onPress={onPress}
                />
            </View>
        );
    }
}
