import {createStackNavigator} from "react-navigation";
import homeContainer from "../home/homeContainer";
import editProfileContainer from "../home/editProfile/editProfileContainer";

const HomeStackNavigator = createStackNavigator({
    Home: {
        screen: homeContainer,
        navigationOptions: () => ({
            header: null,
        })
    },
    Profile: {
        screen: editProfileContainer,
        navigationOptions: () => ({
            header: null,
        })
    }
});

export default HomeStackNavigator;


