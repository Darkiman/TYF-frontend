import React, {Component} from "react";
import {Icon, ListItem} from 'react-native-elements';
import {ActivityIndicator, View, Image} from 'react-native';
import iconsService from "../../utils/iconsService";
import IconsType from "../../constants/IconsType";
import {sharedStyles} from "../../shared/styles/sharedStyles";
import imageCacheHoc from 'react-native-image-cache-hoc';
import apiConfig from "../../utils/apiConfig";
import i18nService from "../../utils/i18n/i18nService";
import messageService from "../../utils/messageService";
import NavigationRoutes from "../../constants/NavigationRoutes";

const CacheableImage = imageCacheHoc(Image, {
    validProtocols: ['http', 'https']
});

const defaultImg = require('../../assets/images/avatar.jpg');
const styles  = {
  avatar: {
      width: 50,
      height: 50,
      marginLeft: 3,
      borderRadius: 25
  }
};

const propOverridePlaceholderObject = {
    component: Image,
    props: {
        style: styles.avatar,
        source: defaultImg
    }
};

export default class ContactItem extends Component {
    constructor(props) {
        super(props);
        this.iconPrefix = iconsService.getIconPrefix();
    }

    render() {
        const {
            title,
            data,
            contacts,
            addContact,
            user,
            flashMessage,
            onPress
        } = this.props;
        const avatar = data.data && data.data.avatar ? `${apiConfig.static}avatars/${data.data.avatar}` : `${apiConfig.static}avatars/default.jpg`;
        const isInContacts = contacts && contacts.find && contacts.find(item => item.key === data.key);
        const loading = data.loadingSave;
        const showAdd = !isInContacts && !loading;
        return (
            <ListItem
                containerStyle={{
                    height: 80,
                    paddingRight: 0
                }}
                titleStyle={{
                    fontSize: 22,
                    marginLeft: 10
                }}
                leftElement={<CacheableImage source={{uri: avatar}}
                                             style={styles.avatar}
                                             placeholder={propOverridePlaceholderObject}/>}
                title={title}
                rightElement={
                    loading ? <View style={sharedStyles.actionsContainer}>
                            <ActivityIndicator></ActivityIndicator>
                        </View> :
                        (showAdd ? <View style={sharedStyles.actionsContainer}>
                            <Icon type={IconsType.Ionicon}
                                  name={`${this.iconPrefix}-add`}
                                  size={30}
                                  color={'rgb(144,154,165)'}
                                  onPress={async () => {
                                      if (addContact) {
                                          data.loadingSave = true;
                                          this.forceUpdate();
                                          const result = await addContact(user.id, data.key);
                                          if (result.error) {
                                              data.loadingSave = false;
                                              const errorText = i18nService.t(`validation_message.${result.message}`);
                                              messageService.showError(flashMessage, errorText);
                                          } else {
                                              data.loadingSave = false;
                                          }
                                          this.forceUpdate();
                                      }
                                  }}
                            />
                        </View> : null)
                }
                onPress={() => {
                    if(onPress) {
                        onPress(data.key, data.data);
                    }
                }}
            >
            </ListItem>
        );
    }
}
