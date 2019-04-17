import React, { Component } from 'react';
import {
  View,
  Button,
  Text,
  ActivityIndicator,
} from 'react-native';

const getErrorMessage = () => (
  <Text>
    An Error occured when fetching data
  </Text>
);

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
                {error ? getErrorMessage() : null}
                <Text>This is Home</Text>
                <Button
                    title='Load my Data'
                />
            </View>
        );
    }
}
