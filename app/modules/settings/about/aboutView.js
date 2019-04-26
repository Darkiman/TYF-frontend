import React, {Component} from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StyleSheet
} from 'react-native';
import {sharedStyles} from "../../../shared/sharedStyles";
import {Image} from "react-native-elements";
import i18nService from "../../../utils/i18n/i18nService";

const styles = StyleSheet.create({
    centred: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems:'center'
    },
    logo: {
        width: 150,
        height: 150
    },
    centredColumn: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems:'center'
    }
});

export default class AboutView extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            isLoading,
            error
        } = this.props;
        return (
            <SafeAreaView style={sharedStyles.safeView}>
                <View style={styles.centred}>
                    <View style={styles.centredColumn}>
                        <Image style={styles.logo} source={require('../../../assets/images/logo.jpg')}/>
                        <Text>{i18nService.t('app_version', {version: '1.0.0' })}</Text>
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}
