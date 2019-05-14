import React, {Component} from "react";
import {Icon, ListItem} from 'react-native-elements';
import {View} from 'react-native';
import iconsService from "../../utils/iconsService";
import IconsType from "../../constants/IconsType";
import {sharedStyles} from "../../shared/styles/sharedStyles";
import NavigationRoutes from "../../constants/NavigationRoutes";

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
            onAdd,
            onDelete,
            data
        } = this.props;
        return (
            <ListItem leftAvatar={leftAvatar ? leftAvatar : {
                          rounded: true,
                          source: require('../../assets/images/avatar.jpg')
                      }}
                      title={title}
                      rightElement={
                          <View style={{...sharedStyles.centredRow, flex: 0, justifyContent: showDelete && showAdd ? 'space-between' : 'flex-end', width: 60}}>
                              {
                                  showAdd ? <Icon type={IconsType.Ionicon}
                                                  name={`${this.iconPrefix}-add`}
                                                  size={30}
                                                  onPress={() => {
                                                      if(onAdd) {
                                                          onAdd(data);
                                                      }
                                                  }}
                                  /> : null
                              }
                              {
                                 showDelete ? <Icon type={IconsType.Ionicon}
                                        name={`${this.iconPrefix}-trash`}
                                        size={30}
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
