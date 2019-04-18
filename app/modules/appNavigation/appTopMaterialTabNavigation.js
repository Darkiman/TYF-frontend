import React from 'react';
import {Platform, Text} from 'react-native';
import { Icon } from 'react-native-elements'
import { createMaterialTopTabNavigator } from 'react-navigation';
import NavigationRoutes from "../../constants/NavigationRoutes";
import mainNavigationScreens from "../appNavigation/mainNavigationScreens";

const topTabNavigator = createMaterialTopTabNavigator(
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
                // You can return any component that you like here! We usually use an
                // icon component from react-native-vector-icons
                return <Icon type={'ionicon'} name={iconName} size={25} color={tintColor} />;
            }
        }),
        tabBarOptions: {
            activeTintColor: 'tomato',
            inactiveTintColor: 'gray',
        },
    }
);
export default topTabNavigator;
