import {createAppContainer, createStackNavigator} from "react-navigation";
import mainNavigationScreens from "../appNavigation/mainNavigationScreens";
import NavigationRoutes from "../../constants/NavigationRoutes";
import bottomTabNavigator from "./appBottomTabNavigator";
import topTabNavigator from "./appTopMaterialTabNavigation";

// const Navigator = createStackNavigator(
//     mainNavigationScreens, {
//         initialRouteName: NavigationRoutes.HOME,
// });


// const AppNavigation = createAppContainer(Navigator);
const AppNavigation = createAppContainer(bottomTabNavigator);
// const AppNavigation = createAppContainer(topTabNavigator);
export default AppNavigation;


