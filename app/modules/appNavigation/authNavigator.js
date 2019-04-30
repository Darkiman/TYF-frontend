import {createStackNavigator } from 'react-navigation';
import authContainer from "../auth/authContainer";
import loginContainer from "../auth/login/loginContainer";
import signupContainer from "../auth/signup/signupContainer";

const AuthStack = createStackNavigator({
    Auth:  {
        screen: authContainer,
        navigationOptions: {
            header: null,
        },
    },
    Login: {
        screen: loginContainer,
    },
    Signup: {
        screen: signupContainer,
    }
});
export default AuthStack;
