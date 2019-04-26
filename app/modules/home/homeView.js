import React, { Component } from 'react';
import {
    View,
    Button,
    Text,
    ActivityIndicator, SafeAreaView,
} from 'react-native';
import NavigationRoutes from "../../constants/NavigationRoutes";
import ErrorMessage from "../../components/ErrorMessage";
import {sharedStyles} from "../../shared/sharedStyles";
import i18nService from '../../utils/i18n/i18nService';
import Languages from "../../constants/Languages";


export default class HomeView extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            isLoading,
            error,
            data
        } = this.props;
        console.log(this.props)
        return (
            <SafeAreaView forceInset={{top:'always'}} style={sharedStyles.safeView}>
                <View>
                    {isLoading ? <ActivityIndicator /> : null}
                    {error ? <ErrorMessage/> : null}
                    <Text>This is Home</Text>
                </View>
            </SafeAreaView>
        );
    }
}
