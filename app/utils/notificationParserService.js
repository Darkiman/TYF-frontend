import NavigationRoutes from "../constants/NavigationRoutes";

const NotificationParserService = {
    mapsNotificationHandler: null,
    parseNotification: function (notification, navigation) {
        if(notification && notification.data) {
            const {data} = notification;
            if(data.action === 'navigate') {
                const {route} = data;
                if(route && route === NavigationRoutes.MAPS && !this.mapsNotificationHandler) {
                    navigation.navigate(data.route, {key: data.contactKey, timeStamp: +new Date()})
                } else {
                    if(this.mapsNotificationHandler) {
                        this.mapsNotificationHandler({key: data.contactKey});
                    }
                }
            }
        }
    },
};
export default NotificationParserService
