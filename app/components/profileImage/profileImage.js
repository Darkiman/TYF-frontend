import React, {Component} from "react";
import {Image, View, TouchableOpacity} from 'react-native';
import imageCacheHoc from "react-native-image-cache-hoc";
import apiConfig from "../../utils/apiConfig";
import ImagePicker from 'react-native-image-picker';
import i18nService from '../../utils/i18n/i18nService';
import IconsType from "../../constants/IconsType";
import {textInputStyle} from "../textInput/textInputStyle";
import {Icon} from "react-native-elements";
import iconsService from "../../utils/iconsService";
import userService from "../../utils/userService";

const CacheableImage = imageCacheHoc(Image, {
    validProtocols: ['http', 'https']
});
const defaultImg = require('../../assets/images/avatar.jpg');

const styles = {
    view: {
        position: 'relative',
        width: 125,
        height: 125,
        borderRadius: 60,
    },
    avatar: {
        width: 125,
        height: 125,
        borderRadius: 60,
        overflow: 'hidden',
        borderWidth: 7,
        borderColor: 'white',
    },
    icon: {
        position: 'absolute',
        right: 47,
        top: 40
    }
};

export default class ProfileImage extends Component {
    constructor(props) {
        super(props);
        const avatar = props.user.avatar;
        this.iconPrefix = iconsService.getIconPrefix();
        this.state = {
            avatar: this.getAvatar(avatar),
            user: props.user,
            loading: false,
        };
    }

    componentDidMount(): void {
        this.options = {
            title: i18nService.t('select_avatar'),
            cancelButtonTitle: i18nService.t('cancel'),
            takePhotoButtonTitle: i18nService.t('take_photo'),
            chooseFromLibraryButtonTitle: i18nService.t('choose_from_gallery'),
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
    }

    getAvatar(avatar) {
        return avatar ? `${apiConfig.static}avatars/${avatar}` : `${apiConfig.static}avatars/default.jpg`
    }

    changeAvatar = () => {
        ImagePicker.showImagePicker(this.options, async (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                this.setState({
                    loading: true
                });
                const uploadedPhoto = await this.props.uploadAvatar(this.state.user.id, response);
                const user = this.state.user;
                const avatarUrl = this.getAvatar(uploadedPhoto.source.contact.data.avatar);
                user.avatar = await uploadedPhoto.source.contact.data.avatar;
                this.setState({
                    user: user,
                    avatar: avatarUrl
                });
                userService.setUser(user.id, user.email, user.name, user.password, user.token, user.tracking, user.avatar);
            }
        })
    };

    render() {
        const {
            style,
            editable
        } = this.props;
        const containerStyle = {...styles.view, ...(style ? style : {})};
        const avatarSource = this.state.avatar;
        const img = <CacheableImage style={{...styles.avatar, ...{opacity: editable ? 0.3 : 1}}}
                                    source={avatarSource ? {
                                        uri: avatarSource
                                    } : defaultImg}/>;
        return (
            <View style={containerStyle}>
                {
                    editable ?
                        <TouchableOpacity onPress={() => {
                            if (editable) {
                                this.changeAvatar();
                            }
                        }}>
                            <Icon
                                containerStyle={styles.icon}
                                type={IconsType.Ionicon}
                                name={`${this.iconPrefix}-${'camera'}`}
                                size={40}
                                color={'white'}
                                underlayColor={'transparent'}
                            />
                            {img}
                        </TouchableOpacity>
                        : img
                }
            </View>
        );
    }
}
