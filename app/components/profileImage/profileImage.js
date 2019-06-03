import React, {Component} from "react";
import {Image, View, TouchableOpacity, ActivityIndicator} from 'react-native';
import imageCacheHoc from "react-native-image-cache-hoc";
import apiConfig from "../../utils/apiConfig";
import ImagePicker from 'react-native-image-picker';
import i18nService from '../../utils/i18n/i18nService';
import IconsType from "../../constants/IconsType";
import {Icon} from "react-native-elements";
import iconsService from "../../utils/iconsService";
import CommonConstant from "../../constants/CommonConstant";

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
    },
    activityIndicator: {
        position: 'absolute',
        right: 42,
        top: 44
    }
};

export default class ProfileImage extends Component {
    constructor(props) {
        super(props);
        const avatar = props.user.avatar;
        this.iconPrefix = iconsService.getIconPrefix();
        this.state = {
            avatar: this.getAvatar(avatar),
            avatarSource: null,
            changed: false,
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
        this.setState({
            loading: true
        });
        ImagePicker.showImagePicker(this.options, async (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                if(response.fileSize >= CommonConstant.MAX_FILE_SIZE) {
                    this.props.showError(i18nService.t('max_avatar_size', {size: 20}))
                } else {
                    this.setState({
                        avatarSource:  { uri: 'data:image/jpeg;base64,' + response.data },
                        type: response.data.type,
                        changed: true
                    });
                }
            }

            this.setState({
                loading: false
            });
        })
    };

    render() {
        const {
            style,
            editable
        } = this.props;
        const {
            loading,
            avatar,
            avatarSource,
            changed
        } = this.state;
        const containerStyle = {...styles.view, ...(style ? style : {})};
        const avatarData = avatarSource ? avatarSource : avatar;
        const img = changed ? <Image source={avatarSource}
                                     style={{...styles.avatar, ...{opacity: (editable && !this.state.changed) || loading ? 0.3 : 1}}}/>
                                    : <CacheableImage
                                    style={{...styles.avatar, ...{opacity: (editable && !this.state.changed) || loading ? 0.3 : 1}}}
                                    source={avatarData ? {
                                        uri: avatarData
                                    } : defaultImg}/>;
        return (
            <View style={containerStyle}>
                {
                    editable ?
                        <TouchableOpacity onPress={() => {
                            if (editable && !loading) {
                                this.changeAvatar();
                            }
                        }}>
                            {img}
                            {
                                loading ?
                                    <View style={styles.activityIndicator}>
                                        <ActivityIndicator size={'large'} color={'white'}/>
                                    </View> :
                                    <Icon
                                        containerStyle={styles.icon}
                                        type={IconsType.Ionicon}
                                        name={`${this.iconPrefix}-${'camera'}`}
                                        size={40}
                                        color={'white'}
                                        underlayColor={'transparent'}
                                    />
                            }
                        </TouchableOpacity>
                        : img
                }
            </View>
        );
    }
}
