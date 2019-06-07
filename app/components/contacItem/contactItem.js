import React, {Component} from "react";
import {Icon, ListItem, Text} from 'react-native-elements';
import {ActivityIndicator, View, Image} from 'react-native';
import iconsService from "../../utils/iconsService";
import IconsType from "../../constants/IconsType";
import {sharedStyles} from "../../shared/styles/sharedStyles";
import themeService from "../../utils/themeService";
import imageCacheHoc from 'react-native-image-cache-hoc';
import apiConfig from "../../utils/apiConfig";

const CacheableImage = imageCacheHoc(Image, {
    validProtocols: ['http', 'https']
});


export default class ContactItem extends Component {
    constructor(props) {
        super(props);
        this.iconPrefix = iconsService.getIconPrefix();
    }


    render() {
        const {
            leftAvatar,
            title,
            data
        } = this.props;
        const avatar = data.data && data.data.avatar ? `${apiConfig.static}avatars/${data.data.avatar}` : `${apiConfig.static}avatars/default.jpg`;
        return (
            <ListItem
                containerStyle={{
                    height: 80
                }}
                titleStyle={{
                    fontSize: 22,
                    marginLeft: 10
                }}
                leftAvatar={leftAvatar ? leftAvatar : {
                    ImageComponent: CacheableImage,
                    rounded: true,
                    containerStyle: {
                        width: 50,
                        height: 50,
                        marginLeft: 3
                    },
                    size: 'medium',
                    source: avatar ? {
                        uri: avatar
                    } : {
                        uri: require('../../assets/images/avatar.jpg')
                    }
                }}
                title={title}
            >
            </ListItem>
        );
    }
}
