import {createAppContainer, createStackNavigator, createSwitchNavigator} from "react-navigation";
import bottomTabNavigator from "./appBottomTabNavigator";
import AuthStack from "./authNavigator";
import NavigationRoutes from "../../constants/NavigationRoutes";

const AppNavigation = createAppContainer(createSwitchNavigator(
    {
        App: bottomTabNavigator,
        Auth: AuthStack,
    },
    {
        initialRouteName: NavigationRoutes.AUTH,
    }
));
export default AppNavigation;


