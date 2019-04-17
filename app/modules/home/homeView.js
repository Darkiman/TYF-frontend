import React, { Component } from 'react';
import {
  View,
  Button,
  Text,
  ActivityIndicator,
} from 'react-native';
import NavigationRoutes from "../../constants/NavigationRoutes";
import ErrorMessage from "../../components/ErrorMessage";


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
            <View>
                {isLoading ? <ActivityIndicator /> : null}
                {error ? <ErrorMessage/> : null}
                <Text>This is Home</Text>
                <Button
                    title='Load my Data'
                    onPress={() =>
                        this.props.navigation.navigate(NavigationRoutes.PROFILE)
                    }
                />
            </View>
        );
    }
}
