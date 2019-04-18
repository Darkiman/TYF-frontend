import {createStackNavigator} from "react-navigation";
import profileDataContainer from "../profile/data/profileDataContainer";
import profileContainer from "../profile/profileContainer";

const ProfileStackNavigator = createStackNavigator({
    Profile: {screen: profileContainer},
    ProfileData: {screen: profileDataContainer}
});

export default ProfileStackNavigator;


