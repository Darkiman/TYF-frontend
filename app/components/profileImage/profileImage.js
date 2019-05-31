import React, {Component} from "react";
import {Image, View, TouchableOpacity} from 'react-native';
import imageCacheHoc from "react-native-image-cache-hoc";
import apiConfig from "../../utils/apiConfig";
import ImagePicker from 'react-native-image-picker';
import i18nService from '../../utils/i18n/i18nService';

const CacheableImage = imageCacheHoc(Image, {
    validProtocols: ['http', 'https']
});
const defaultImg = require('../../assets/images/avatar.jpg');

const styles = {
    view: {
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
    }
};

export default class ProfileImage extends Component {
    constructor(props) {
        super(props);
        const avatar = props.avatar;
        this.state = {
            avatar: this.getAvatar(avatar)
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
                const source = {uri: response.uri};
                const sourceDisplaying = {uri: 'data:image/jpeg;base64,' + response.data};

                this.setState({
                    avatarSource: source,
                    sourceDisplaying: sourceDisplaying
                });

                const uploadedPhoto = await uploadAvatar(this.user.id, response);
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
        return (
            <View style={containerStyle}>
                <TouchableOpacity onPress={() => {
                    if (editable) {
                        this.changeAvatar();
                    }
                }}>
                    <CacheableImage style={styles.avatar}
                                    source={avatarSource ? {
                                        uri: avatarSource
                                    } : defaultImg}>
                    </CacheableImage>
                </TouchableOpacity>
            </View>
        );
    }
}
