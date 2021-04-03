const
    fs = require("fs"),
    path = require("path"),
    os = require("os"),
    https = require("https"),
    http = require("http"),
    url = require("url"),
    rimraf = require("rimraf"),
    DOWNLOAD_CHUNK_SIZE = 20, // 20 files per chunk
    CREATING_TEMP_DIR_STATE = 0,
    CREATING_TEMP_DIR_LABEL = "Creating Temporary directory",
    TEMP_DIR_CREATED_STATE = 1,
    TEMP_DIR_CREATED_LABEL = "Temporary directory created",
    WRITING_FILES_STATE = 2, // "Writting files",
    WRITING_FILES_LABEL = "Writting files",
    FILES_WRITTEN_STATE = 3,
    FILES_WRITTEN_LABEL = "Files written",
    FETCHING_FILES_STATE = 4, // "fetching files",
    FETCHING_FILES_LABEL = "Loading files",
    FILE_FETCHED_STATE = 5,
    FILE_FETCHED_LABEL = "file loaded";

// - create temp dir
//==============================================================================
function _createTempDirectory() {
    return new Promise((i_fnResolve, i_fnReject) => {
        fs.mkdtemp(path.join(os.tmpdir(), 'remoteLoad-'), (err, i_sFolder) => {
            if (err) {
                i_fnReject(err);
            }

            i_fnResolve(i_sFolder);
        });
    });
}

//==============================================================================
function _fetchFile(i_sURL) {
    let l_oPromise,
        l_oPrivateStore = g_oPrivateStore.get(this),
        {
            onProgress: l_fnOnProgress,
            nbURLsToLoad: l_nNbURLsToLoad
        } = l_oPrivateStore;

    l_oPromise = new Promise((i_fnResolve, i_fnReject) => _fetchFile_internal(i_sURL, i_fnResolve, i_fnReject))
        .finally(() => {
            l_oPrivateStore.nbURLsToLoaded++;
            l_fnOnProgress(FILE_FETCHED_STATE, {
                label: FILE_FETCHED_LABEL,
                url: i_sURL,
                nbLoaded: l_oPrivateStore.nbURLsToLoaded,
                total: l_nNbURLsToLoad
            });
        });

    return l_oPromise;
}

//==============================================================================
function _fetchFile_internal(i_sURL, i_fnResolve, i_fnReject) {
    let l_oRequest,
        l_oOptions = url.parse(i_sURL),
        l_fnRequestMethod;

    if (l_oOptions.protocol === "https:") {
        l_fnRequestMethod = https.request.bind(https);
    } else {
        l_fnRequestMethod = http.request.bind(http);
    }

    try {
        l_oRequest = l_fnRequestMethod(l_oOptions, (i_oResponse) => {
            if (i_oResponse.statusCode === 200) {
                let l_aBuffer = Buffer.from([]);

                i_oResponse.on('data', (i_xData) => {
                    l_aBuffer = Buffer.concat([l_aBuffer, i_xData]);
                });

                i_oResponse.on('end', () => {
                    i_fnResolve(l_aBuffer);
                });
            } else {
                i_fnReject("File not found " + i_sURL);
            }
        });

        l_oRequest.setTimeout(2000); // max 2 seconds per file ...still pretty slow
        // l_oRequest.setTimeout(500);

        l_oRequest.on('abort', i_oError => {
            i_fnReject(i_oError);
        });

        l_oRequest.on('timeout', () => {
            i_fnReject(new Error(`Timeout fetching ${i_sURL}.`));
        });

        l_oRequest.on('error', (i_oError) => {
            i_fnReject(i_oError);
        });

        l_oRequest.end();
    } catch (i_oError) {
        i_fnReject(i_oError);
    }

}

// - assert writing directories
//==============================================================================
function _assertWritingDirectories(i_sTmpFolder, i_aFileNames) {
    let l_oFolders = new Set();

    l_aDirNames = i_aFileNames.map(i_sFilePath => path.dirname(i_sFilePath));

    l_aDirNames.forEach(i_sRelPath => {
        // explode folders before creating them if missing
        _explodeRelativePath(i_sRelPath)
            .forEach(i_sFolderPath => {
                l_oFolders.add(path.join(i_sTmpFolder, i_sFolderPath));
            });
    });

    // need to write the directory sequentially, since some folders might be dependent on others
    return Array
        .from(l_oFolders)
        .sort()
        .reduce((i_pPromiseChain, i_sFolderToAssert) => i_pPromiseChain.then(() => _AssertDirectory(i_sFolderToAssert)), Promise.resolve([]));
}

