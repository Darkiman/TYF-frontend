import {Platform} from "react-native";

const iconsService = {
    getIconPrefix: function() {
        return Platform.OS === 'ios' ? 'ios': 'md';
    }
};
export default iconsService;
