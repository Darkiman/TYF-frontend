import { showMessage, hideMessage } from "react-native-flash-message";

const messageService = {
    showError: function(title) {
        showMessage({
            message: title,
            type: "default",
            backgroundColor: "tomato",
            color: "white",
            duration: 3000
        });
    }
};
export default messageService;