//==============================================================================
function _AssertDirectory(i_sFolderName) {
    return new Promise(i_fnResolve => {
        fs.access(i_sFolderName, fs.constants.R_OK | fs.constants.W_OK, (i_oError) => {
            if (i_oError) {
                fs.mkdir(i_sFolderName, (err, data) => {
                    i_fnResolve();
                });
            } else {
                i_fnResolve();
            }
        });
    });
}

//==============================================================================
function _explodeRelativePath(i_sRelPath) {
    let l_sSeparator,
        l_aFolderSections;

    if (i_sRelPath.includes(path.sep)) {
        l_sSeparator = path.sep;
    } else {
        l_sSeparator = path.posix.sep;
    }

    l_aFolderSections = i_sRelPath
        .split(l_sSeparator)
        .filter(i_sPath => i_sPath);

    return l_aFolderSections.map(_explodeRelativePathSegment.bind(this, l_aFolderSections));
}

//==============================================================================
function _explodeRelativePathSegment(i_aFolderSections, i_sRelPath, i_nIdx) {
    let i,
        l_aSegments = [];

    if (i_nIdx > 0) {
        for (i = 0; i < i_nIdx; i++) {
            l_aSegments.push(i_aFolderSections[i])
        }
    }

    l_aSegments.push(i_sRelPath);

    return l_aSegments.join(path.sep);
}

// - write files
//==============================================================================
function _writeAllFiles(i_sFolder, i_aFileNames, i_aFileData) {
    let l_aWritePromises;

    l_aWritePromises = i_aFileNames.map((i_sRelPath, i_nIdx) => {
        let l_sFilePath = path.join(i_sFolder, i_sRelPath);
        return _writeFileData(l_sFilePath, i_aFileData[i_nIdx]);
    });

    return Promise.all(l_aWritePromises);
}

//==============================================================================
function _writeFileData(i_sFileName, i_xData) {
    return new Promise(i_fnResolve => {
        // make sure destination exists
        fs.writeFile(i_sFileName, i_xData, () => i_fnResolve(i_sFileName));
    });
}

//==============================================================================
function _onProgress(i_sType, i_oData) {
    let {
        progressFunc: l_fnProgressFunc
    } = g_oPrivateStore.get(this);

    if (l_fnProgressFunc) {
        l_fnProgressFunc(i_sType, i_oData);
    }
}

//==============================================================================
function _loadFiles(i_aURLs, i_oOptions) {
    let i,
        l_nChunkSize = i_oOptions.maxChunkSize || DOWNLOAD_CHUNK_SIZE,
        l_nURLLength,
        l_aChunks,
        l_aAllFileBuffers,
        l_oPromise,
        l_fnFetchFile = _fetchFile.bind(this),
        l_fnConcatChunks,
        l_fnReduceFunc;

    if (l_nChunkSize > 0) {
        l_nURLLength = i_aURLs.length;
        l_aChunks = [];
        l_aAllFileBuffers = [];
        l_fnConcatChunks = i_aChunkBuffers => {
            if (i_aChunkBuffers) {
                l_aAllFileBuffers.push(...i_aChunkBuffers);
            }
        };
        l_fnReduceFunc = (i_oPrevPromise, i_aCurrentChunk) => {
            return i_oPrevPromise
                .then(l_fnConcatChunks)
                .then(() => Promise.all(i_aCurrentChunk.map(l_fnFetchFile)))
        };
        // split into downloadable chunks
        for (i = 0; i < l_nURLLength; i += l_nChunkSize) {
            l_aChunks.push(i_aURLs.slice(i, i + l_nChunkSize));
        }

        // chain downloads of blocks to avoid timeouts / extra load on webserver
        l_oPromise = l_aChunks.reduce(l_fnReduceFunc, Promise.resolve());

        l_oPromise = l_oPromise
            .then((i_aChunkBuffers) => {
                l_fnConcatChunks(i_aChunkBuffers);
                return l_aAllFileBuffers;
            });
    } else {
        l_oPromise = Promise.all(i_aURLs.map(l_fnFetchFile))
    }

    return l_oPromise;
}

