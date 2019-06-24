import { showMessage, hideMessage } from "react-native-flash-message";

const messageService = {
    showError: function(flashMessageObj, title) {
        if(flashMessageObj) {
            flashMessageObj.showMessage({
                message: title,
                type: "default",
                backgroundColor: "tomato",
                color: "white",
                duration: 3000
            });
        } else {
            showMessage({
                message: title,
                type: "default",
                backgroundColor: "tomato",
                color: "white",
                duration: 3000,
            });
        }
    },
    showInfo: function(flashMessageObj, title) {
        if(flashMessageObj) {
            flashMessageObj.showMessage({
                message: title,
                type: "info",
                backgroundColor: '#2eb0fb',
                color: "white",
                duration: 4000
            });
        } else {
            showMessage({
                message: title,
                type: "info",
                backgroundColor: '#2eb0fb',
                color: "white",
                duration: 4000
            })
        }
    }
};
export default messageService;
