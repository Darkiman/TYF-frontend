import React, {Component} from 'react';
import {createAppContainer} from "react-navigation";
import bottomTabNavigator from "./appBottomTabNavigator";
import AuthStack from "./authNavigator";
import NavigationRoutes from "../../constants/NavigationRoutes";
import LoadingView from "../loading/loadingView";
import createAnimatedSwitchNavigator from 'react-navigation-animated-switch';
import { Transition } from 'react-native-reanimated';

const AppNavigation = createAppContainer(createAnimatedSwitchNavigator(
    {
        App: bottomTabNavigator,
        Auth: AuthStack,
        Loading: LoadingView
    },
    {
        transition: (
            <Transition.Together>
                <Transition.Out
                    type="slide-left"
                    durationMs={400}
                    interpolation="easeIn"
                />
                <Transition.In type="fade" durationMs={500} />
            </Transition.Together>
        ),
        initialRouteName: NavigationRoutes.LOADING,
    }
));
export default AppNavigation;


