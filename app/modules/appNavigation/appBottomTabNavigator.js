import React from 'react';
import {Platform, Text} from 'react-native';
import { Icon } from 'react-native-elements'
import { createBottomTabNavigator } from 'react-navigation';
import NavigationRoutes from "../../constants/NavigationRoutes";
import mainNavigationScreens from "../appNavigation/mainNavigationScreens";
import i18n from '../../utils/i18n';

const bottomTabNavigator = createBottomTabNavigator(
    mainNavigationScreens,
    {
        defaultNavigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ focused, tintColor }) => {
                const { routeName } = navigation.state;
                // const iconType = Platform.OS === 'ios' ? 'ionicon': 'material-community';
                const iconPrefix = Platform.OS === 'ios' ? 'ios': 'md';
                let iconName;
                switch(routeName) {
                    case NavigationRoutes.HOME:
                        iconName = `${iconPrefix}-home`;
                        break;
                    case NavigationRoutes.PROFILE:
                        iconName = `${iconPrefix}-person`;
                        break;
                }
                return <Icon type={'ionicon'} name={iconName} size={25} color={tintColor} />;
            },
            tabBarLabel: ({ focused, tintColor }) => {
                const { routeName } = navigation.state;
                let text;
                switch(routeName) {
                    case NavigationRoutes.HOME:
                        text = i18n.t('navigation.home');
                        break;
                    case NavigationRoutes.PROFILE:
                        text = i18n.t('navigation.profile');
                        break;
                }
                return <Text style={{fontSize: 11, color: focused ? tintColor : '#555'}}>{text}</Text>;
            }
        }),
        tabBarOptions: {
            activeTintColor: 'tomato',
            inactiveTintColor: 'gray'
        },
    }
);
export default bottomTabNavigator;
