const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
// Minimum eight characters, at least one uppercase letter, one lowercase letter and one number:
const passwordRegex = /(?=^.{8,}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s)[0-9a-zA-Z!@#$%^&*()_/-]*$/;

const commonService = {
    validateEmail: function(email) {
        return emailRegex.test(String(email).toLowerCase());
    },
    validatePassword: function (password) {
        return passwordRegex.test(String(password));
    }
};
export default commonService;
