import {createAppContainer, createStackNavigator, createSwitchNavigator} from "react-navigation";
import bottomTabNavigator from "./appBottomTabNavigator";
import AuthStack from "./authNavigator";
import NavigationRoutes from "../../constants/NavigationRoutes";
import LoadingView from "../loading/loadingView";

const AppNavigation = createAppContainer(createSwitchNavigator(
    {
        App: bottomTabNavigator,
        Auth: AuthStack,
        Loading: LoadingView
    },
    {
        initialRouteName: NavigationRoutes.LOADING,
    }
));
export default AppNavigation;


