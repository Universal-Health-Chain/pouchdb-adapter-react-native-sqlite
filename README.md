![logo](https://avatars.githubusercontent.com/u/57396025?s=200&v=4)

# **@universal-health-chain/pouchdb-adapter-react-native-sqlite-ts (typescript)**

PouchDB adapter using ReactNative SQLite as its backing store.
Forked from https://github.com/craftzdog/pouchdb-adapter-react-native-sqlite, but using Typescript and `@universal-health-chain/pouchdb-adapter-websql-core-ts` (typescript).

## Why?

SQLite storage performs much faster than AsyncStorage, especially with secondary index.
Here is benchmark results:

| 1) `allDocs` speed | min  | max  | mean |
| ------------------ | ---- | ---- | ---- |
| AsyncStorage       | 72ms | 94ms | 77ms |
| SQLite             | 27ms | 39ms | 28ms |

| 2) `query` speed | min     | max     | mean    |
| ---------------- | ------- | ------- | ------- |
| AsyncStorage     | 1,075ms | 1,117ms | 1,092ms |
| SQLite           | 33ms    | 39ms    | 35ms    |

- Device: iPhone 6s
- Documents: 434
- Update seq: 453
- Iterations: 100
- Used options: `{ include_docs: true }`

### On Simulator

- Device: iPad Pro 9.7" (Simulator) - iOS 10.3.2
- Documents: 5000

| 3) `bulkDocs` speed | total    | mean   |
| ------------------- | -------- | ------ |
| AsyncStorage        | 25.821ms | 5.16ms |
| SQLite              | 22.213ms | 4.44ms |

| 4) `allDocs` speed | total     | mean    |
| ------------------ | --------- | ------- |
| AsyncStorage       | 189,379ms | 37.87ms |
| SQLite             | 30,527ms  | 6.10ms  |

- `allDocs` options: `{ include_docs: true, attachments: true }`
- Using this test [script](https://gist.github.com/hnq90/972f6597a0927f45d9075b8627892783)

## How to use it
*(based on https://dev.to/craftzdog/a-performant-way-to-use-pouchdb7-on-react-native-in-2022-24ej)*

1. Install these packages (use `expo install`, `npm i` or `yarn add`):
  + `expo install events react-native-get-random-values react-native-quick-base64`
  + `expo install pouchdb-core pouchdb-replication pouchdb-mapreduce`
  + `expo install pouchdb-adapter-http react-native-quick-sqlite`
2. Add the new UHC packages, refactored to typescript to solve both jest and import problems in web (for expo):
  + `expo install @universal-health-chain/pouchdb-adapter-react-native-sqlite-ts`
  + `expo install @universal-health-chain/react-native-quick-websql-ts`
3. Then:
  + `npx pod-install`x
4. Create the `shim.js` file (see the link) and import it in the first line in the index.js file of the project (as specified in the above link).
    ```js
    import {shim} from 'react-native-quick-base64'

    shim()

    // Avoid using node dependent modules
    process.browser = true
    ```
5. Edit your `babel.config.js` like so:
    ```js
    module.exports = {
      presets: ['module:metro-react-native-babel-preset'],
      plugins: [
        [
          'module-resolver',
          {
            alias: {
              'pouchdb-collate': '@craftzdog/pouchdb-collate-react-native',
            },
          },
        ],
      ],
    }
    ```
6. To initialize, create pouchdb.ts like so:
    ```js
    import 'react-native-get-random-values'

    // PouchDB required imports
    import PouchDB from 'pouchdb-core'
    import HttpPouch from 'pouchdb-adapter-http'
    import replication from 'pouchdb-replication'
    import mapreduce from 'pouchdb-mapreduce'

    // using PouchDB with the "@universal-health-chain" packages to avoid problems with web in expo
    import { createPlugin } from '@universal-health-chain/pouchdb-adapter-react-native-sqlite-ts'

    const dbConfigNative: PouchDB.Configuration.DatabaseConfiguration = {
      adapter: 'react-native-sqlite'
    };

    // you can check if the platform is "web" or not (native)
    export const db = await openPouchDBWithNativeAdapterSQLite("dbName", dbConfigNative);

    async function openPouchDBWithNativeAdapterSQLite(
      dbName: string,
      dbConfig: PouchDB.Configuration.DatabaseConfiguration
    ): Promise<PouchDB.Database> {

      // importing the class for react native
      const nativeSQLite = require('@universal-health-chain/react-native-quick-websql-ts');
      
      // instantiate the SQLite plugin for react native
      const pluginSQLite = new nativeSQLite.SQLitePlugin();
      
      // create the SQLite adapter with the plugin for react native
      const adapterSQLite = createPlugin(pluginSQLite);
      
      PouchDB.plugin(HttpPouch)
        .plugin(replication)
        .plugin(mapreduce)
        .plugin(adapterSQLite)

      // creating the database client (it opens/creates the database)
      const pouchDB = new PouchDB(dbName, dbConfig);
      return pouchDB
    };
    ```
7. Note - do not use these packages to avoid jest and web problems when importing them:
  - pouchdb-adapter-react-native-sqlite
  - react-native-quick-websql

## Changelog

- 3.0.1
  - Using [@universal-health-chain/pouchdb-adapter-websql-core-ts](https://www.npmjs.com/package/@universal-health-chain/pouchdb-adapter-websql-core-ts)
- 3.0.0
  - Use [@craftzdog/pouchdb-adapter-websql-core](https://github.com/craftzdog/pouchdb-adapter-websql-core) #11
- 2.0.0
  - Upgrade pouchdb-adapter-websql-core to 7.0.0
- 1.0.3
  - Remove `pouchdb-utils` dependency
- 1.0.2
  - Upgrade pouchdb-util & pouchdb-adapter-websql-core to 6.2.0
  - Update benchmark result
- 1.0.1
  - Remove unnecessary console output
- 1.0.0
  - Initial release
