(function () {
    var config = window.corebiqFirebaseConfig;
    if (!window.firebase || !config || !config.apiKey ||
            config.apiKey.indexOf('REPLACE_WITH_') === 0 ||
            !config.projectId || config.projectId.indexOf('REPLACE_WITH_') === 0 ||
            !config.appId || config.appId.indexOf('REPLACE_WITH_') === 0) {
        window.corebiqFirebaseError =
            'Firebase is not configured. Update public/firebase-config.js with your Firebase web app settings.';
        return;
    }

    if (!firebase.apps.length) {
        firebase.initializeApp(config);
    }
}());
