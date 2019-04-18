import {createAppContainer, createStackNavigator} from "react-navigation";
import bottomTabNavigator from "./appBottomTabNavigator";

const AppNavigation = createAppContainer(bottomTabNavigator);
export default AppNavigation;


