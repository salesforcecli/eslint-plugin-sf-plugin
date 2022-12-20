# eslint-plugin-sf-plugin

Helpful eslint rules for sf plugins.

## Use these rules in a sf plugin

`yarn add --dev eslint-plugin-sf-plugin`

Then, in your plugin's `.eslintrc.js`, add `"plugin:sf-plugin/recommended"` to your `extends` property.

example:

```js
module.exports = {
  extends: ['eslint-config-salesforce-typescript', 'eslint-config-salesforce-license', 'plugin:sf-plugin/recommended'],
};
```

To override how an individual rules behaves, add the plugin name and change the its `rules` value.

```js
plugins: ['sf-plugin'],
rules: {
  'sf-plugin/no-hardcoded-messages': 'error'
}
```

## Use these rules to migrate a plugin based on sfdxCommand to use sfCommand

> These eslint rules are experimental and cause significant code changes. Please use with caution and test changes thoroughly

```shell
yarn add @salesforce/sf-plugins-core
yarn add --dev eslint-plugin-sf-plugin
```

[`migration` includes all of the `recommended` rules, so you don't have to include both]

```js
module.exports = {
  extends: ['eslint-config-salesforce-typescript', 'eslint-config-salesforce-license', 'plugin:sf-plugin/migration'],
};
```

## Rules

<!-- begin auto-generated rules list -->

💼 Configurations enabled in.\
⚠️ Configurations set to warn in.\
✅ Set in the `recommended` configuration.\
🔧 Automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/user-guide/command-line-interface#--fix).\
💡 Manually fixable by [editor suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

| Name                                                                           | Description                                                                                   | 💼                     | ⚠️                     | 🔧 | 💡 |
| :----------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------- | :--------------------- | :--------------------- | :- | :- |
| [command-example](docs/rules/command-example.md)                               | Ensure commands have a summary, description, and examples                                     |                        | ![badge-migration][] ✅ |    |    |
| [command-summary](docs/rules/command-summary.md)                               | Ensure commands have a summary                                                                | ![badge-migration][] ✅ |                        | 🔧 |    |
| [flag-case](docs/rules/flag-case.md)                                           | Enforce lowercase kebab-case flag names                                                       | ![badge-migration][] ✅ |                        | 🔧 |    |
| [flag-cross-references](docs/rules/flag-cross-references.md)                   | Enforce flag cross references for dependOn,exclusive,exactlyOne                               | ![badge-migration][] ✅ |                        |    |    |
| [flag-min-max-default](docs/rules/flag-min-max-default.md)                     | Enforce that flags with min/max values have a default value                                   |                        | ![badge-migration][] ✅ |    |    |
| [flag-summary](docs/rules/flag-summary.md)                                     | Enforce that flags have a summary property and that longDescription is renamed to description | ![badge-migration][] ✅ |                        | 🔧 |    |
| [get-connection-with-version](docs/rules/get-connection-with-version.md)       | Calls to getConnection should pass in a version                                               |                        | ![badge-migration][] ✅ |    |    |
| [json-flag](docs/rules/json-flag.md)                                           | do not allow creation of json flag                                                            | ![badge-migration][] ✅ |                        |    |    |
| [no-builtin-flags](docs/rules/no-builtin-flags.md)                             | Handling for sfdxCommand's flags.builtin                                                      | ![badge-migration][]   |                        | 🔧 |    |
| [no-deprecated-properties](docs/rules/no-deprecated-properties.md)             | Removes non-existent properties left over from SfdxCommand                                    | ![badge-migration][]   |                        | 🔧 |    |
| [no-duplicate-short-characters](docs/rules/no-duplicate-short-characters.md)   | Prevent duplicate use of short characters                                                     | ![badge-migration][] ✅ |                        |    |    |
| [no-h-short-char](docs/rules/no-h-short-char.md)                               | do not allow creation of a flag with short char -h                                            | ![badge-migration][] ✅ |                        |    |    |
| [no-hardcoded-messages-commands](docs/rules/no-hardcoded-messages-commands.md) | Use loaded messages and separate files for messages                                           |                        | ![badge-migration][] ✅ |    |    |
| [no-hardcoded-messages-flags](docs/rules/no-hardcoded-messages-flags.md)       | Use loaded messages and separate files for messages                                           |                        | ![badge-migration][] ✅ |    |    |
| [no-oclif-flags-command-import](docs/rules/no-oclif-flags-command-import.md)   | Change import of flags and Command from oclif to use sf-plugins-core                          | ![badge-migration][] ✅ |                        | 🔧 |    |
| [no-sfdx-command-import](docs/rules/no-sfdx-command-import.md)                 | Change import and base class from SfdxCommand to sfCommand                                    | ![badge-migration][]   |                        | 🔧 |    |
| [no-this-flags](docs/rules/no-this-flags.md)                                   | Fix references to this.org (property on SfdxCommand)                                          | ![badge-migration][]   |                        | 🔧 | 💡 |
| [no-this-org](docs/rules/no-this-org.md)                                       | Fix references to this.org (property on SfdxCommand)                                          | ![badge-migration][]   |                        | 🔧 | 💡 |
| [no-this-ux](docs/rules/no-this-ux.md)                                         | SfCommand does not have a ux property                                                         | ![badge-migration][]   |                        | 🔧 |    |
| [run-matches-class-type](docs/rules/run-matches-class-type.md)                 | The return type of the run method should match the Type passed to sfCommand                   | ![badge-migration][] ✅ |                        | 🔧 |    |
| [sfdx-flags-property](docs/rules/sfdx-flags-property.md)                       | Change flag definitions to SfCommand version                                                  | ![badge-migration][]   |                        | 🔧 |    |
| [should-parse-flags](docs/rules/should-parse-flags.md)                         | The run method should call this.parse when there are flags                                    | ![badge-migration][]   |                        | 🔧 |    |
| [use-sf-command-flags](docs/rules/use-sf-command-flags.md)                     | use Flags export from sf-plugins-core                                                         | ![badge-migration][]   |                        | 🔧 |    |

<!-- end auto-generated rules list -->
