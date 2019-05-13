import React, {Component} from "react";
import {ListItem} from 'react-native-elements';

export default class ContactItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            leftAvatar,
            title,
            onPress,
            type
        } = this.props;
        return (
            <ListItem leftAvatar={leftAvatar ? leftAvatar : {
                          rounded: true,
                          source: require('../../assets/images/avatar.jpg')
                      }}
                      title={title}>
            </ListItem>
        );
    }
}
