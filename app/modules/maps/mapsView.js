import React, { Component } from 'react';
import {
    View,
    Button,
    Text,
    ActivityIndicator, SafeAreaView,
} from 'react-native';
import ErrorMessage from "../../components/ErrorMessage";
import {sharedStyles} from "../../shared/sharedStyles";


export default class MapsView extends Component {
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
            <SafeAreaView styles={sharedStyles.safeView}>
                <View>
                    {isLoading ? <ActivityIndicator /> : null}
                    {error ? <ErrorMessage/> : null}
                    <Text>This is Home</Text>
                </View>
            </SafeAreaView>
        );
    }
}
