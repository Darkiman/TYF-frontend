import {createStackNavigator } from 'react-navigation';
import authContainer from "../auth/authContainer";

const AuthStack = createStackNavigator({
    Auth:  {
        screen: authContainer,
        navigationOptions: {
            header: null,
        },
    }
});
export default AuthStack;
