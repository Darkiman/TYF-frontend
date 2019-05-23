import React, {Component} from "react";
import {Image, View, Text} from 'react-native';
import imageCacheHoc from "react-native-image-cache-hoc";

const CacheableImage = imageCacheHoc(Image, {
    validProtocols: ['http', 'https']
});
const defaultImg = require('../../assets/images/avatar.jpg');

export default class ContactMarker extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            data
        } = this.props;
        const avatar = null;
        return (
            <View>
                <Image style={{width: 30, height: 30}}
                       source={avatar ? {uri: avatar} : {defaultImg}}>
                </Image>
                <Text>Unknown</Text>
            </View>
        );
    }
}
