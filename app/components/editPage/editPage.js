import React, {Component} from "react";
import {View} from "react-native";
import {Icon} from "react-native-elements";
import IconsType from "../../constants/IconsType";

const styles = {
    container: {
        height: 40,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingRight: '5%'
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
                      size={35}
                      color={'white'}
                      underlayColor={'transparent'}
                      onPress={onPress}
                />
            </View>
        );
    }
}