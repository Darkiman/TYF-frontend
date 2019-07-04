import React, {Component} from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    Image,
    TouchableOpacity,
    Linking
} from 'react-native';
import {sharedStyles} from "../../../shared/styles/sharedStyles";
import i18nService from "../../../utils/i18n/i18nService";
import LinearGradient from "react-native-linear-gradient";
import NavigationBack from "../../../components/navigationBack/navigationBack";
import CommonConstant from "../../../constants/CommonConstant";

const styles = StyleSheet.create({
    centred: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems:'center'
    },
    logo: {
        width: 100,
        height: 125,
        marginBottom: 10
    },
    centredColumn: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems:'center'
    },
    versionText: {
        color: 'white',
        fontSize: 15
    },
    terms: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center',
    }
});

export default class AboutView extends Component {
    constructor(props) {
        super(props);
    }

    back = () => {
        this.props.navigation.goBack();
    };

    render() {
        const {
            isLoading,
            error
        } = this.props;
        return (
            <LinearGradient style={{...sharedStyles.safeView }}
                            colors={[sharedStyles.gradient.start, sharedStyles.gradient.end]}>
                <SafeAreaView style={{...sharedStyles.safeView}}>
                    <NavigationBack onPress={() => {
                        this.back();
                    }}/>
                    <View style={{...sharedStyles.centredColumn, ...styles.mainContainer}}>
                        <Image style={styles.logo} source={require('../../../assets/images/logoIcon.png')}/>
                        <Text style={styles.versionText}>{i18nService.t('app_version', {version: '1.0.0' })}</Text>

                        <View style={{marginTop: 60, flexDirection: 'column'}}>
                            <TouchableOpacity>
                                <Text style={styles.terms} onPress={() => {
                                    Linking.openURL(CommonConstant.PRIVACY_LINK);
                                }}>{i18nService.t('privacy_policy')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{marginTop: 30}}>
                                <Text style={styles.terms} onPress={() => {
                                    Linking.openURL(CommonConstant.TERMS_OF_USE_LINK);
                                }}>{i18nService.t('terms_of_use')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>
            </LinearGradient>

        );
    }
}
