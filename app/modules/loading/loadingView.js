import React, { Component } from 'react';
import {StyleSheet,ImageBackground, ActivityIndicator, SafeAreaView} from 'react-native';
import {getContactsPosition} from "./loadingState";
import userService from "../../utils/userService";
import ax from "../../utils/axios";
import NavigationRoutes from "../../constants/NavigationRoutes";
import SplashScreen from "react-native-splash-screen";
import i18nService from "../../utils/i18n/i18nService";
import apiConfig from "../../utils/apiConfig";

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
            const user = await userService.getUser();
            if (user && user.token) {
                ax.defaults.headers.common['Authorization'] = `Token ${user.token}`;
            }
            if (user) {
                try {
                    const response = await ax.post(`${apiConfig.url}auth/login`, {
                        email: user.email,
                        password: user.password
                    });
                    if (response && response.data[0].key) {
                        this.props.navigation.navigate(NavigationRoutes.HOME);
                    } else {
                        this.props.navigation.navigate(NavigationRoutes.AUTH);
                    }
                } catch (error) {
                    this.props.navigation.navigate(NavigationRoutes.AUTH);
                }
            } else {
                this.props.navigation.navigate(NavigationRoutes.AUTH);
            }
        } catch (error) {
            this.props.navigation.navigate(NavigationRoutes.AUTH);
        }
    }


    render() {
        const {
            isLoading,
            error,
            data
        } = this.props;

        return (
            <ImageBackground source={require('../../assets/images/loading.png')} style={styles.backgroundImage}>
               <SafeAreaView style={styles.backgroundContainer}>
                   <ActivityIndicator color={'white'} size={'large'}/>
               </SafeAreaView>
            </ImageBackground>
        );
    }
}