// private variables
let g_oTmpDirRegistry = new WeakMap(),
    g_oPrivateStore = new WeakMap();

//==============================================================================
class RemoteLoader { // or convert to "function" class to keep private variables ?
    //==========================================================================
    constructor() {
        g_oTmpDirRegistry.set(this, {
            tmpDirs: []
        });

        g_oPrivateStore.set(this, {});
    }

    /**
     * Fetches URLs and store their content as files within a temporary folder.
     * returns a promise which will receives the folder where files are stored as argument.
     */
    //==========================================================================
    loadURLs(i_aURLs, i_oOptions = {
        maxChunkSize: DOWNLOAD_CHUNK_SIZE
    }) {
        // @ this point we can safely assume we're in a nodejs environment
        let l_oPrivateStore = g_oPrivateStore.get(this),
            l_sTmpDir,
            l_aFileNames = i_aURLs.map(i_sURL => url.parse(i_sURL).path),
            l_fnOnProgress;

        l_oPrivateStore.progressFunc = typeof(i_oOptions.onProgress) === "function" && i_oOptions.onProgress;
        l_fnOnProgress = l_oPrivateStore.onProgress = _onProgress.bind(this);
        l_oPrivateStore.nbURLsToLoad = i_aURLs.length;
        l_oPrivateStore.nbURLsToLoaded = 0;

        l_fnOnProgress(CREATING_TEMP_DIR_STATE, {
            label: CREATING_TEMP_DIR_LABEL
        });
        return _createTempDirectory()
            // fetch all files
            .then(i_sTmpFolder => {
                l_fnOnProgress(TEMP_DIR_CREATED_STATE, {
                    label: TEMP_DIR_CREATED_LABEL
                });
                g_oTmpDirRegistry.get(this).tmpDirs.push(i_sTmpFolder);
                l_sTmpDir = i_sTmpFolder;

                l_fnOnProgress(FETCHING_FILES_STATE, {
                    label: FETCHING_FILES_LABEL
                });
                return _loadFiles.call(this, i_aURLs, i_oOptions);
            })
            // prepare dir for writing
            .then(i_aURLsData => {
                l_fnOnProgress(WRITING_FILES_STATE, {
                    label: WRITING_FILES_LABEL
                });
                return _assertWritingDirectories(l_sTmpDir, l_aFileNames)
                    .then(() => i_aURLsData)
            })
            // write all files
            .then(i_aURLsData => _writeAllFiles(l_sTmpDir, l_aFileNames, i_aURLsData))
            .then(() => {
                l_fnOnProgress(FILES_WRITTEN_STATE, {
                    label: FILES_WRITTEN_LABEL
                });
                return l_sTmpDir;
            });
    }

    /**
     * Fetches URLs and return their content as array of buffer objects.
     * returns a promise which will receives an array of Buffer objects containing the requested data based on the urls.
     */
    //==========================================================================
    loadURLsData(i_aURLs, i_oOptions = {
        maxChunkSize: DOWNLOAD_CHUNK_SIZE
    }) {
        let l_oPrivateStore = g_oPrivateStore.get(this),
            l_fnOnProgress;

        l_oPrivateStore.progressFunc = typeof(i_oOptions.onProgress) === "function" && i_oOptions.onProgress;
        l_fnOnProgress = l_oPrivateStore.onProgress = _onProgress.bind(this);
        l_oPrivateStore.nbURLsToLoad = i_aURLs.length;
        l_oPrivateStore.nbURLsToLoaded = 0;

        l_fnOnProgress(FETCHING_FILES_STATE, {
            label: FETCHING_FILES_LABEL
        });

        return _loadFiles.call(this, i_aURLs, i_oOptions);
    }

    /**
     * removes all created temp directories and their contents
     */
    //==========================================================================
    cleanup() {
        let l_oPrivateStore = g_oPrivateStore.get(this),
            l_aPromises = g_oTmpDirRegistry
            .get(this)
            .tmpDirs
            .map(i_sTmpDir => new Promise(i_fnResolve => rimraf(i_sTmpDir, () => i_fnResolve(i_sTmpDir))));

        l_oPrivateStore.progressFunc = null;
        l_oPrivateStore.onProgress = null;
        l_oPrivateStore.nbURLsToLoad = 0;
        l_oPrivateStore.nbURLsToLoaded = 0;

        return Promise.all(l_aPromises);
    }
}

module.exports = new RemoteLoader();