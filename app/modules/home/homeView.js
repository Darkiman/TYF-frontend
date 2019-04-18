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
import i18n from '../../utils/i18n';


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
        return (
            <SafeAreaView forceInset={{top:'always'}} styles={sharedStyles.safeView}>
                <View>
                    {isLoading ? <ActivityIndicator /> : null}
                    {error ? <ErrorMessage/> : null}
                    <Text>This is Home</Text>
                    <Button
                        title='Go profile'
                        onPress={() => {
                            this.props.navigation.navigate(NavigationRoutes.PROFILE);
                        }}
                    />
                </View>
            </SafeAreaView>
        );
    }
}
