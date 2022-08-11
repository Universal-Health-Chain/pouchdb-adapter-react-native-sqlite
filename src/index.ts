'use strict'

import { WebSqlPouch } from '@universal-health-chain/pouchdb-adapter-websql-core';
var sqlite: any = null

function createOpenDBFunction (opts: any) {
  return function (name: any, version: any, description: any, size: any) {
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
    })
    function onError (err: any) {
      console.error(err)
      if (typeof opts.onError === 'function') {
        opts.onError(err)
      }
    }

    // The definite assignment assertion is a feature that allows a ! to be placed after instance property and variable declarations
    // to relay to TypeScript that a variable is indeed assigned for all intents and purposes, even if TypeScript's analyses cannot detect so.
    return sqlite!.openDatabase(openOpts.name, openOpts.version, openOpts.description, openOpts.size, null, onError)
  }
}

function ReactNativeSQLitePouch (opts: any, callback: any) {
  var websql = createOpenDBFunction(opts);
  var _opts = Object.assign({
    websql: websql
  }, opts);
  // @ts-ignore
  WebSqlPouch.call(this, _opts, callback);
}

ReactNativeSQLitePouch.valid = function () {
  // if you're using ReactNative, we assume you know what you're doing because you control the environment
  return true;
}

// no need for a prefix in ReactNative (i.e. no need for `_pouch_` prefix
ReactNativeSQLitePouch.use_prefix = false;

function reactNativeSqlitePlugin (PouchDB: any) {
  PouchDB.adapter('react-native-sqlite', ReactNativeSQLitePouch, true);
}

export function createPlugin (SQLite: any) {
  sqlite = SQLite;
  return reactNativeSqlitePlugin;
}