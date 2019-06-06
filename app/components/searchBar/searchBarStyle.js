import {Platform} from "react-native";

export const searchBarStyle = {
    searchBarContainer: {
        flex: 1,
        height: 35,
        backgroundColor: 'transparent',
        borderWidth: 0,
        padding: 0,
        borderBottomColor: 'transparent',
        borderTopColor: 'transparent',
        marginBottom: 2
    },
    inputStyle: {
      color: 'white'
    },
    searchBarInput: {
        height: 35,
        backgroundColor: 'rgba(255,255,255,0.4)',
        borderRadius: 50,
        paddingTop: Platform.OS === 'ios' ? 0 : 5,
    },
    searchIconContainer: {
        marginBottom: Platform.OS === 'ios' ? 0 : 4,
        marginLeft: 2
    }
};
