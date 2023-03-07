'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPlugin = void 0;
const pouchdb_adapter_websql_core_ts_1 = require("@universal-health-chain/pouchdb-adapter-websql-core-ts");
var sqlite = null;
function createOpenDBFunction(opts) {
    return function (name, version, description, size) {
        // The SQLite Plugin started deviating pretty heavily from the
        // standard openDatabase() function, as they started adding more features.
        // It's better to just use their "new" format and pass in a big ol'
        // options object. Also there are many options here that may come from
        // the PouchDB constructor, so we have to grab those.
        var openOpts = Object.assign({}, opts, {
            name: name,
            version: version,
            description: description,
            size: size
        });
        function onError(err) {
            console.error(err);
            if (typeof opts.onError === 'function') {
                opts.onError(err);
            }
        }
        // The definite assignment assertion is a feature that allows a ! to be placed after instance property and variable declarations
        // to relay to TypeScript that a variable is indeed assigned for all intents and purposes, even if TypeScript's analyses cannot detect so.
        return sqlite.openDatabase(openOpts.name, openOpts.version, openOpts.description, openOpts.size, null, onError);
    };
}
function ReactNativeSQLitePouch(opts, callback) {
    var websql = createOpenDBFunction(opts);
    var _opts = Object.assign({
        websql: websql
    }, opts);
    // @ts-ignore
    pouchdb_adapter_websql_core_ts_1.WebSqlPouch.call(this, _opts, callback);
}
ReactNativeSQLitePouch.valid = function () {
    // if you're using ReactNative, we assume you know what you're doing because you control the environment
    return true;
};
// no need for a prefix in ReactNative (i.e. no need for `_pouch_` prefix
ReactNativeSQLitePouch.use_prefix = false;
function reactNativeSqlitePlugin(PouchDB) {
    PouchDB.adapter('react-native-sqlite', ReactNativeSQLitePouch, true);
}
function createPlugin(SQLite) {
    sqlite = SQLite;
    return reactNativeSqlitePlugin;
}
exports.createPlugin = createPlugin;
