import React, {Component} from "react";
import {Text, View, Platform} from 'react-native';
import MapView from 'react-native-maps';
import moment from 'moment';
import CommonConstant from "../../constants/CommonConstant";
import {Icon} from "react-native-elements";
import iconsService from "../../utils/iconsService";
import IconsType from "../../constants/IconsType";
import themeService from "../../utils/themeService";

const colors = themeService.currentThemeColors;

const styles = {
    container: {
        backgroundColor: Platform.OS === 'ios' ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,1)',
        width: 120,
        height: 75,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        borderRadius: 4,
        marginBottom: 2
    },
    name: {
        fontSize: 16,
        marginBottom: 5,
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

export default class ContactMarkerCallout extends Component {
    constructor(props) {
        super(props);
        this.iconPrefix = iconsService.getIconPrefix();
        this.state = {
            showDetails: false
        };
    }

    render() {
        const {
            data
        } = this.props;
        const date = data && data.geoPosition && data.geoPosition.date && (data.geoPosition.date._seconds ? moment.unix(data.geoPosition.date._seconds) : moment(data.geoPosition.date));
        let dateString;
        let timeString;
        if(date) {
            dateString = date.format(CommonConstant.DATE_FORMAT);
            timeString = date.format(CommonConstant.TIME_FORMAT);
        }
        const additionalStyle = date ? {} : {height: 35};
        const containerStyle = {...styles.container, ...additionalStyle};
        const nameAdditionalStyle = date ? {} : {marginBottom: 0};
        const nameStyle = {...styles.name, ...nameAdditionalStyle};
        return (
            <MapView.Callout
                tooltip={true}>
                <View style={containerStyle}>
                    <View>
                        <Text style={nameStyle}>
                            {data.name}
                        </Text>
                    </View>
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
