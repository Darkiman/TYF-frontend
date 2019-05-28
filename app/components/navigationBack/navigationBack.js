import React, {Component} from "react";
import {View} from "react-native";
import {Icon} from "react-native-elements";
import IconsType from "../../constants/IconsType";
import iconsService from "../../utils/iconsService";

const styles = {
    container: {
        height: 40,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingLeft: '5%'
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
        } = this.props;
        return (
            <View style={styles.container}>
                <Icon type={IconsType.Ionicon}
                      name={`${this.iconPrefix}-arrow-back`}
                      size={35}
                      color={ 'white'}
                      underlayColor={'transparent'}
                      onPress={onPress}
                />
            </View>
        );
    }
}
