import React, { Component } from 'react';
import {StyleSheet,ImageBackground, ActivityIndicator, SafeAreaView, Alert} from 'react-native';
import userService from "../../utils/userService";
import ax from "../../utils/axios";
import NavigationRoutes from "../../constants/NavigationRoutes";
import SplashScreen from "react-native-splash-screen";
import i18nService from "../../utils/i18n/i18nService";
import apiConfig from "../../utils/apiConfig";
import {LOGIN_ERROR} from "../auth/login/loginState";
import networkService from "../../utils/networkService";

const timeout = 2000;

const styles = StyleSheet.create({
    backgroundContainer: {
        backgroundColor: 'transparent',
        flex: 1,
        justifyContent: 'flex-end',
        alignItems:'center',
        paddingBottom: 20
    },
    backgroundImage: {
        width: '100%',
        height: '100%'
    }
});


export default class LoadingView extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        SplashScreen.hide();
        this.initialize();
    }

    async initialize() {
        if (!i18nService.initialized) {
            await i18nService.initialize();
        }
        try {
            await this.auth();
        } catch (error) {
            console.log(error);
            this.props.navigation.navigate(NavigationRoutes.AUTH);
        }
    }


    auth = async () => {
        const user = await userService.getUser();
        console.log(user);
        if (user && user.token) {
            ax.defaults.headers.common['Authorization'] = `Token ${user.token}`;
        }
        if (user) {
            this.props.navigation.navigate(NavigationRoutes.HOME);
        } else {
            this.props.navigation.navigate(NavigationRoutes.AUTH);
        }
    };

    render() {
        return (
            <ImageBackground source={require('../../assets/images/loading.png')} style={styles.backgroundImage}>
               <SafeAreaView style={styles.backgroundContainer}>
                   <ActivityIndicator color={'white'} size={'large'}/>
               </SafeAreaView>
            </ImageBackground>
        );
    }
}
