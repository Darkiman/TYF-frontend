import React, {Component} from "react";
import {View, Text, Platform} from 'react-native';
import {Icon} from "react-native-elements";
import IconsType from "../../constants/IconsType";
import MapView from "react-native-maps";
import moment from "moment";
import CommonConstant from "../../constants/CommonConstant";
import themeService from "../../utils/themeService";
import iconsService from "../../utils/iconsService";

const colors = themeService.currentThemeColors;

const styles = {
    container: {
        backgroundColor: Platform.OS === 'ios' ? 'rgba(255,255,255,0.7)' : 'white',
        width: 120,
        height: 55,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        borderRadius: 4,
        marginBottom: 2
    },
    infoContainer: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        color: colors.textLightColor
    },
    textStyle: {
        color: colors.textColor
    },
    icon: {
        marginRight: 5
    },
};

export default class LocationCallout extends Component {
    constructor(props) {
        super(props);
        this.iconPrefix = iconsService.getIconPrefix();
    }

    render() {
        const {
            date,
        } = this.props;
        const dateValue = moment(date);
        let dateString;
        let timeString;
        if(date) {
            dateString = dateValue.format(CommonConstant.DATE_FORMAT);
            timeString = dateValue.format(CommonConstant.TIME_FORMAT);
        }
        const additionalStyle = date ? {} : {height: 35};
        const containerStyle = {...styles.container, ...additionalStyle};
        return (
            <MapView.Callout
                tooltip={true}>
                <View style={containerStyle}>
                    {
                        date ? <View style={styles.infoContainer}>
                            <View style={styles.infoRow}>
                                <Icon type={IconsType.Ionicon}
                                      name={`${this.iconPrefix}-${'calendar'}`}
                                      size={18}
                                      containerStyle={styles.icon}
                                      color={colors.textLightThemeColor}
                                      underlayColor={'transparent'}>
                                </Icon>
                                <Text style={styles.textStyle}>
                                    {dateString}
                                </Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Icon type={IconsType.Ionicon}
                                      name={`${this.iconPrefix}-${'time'}`}
                                      size={18}
                                      containerStyle={styles.icon}
                                      color={colors.textLightThemeColor}
                                      underlayColor={'transparent'}>
                                </Icon>
                                <Text style={styles.textStyle}>
                                    {timeString}
                                </Text>
                            </View>
                        </View> : null
                    }
                </View>
            </MapView.Callout>
        );
    }
}
