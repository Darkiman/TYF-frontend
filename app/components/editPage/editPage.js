import React, {Component} from "react";
import {Platform, View} from "react-native";
import {Icon} from "react-native-elements";
import IconsType from "../../constants/IconsType";
import {sharedStyles} from "../../shared/styles/sharedStyles";

const styles = {
    container: {
        ...sharedStyles.topIcons,
        height: 31,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingRight: 8,
    }
};

export default class EditPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            onPress,
        } = this.props;
        return (
            <View style={styles.container}>
                <Icon type={IconsType.Evilicon}
                      name={`pencil`}
                      size={40}
                      color={'white'}
                      underlayColor={'transparent'}
                      onPress={onPress}
                />
            </View>
        );
    }
}
