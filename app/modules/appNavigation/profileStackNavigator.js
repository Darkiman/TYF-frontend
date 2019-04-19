import {createStackNavigator} from "react-navigation";
import profileDataContainer from "../profile/data/profileDataContainer";
import profileContainer from "../profile/profileContainer";
import i18nService from '../../utils/i18n/i18nService';

const ProfileStackNavigator = createStackNavigator({
    Profile: {
        screen: profileContainer,
        navigationOptions: () => ({
            headerBackTitle: i18nService.t('navigation.back'),
        })
    },
    ProfileData: {
        screen: profileDataContainer,
    }
});

export default ProfileStackNavigator;


