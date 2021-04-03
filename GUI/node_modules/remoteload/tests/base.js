const
    fs = require("fs"),
    util = require("util"),
    remoteload = require("../src/main.js"),
    _fsStat = util.promisify(fs.stat),
    CONSOLE_GREEN = "\x1b[32m",
    CONSOLE_RED = "\x1b[31m",
    CONSOLE_RESET = "\x1b[0m",
    INVALID_URL = "http://invalid.url.ca/invalid_file.123.bad",
    VALID_URL = "https://s3.amazonaws.com/cdn-origin-etr.akc.org/wp-content/uploads/2017/11/12225358/Pug-On-White-01.jpg",
    VALID_URL_2 = "https://img.dog-learn.com/dog-breeds/pug/pug-puppy-i14-sz6.jpg";

// FgGreen = "\x1b[32m"

// FgRed = "\x1b[31m"

// Reset \x1b[0m

//=============================================================================
function _validPrint() {
    console.log(`[${CONSOLE_GREEN}OK${CONSOLE_RESET}]`, ...Array.from(arguments));
}

//=============================================================================
function _errorPrint() {
    console.log(`[${CONSOLE_RED}FAIL${CONSOLE_RESET}]`, ...Array.from(arguments));
}

//=============================================================================
function _testInvalidLoadURLsData() {
    return new Promise(i_fnResolve => {
        // invalid URL test
        console.log("[-] testing loadURLsData on invalid URL");
        try {
            remoteload.loadURLsData([INVALID_URL])
                .then(i_aData => _errorPrint("Data Received unexpedted."))
                .catch(i_oError => _validPrint("Error reporting asserted:", i_oError))
                .then(i_fnResolve);
        } catch (i_oExp) {
            _errorPrint("Assertion failed", i_oExp);
            i_fnResolve();
        };
    });
}

//=============================================================================
function _testValidLoadURLSData() {
    return new Promise(i_fnResolve => {
        // valid URL data download test
        console.log("[-] testing loadURLsData on valid URL");
        try {
            remoteload.loadURLsData([VALID_URL])
                .then(i_aData => _validPrint("fetch data asserted ", i_aData[0].length))
                .catch(i_oError => _errorPrint("Assertion failed", i_oError))
                .then(i_fnResolve);
        } catch (i_oExp) {
            _errorPrint("Assertion failed: ", i_oExp);
            i_fnResolve();
        };
    });
}

//=============================================================================
function _testInvalidLoadURLs() {
    return new Promise(i_fnResolve => {
        console.log("[-] testing loadURLs on invalid URL");
        try {
            remoteload.loadURLs([INVALID_URL])
                .then(i_aData => _errorPrint("Data Received unexpedted."))
                .catch(i_oError => _validPrint("Error reporting asserted:", i_oError))
                .then(i_fnResolve);
        } catch (i_oExp) {
            _errorPrint("Assertion failed", i_oExp);
            i_fnResolve();
        };
    });
}

//=============================================================================
function _testValidLoadURLs() {
    return new Promise(i_fnResolve => {
        // valid URL data download test
        console.log("[-] testing loadURLs on valid URL");
        try {
            remoteload.loadURLs([VALID_URL])
                .then(i_sTmpFolder => _validPrint("loadURLs asserted to folder ", i_sTmpFolder))
                .catch(i_oError => _errorPrint("loadURLs Assertion failed", i_oError))
                .then(i_fnResolve);
        } catch (i_oExp) {
            _errorPrint("Assertion failed: ", i_oExp);
            i_fnResolve();
        };
    });
}

//=============================================================================
function _testMixedValidAndInvalidURLs() {
    return new Promise(i_fnResolve => {
        // valid URL data download test
        console.log("[-] testing loadURLs on a mix of valid and invalid URLs");
        try {
            remoteload.loadURLs([VALID_URL, INVALID_URL])
                .then(i_sTmpFolder => _errorPrint("Data Received unexpedted.", i_sTmpFolder))
                .catch(i_oError => _validPrint("Error reporting asserted:", i_oError))
                .then(i_fnResolve);
        } catch (i_oExp) {
            _errorPrint("Assertion failed: ", i_oExp);
            i_fnResolve();
        };
    });
}

//=============================================================================
function _testLoadURLsDataMaxChunksDisabled() {
    return new Promise(i_fnResolve => {
        // valid URL data download test
        console.log("[-] testing loadURLsData on valid URL");
        try {
            remoteload.loadURLsData([VALID_URL, VALID_URL_2], { maxChunkSize: -1})
                .then(i_aData => _validPrint("fetch data asserted ", i_aData[0].length))
                .catch(i_oError => _errorPrint("Assertion failed", i_oError))
                .then(i_fnResolve);
        } catch (i_oExp) {
            _errorPrint("Assertion failed: ", i_oExp);
            i_fnResolve();
        };
    });
}

//=============================================================================
function _testLoadURLsMaxChunksDisabled() {
    return new Promise(i_fnResolve => {
        // valid URL data download test
        console.log("[-] testing loadURLs on valid URL");
        try {
            remoteload.loadURLs([VALID_URL, VALID_URL_2])
                .then(i_sTmpFolder => _validPrint("loadURLs asserted to folder ", i_sTmpFolder))
                .catch(i_oError => _errorPrint("loadURLs Assertion failed", i_oError))
                .then(i_fnResolve);
        } catch (i_oExp) {
            _errorPrint("Assertion failed: ", i_oExp);
            i_fnResolve();
        };
    });
}


//=============================================================================
function _testValidCleanup(i_sFolder) {
    console.log("[-] testing cleanup ");
    remoteload.cleanup()
        .then(_assertRemovedFolders)
        .catch(i_aErrors => _validPrint("All temporary folders cleaned"));
}

//=============================================================================
function _assertRemovedFolders(i_aFolders) {
    let l_aPromises = i_aFolders.map((i_sFolder) => _fsStat(i_sFolder)); // can't put direct _fsStat reference here

    return Promise
        .all(l_aPromises);
}


//=============================================================================
// Testing code
//=============================================================================

_testInvalidLoadURLsData()
    .then(_testValidLoadURLSData)
    .then(_testInvalidLoadURLs)
    .then(_testValidLoadURLs)
    .then(_testMixedValidAndInvalidURLs)
    .then(_testLoadURLsDataMaxChunksDisabled)
    .then(_testLoadURLsMaxChunksDisabled)
    .then(_testValidCleanup)