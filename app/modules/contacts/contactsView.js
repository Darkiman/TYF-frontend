import React, {Component} from 'react';
import {
    View,
    Button,
    Text,
    ActivityIndicator,
    SafeAreaView
} from 'react-native';
import NavigationRoutes from "../../constants/NavigationRoutes";
import {sharedStyles} from "../../shared/styles/sharedStyles";
import {Header, Icon} from "react-native-elements";
import IconsType from "../../constants/IconsType";
import iconsService from "../../utils/iconsService";

export default class ContactsView extends Component {
    constructor(props) {
        super(props);
        this.iconPrefix = iconsService.getIconPrefix();
    }

    render() {
        const {
            isLoading,
            error
        } = this.props;
        return (
            <SafeAreaView style={sharedStyles.safeView}>
                <View>
                    <Header
                        rightComponent={
                            <Icon type={IconsType.Ionicon}
                                  name={`${this.iconPrefix}-person-add`}
                                  size={25}
                                  color={'white'}
                            />}
                        containerStyle={{
                            backgroundColor: '#2eb0fb',
                            justifyContent: 'space-around',
                        }}
                    >
                    </Header>
                </View>
            </SafeAreaView>
        );
    }
}
