import React, {Component} from 'react';
import {
    Text,
} from 'react-native';

export default class ErrorMessage extends Component {

    render() {
        const {
            text
        } = this.props;
        return (
            !text ?
            <Text>
                An error occurred while loading data. Please try again
            </Text> :
            <Text>
                {text}
            </Text>
         )
    }
}
