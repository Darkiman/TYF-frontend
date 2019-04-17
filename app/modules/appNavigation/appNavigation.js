import {createAppContainer, createStackNavigator} from "react-navigation";
import profileContainer from "../profile/profileContainer";
import homeContainer from "../home/homeContainer";

const Navigator = createStackNavigator({
    Home: {screen: homeContainer},
    Profile: {screen: profileContainer},
}, {
    initialRouteName: 'Home',
});

const AppNavigation = createAppContainer(Navigator);
export default AppNavigation;


