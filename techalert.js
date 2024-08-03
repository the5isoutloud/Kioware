function runBatchFile() {
    try {
        var shell = new ActiveXObject("WScript.Shell");
        shell.Run("C:\Users\\User\\Desktop\\Kioware\\launchZoom.bat", 1, false);
    } catch (e) {
        alert("Error: " + e.message);
    }
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'F9') {
        runBatchFile();
    }
});