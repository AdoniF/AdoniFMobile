cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-geolocation/www/android/geolocation.js",
        "id": "cordova-plugin-geolocation.geolocation",
        "pluginId": "cordova-plugin-geolocation",
        "clobbers": [
            "navigator.geolocation"
        ]
    },
    {
        "file": "plugins/cordova-plugin-geolocation/www/PositionError.js",
        "id": "cordova-plugin-geolocation.PositionError",
        "pluginId": "cordova-plugin-geolocation",
        "runs": true
    },
    {
        "id": "nl.x-services.plugins.toast.Toast",
        "file": "plugins/nl.x-services.plugins.toast/www/Toast.js",
        "pluginId": "nl.x-services.plugins.toast",
        "clobbers": [
            "window.plugins.toast"
        ]
    },
    {
        "id": "nl.x-services.plugins.toast.tests",
        "file": "plugins/nl.x-services.plugins.toast/test/tests.js",
        "pluginId": "nl.x-services.plugins.toast"
    },
    {
        "id": "org.apache.cordova.file-transfer.FileTransferError",
        "file": "plugins/org.apache.cordova.file-transfer/www/FileTransferError.js",
        "pluginId": "org.apache.cordova.file-transfer",
        "clobbers": [
            "window.FileTransferError"
        ]
    },
    {
        "id": "org.apache.cordova.file-transfer.FileTransfer",
        "file": "plugins/org.apache.cordova.file-transfer/www/FileTransfer.js",
        "pluginId": "org.apache.cordova.file-transfer",
        "clobbers": [
            "window.FileTransfer"
        ]
    },
    {
        "id": "org.apache.cordova.camera.Camera",
        "file": "plugins/org.apache.cordova.camera/www/CameraConstants.js",
        "pluginId": "org.apache.cordova.camera",
        "clobbers": [
            "Camera"
        ]
    },
    {
        "id": "org.apache.cordova.camera.CameraPopoverOptions",
        "file": "plugins/org.apache.cordova.camera/www/CameraPopoverOptions.js",
        "pluginId": "org.apache.cordova.camera",
        "clobbers": [
            "CameraPopoverOptions"
        ]
    },
    {
        "id": "org.apache.cordova.camera.camera",
        "file": "plugins/org.apache.cordova.camera/www/Camera.js",
        "pluginId": "org.apache.cordova.camera",
        "clobbers": [
            "navigator.camera"
        ]
    },
    {
        "id": "org.apache.cordova.camera.CameraPopoverHandle",
        "file": "plugins/org.apache.cordova.camera/www/CameraPopoverHandle.js",
        "pluginId": "org.apache.cordova.camera",
        "clobbers": [
            "CameraPopoverHandle"
        ]
    },
    {
        "id": "org.apache.cordova.dialogs.notification",
        "file": "plugins/org.apache.cordova.dialogs/www/notification.js",
        "pluginId": "org.apache.cordova.dialogs",
        "merges": [
            "navigator.notification"
        ]
    },
    {
        "id": "org.apache.cordova.dialogs.notification_android",
        "file": "plugins/org.apache.cordova.dialogs/www/android/notification.js",
        "pluginId": "org.apache.cordova.dialogs",
        "merges": [
            "navigator.notification"
        ]
    },
    {
        "id": "cordova-plugin-splashscreen.SplashScreen",
        "file": "plugins/cordova-plugin-splashscreen/www/splashscreen.js",
        "pluginId": "cordova-plugin-splashscreen",
        "clobbers": [
            "navigator.splashscreen"
        ]
    },
    {
        "id": "org.devgeeks.Canvas2ImagePlugin.Canvas2ImagePlugin",
        "file": "plugins/org.devgeeks.Canvas2ImagePlugin/www/Canvas2ImagePlugin.js",
        "pluginId": "org.devgeeks.Canvas2ImagePlugin",
        "clobbers": [
            "window.canvas2ImagePlugin"
        ]
    },
    {
        "id": "hu.dpal.phonegap.plugins.SpinnerDialog.SpinnerDialog",
        "file": "plugins/hu.dpal.phonegap.plugins.SpinnerDialog/www/spinner.js",
        "pluginId": "hu.dpal.phonegap.plugins.SpinnerDialog",
        "merges": [
            "window.plugins.spinnerDialog"
        ]
    },
    {
        "id": "cordova-sqlite-common.SQLitePlugin",
        "file": "plugins/cordova-sqlite-common/www/SQLitePlugin.js",
        "pluginId": "cordova-sqlite-common",
        "clobbers": [
            "SQLitePlugin"
        ]
    },
    {
        "id": "org.apache.cordova.file.DirectoryEntry",
        "file": "plugins/org.apache.cordova.file/www/DirectoryEntry.js",
        "pluginId": "org.apache.cordova.file",
        "clobbers": [
            "window.DirectoryEntry"
        ]
    },
    {
        "id": "org.apache.cordova.file.DirectoryReader",
        "file": "plugins/org.apache.cordova.file/www/DirectoryReader.js",
        "pluginId": "org.apache.cordova.file",
        "clobbers": [
            "window.DirectoryReader"
        ]
    },
    {
        "id": "org.apache.cordova.file.Entry",
        "file": "plugins/org.apache.cordova.file/www/Entry.js",
        "pluginId": "org.apache.cordova.file",
        "clobbers": [
            "window.Entry"
        ]
    },
    {
        "id": "org.apache.cordova.file.File",
        "file": "plugins/org.apache.cordova.file/www/File.js",
        "pluginId": "org.apache.cordova.file",
        "clobbers": [
            "window.File"
        ]
    },
    {
        "id": "org.apache.cordova.file.FileEntry",
        "file": "plugins/org.apache.cordova.file/www/FileEntry.js",
        "pluginId": "org.apache.cordova.file",
        "clobbers": [
            "window.FileEntry"
        ]
    },
    {
        "id": "org.apache.cordova.file.FileError",
        "file": "plugins/org.apache.cordova.file/www/FileError.js",
        "pluginId": "org.apache.cordova.file",
        "clobbers": [
            "window.FileError"
        ]
    },
    {
        "id": "org.apache.cordova.file.FileReader",
        "file": "plugins/org.apache.cordova.file/www/FileReader.js",
        "pluginId": "org.apache.cordova.file",
        "clobbers": [
            "window.FileReader"
        ]
    },
    {
        "id": "org.apache.cordova.file.FileSystem",
        "file": "plugins/org.apache.cordova.file/www/FileSystem.js",
        "pluginId": "org.apache.cordova.file",
        "clobbers": [
            "window.FileSystem"
        ]
    },
    {
        "id": "org.apache.cordova.file.FileUploadOptions",
        "file": "plugins/org.apache.cordova.file/www/FileUploadOptions.js",
        "pluginId": "org.apache.cordova.file",
        "clobbers": [
            "window.FileUploadOptions"
        ]
    },
    {
        "id": "org.apache.cordova.file.FileUploadResult",
        "file": "plugins/org.apache.cordova.file/www/FileUploadResult.js",
        "pluginId": "org.apache.cordova.file",
        "clobbers": [
            "window.FileUploadResult"
        ]
    },
    {
        "id": "org.apache.cordova.file.FileWriter",
        "file": "plugins/org.apache.cordova.file/www/FileWriter.js",
        "pluginId": "org.apache.cordova.file",
        "clobbers": [
            "window.FileWriter"
        ]
    },
    {
        "id": "org.apache.cordova.file.Flags",
        "file": "plugins/org.apache.cordova.file/www/Flags.js",
        "pluginId": "org.apache.cordova.file",
        "clobbers": [
            "window.Flags"
        ]
    },
    {
        "id": "org.apache.cordova.file.LocalFileSystem",
        "file": "plugins/org.apache.cordova.file/www/LocalFileSystem.js",
        "pluginId": "org.apache.cordova.file",
        "clobbers": [
            "window.LocalFileSystem"
        ],
        "merges": [
            "window"
        ]
    },
    {
        "id": "org.apache.cordova.file.Metadata",
        "file": "plugins/org.apache.cordova.file/www/Metadata.js",
        "pluginId": "org.apache.cordova.file",
        "clobbers": [
            "window.Metadata"
        ]
    },
    {
        "id": "org.apache.cordova.file.ProgressEvent",
        "file": "plugins/org.apache.cordova.file/www/ProgressEvent.js",
        "pluginId": "org.apache.cordova.file",
        "clobbers": [
            "window.ProgressEvent"
        ]
    },
    {
        "id": "org.apache.cordova.file.fileSystems",
        "file": "plugins/org.apache.cordova.file/www/fileSystems.js",
        "pluginId": "org.apache.cordova.file"
    },
    {
        "id": "org.apache.cordova.file.requestFileSystem",
        "file": "plugins/org.apache.cordova.file/www/requestFileSystem.js",
        "pluginId": "org.apache.cordova.file",
        "clobbers": [
            "window.requestFileSystem"
        ]
    },
    {
        "id": "org.apache.cordova.file.resolveLocalFileSystemURI",
        "file": "plugins/org.apache.cordova.file/www/resolveLocalFileSystemURI.js",
        "pluginId": "org.apache.cordova.file",
        "merges": [
            "window"
        ]
    },
    {
        "id": "org.apache.cordova.file.androidFileSystem",
        "file": "plugins/org.apache.cordova.file/www/android/FileSystem.js",
        "pluginId": "org.apache.cordova.file",
        "merges": [
            "FileSystem"
        ]
    },
    {
        "id": "org.apache.cordova.file.fileSystems-roots",
        "file": "plugins/org.apache.cordova.file/www/fileSystems-roots.js",
        "pluginId": "org.apache.cordova.file",
        "runs": true
    },
    {
        "id": "org.apache.cordova.file.fileSystemPaths",
        "file": "plugins/org.apache.cordova.file/www/fileSystemPaths.js",
        "pluginId": "org.apache.cordova.file",
        "merges": [
            "cordova"
        ],
        "runs": true
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-toast": "1.0.1",
    "cordova-plugin-geolocation": "2.4.3",
    "cordova-plugin-compat": "1.1.0",
    "nl.x-services.plugins.toast": "2.0.4",
    "org.apache.cordova.file-transfer": "0.5.0",
    "org.apache.cordova.camera": "0.3.6",
    "org.apache.cordova.dialogs": "0.3.0",
    "cordova-plugin-splashscreen": "2.0.1-dev",
    "org.devgeeks.Canvas2ImagePlugin": "0.6.0",
    "hu.dpal.phonegap.plugins.SpinnerDialog": "1.3.1",
    "cordova-sqlite-common": "0.7.0-dev",
    "org.apache.cordova.file": "1.3.3"
};
// BOTTOM OF METADATA
});