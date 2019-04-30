import React, {Component} from 'react';
import {
  View,
  Button,
  Text,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import NavigationRoutes from "../../constants/NavigationRoutes";
import ErrorMessage from "../../components/ErrorMessage";
import {sharedStyles} from "../../shared/styles/sharedStyles";
import ProfileNavigation from "../appNavigation/profileStackNavigator";
// import ProfileStackNavigator from "../appNavigation/profileStackNavigator";

export default class ProfileView extends Component {
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
            <SafeAreaView style={sharedStyles.safeView}>
                <View>
                    {isLoading ? <ActivityIndicator /> : null}
                    {error ? <ErrorMessage /> : null}
                    <Text>This is profile</Text>
                    <Button
                        title='Go profile data'
                        onPress={() =>
                            this.props.navigation.navigate(NavigationRoutes.PROFILE_DATA)
                        }
                    />
                </View>
            </SafeAreaView>
        );
    }
}
