import React, {Component} from "react";
import {Icon, ListItem} from 'react-native-elements';
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

const colors = themeService.currentThemeColors;

export default class ContactItem extends Component {
    constructor(props) {
        super(props);
        this.iconPrefix = iconsService.getIconPrefix();
    }

    render() {
        const {
            leftAvatar,
            title,
            showAdd,
            showDelete,
            loading,
            onAdd,
            onDelete,
            data
        } = this.props;
        const avatar = data.data && data.data.avatar ? `${apiConfig.static}avatars/${data.data.avatar}` : `${apiConfig.static}avatars/default.jpg`;
        return (
            <ListItem leftAvatar={leftAvatar ? leftAvatar : {
                          ImageComponent: CacheableImage,
                          rounded: true,
                          source: avatar ? {
                              uri: avatar
                          } : {
                              uri: require('../../assets/images/avatar.jpg')
                          }
                      }}
                      title={title}
                      rightElement={
                          <View style={{...sharedStyles.centredRow, flex: 0, justifyContent: showDelete && showAdd ? 'space-between' : 'flex-end', width: 60}}>
                              {
                                  showAdd ? <Icon type={IconsType.Ionicon}
                                                  name={`${this.iconPrefix}-add`}
                                                  size={30}
                                                  color={colors.color}
                                                  onPress={() => {
                                                      if(onAdd) {
                                                          onAdd(data);
                                                      }
                                                  }}
                                  /> : null
                              }
                              { loading ? <ActivityIndicator /> : null}
                              {
                                 showDelete ? <Icon type={IconsType.Ionicon}
                                        name={`${this.iconPrefix}-trash`}
                                        size={30}
                                        color={colors.color}
                                        onPress={() => {
                                            if(onDelete) {
                                                onDelete(data);
                                            }
                                        }}
                                  /> : null
                              }
                          </View>
                      }
            >
            </ListItem>
        );
    }
}
