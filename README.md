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
🚫 Configurations disabled in.\
📚 Set in the `library` configuration.\
✈️ Set in the `migration` configuration.\
✅ Set in the `recommended` configuration.\
🔧 Automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/user-guide/command-line-interface#--fix).\
💡 Manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

| Name                                                                                   | Description                                                                                                                      | 💼      | ⚠️   | 🚫      | 🔧 | 💡 |
| :------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------- | :------ | :--- | :------ | :- | :- |
| [command-example](docs/rules/command-example.md)                                       | Ensure commands have a summary, description, and examples                                                                        |         | ✈️ ✅ |         |    |    |
| [command-summary](docs/rules/command-summary.md)                                       | Ensure commands have a summary                                                                                                   | ✈️ ✅    |      |         | 🔧 |    |
| [dash-o](docs/rules/dash-o.md)                                                         | Warn on a flag that uses -o                                                                                                      |         | ✈️ ✅ |         |    |    |
| [encourage-alias-deprecation](docs/rules/encourage-alias-deprecation.md)               | Commands and flags aliases probably want to deprecate their old names to provide more warnings to users                          |         |      |         | 🔧 | 💡 |
| [esm-message-import](docs/rules/esm-message-import.md)                                 | Looks for the verbose `Messages.importMessagesDirectory(dirname(fileURLToPath(import.meta.url)))` to offer a simpler alternative | 📚 ✈️ ✅ |      |         | 🔧 |    |
| [flag-case](docs/rules/flag-case.md)                                                   | Enforce lowercase kebab-case flag names                                                                                          | ✈️ ✅    |      |         | 🔧 |    |
| [flag-cross-references](docs/rules/flag-cross-references.md)                           | Enforce flag cross references for dependOn,exclusive,exactlyOne                                                                  | ✈️ ✅    |      |         |    |    |
| [flag-min-max-default](docs/rules/flag-min-max-default.md)                             | Enforce that flags with min/max values have a default value                                                                      |         | ✈️ ✅ |         |    |    |
| [flag-summary](docs/rules/flag-summary.md)                                             | Enforce that flags have a summary property and that longDescription is renamed to description                                    | ✈️ ✅    |      |         | 🔧 |    |
| [get-connection-with-version](docs/rules/get-connection-with-version.md)               | Calls to getConnection should pass in a version                                                                                  |         | ✈️ ✅ |         |    |    |
| [id-flag-suggestions](docs/rules/id-flag-suggestions.md)                               | Create better salesforceId flags with length and startsWith properties                                                           |         | ✈️ ✅ |         | 🔧 | 💡 |
| [no-args-parse-without-strict-false](docs/rules/no-args-parse-without-strict-false.md) | If you parse args/argv, the class should have strict set to false                                                                | ✈️ ✅    |      |         | 🔧 |    |
| [no-builtin-flags](docs/rules/no-builtin-flags.md)                                     | Handling for sfdxCommand's flags.builtin                                                                                         | ✈️      |      |         | 🔧 |    |
| [no-classes-in-command-return-type](docs/rules/no-classes-in-command-return-type.md)   | The return type of the run method should not contain a class.                                                                    | ✈️ ✅    |      |         | 🔧 |    |
| [no-default-and-depends-on-flags](docs/rules/no-default-and-depends-on-flags.md)       | Do not allow creation of a flag with default value and dependsOn                                                                 | ✈️ ✅    |      |         |    |    |
| [no-depends-on-boolean-flag](docs/rules/no-depends-on-boolean-flag.md)                 | Do not allow flags to depend on boolean flags                                                                                    |         | ✈️ ✅ |         |    |    |
| [no-deprecated-properties](docs/rules/no-deprecated-properties.md)                     | Removes non-existent properties left over from SfdxCommand                                                                       | ✈️      |      |         | 🔧 |    |
| [no-duplicate-short-characters](docs/rules/no-duplicate-short-characters.md)           | Prevent duplicate use of short characters or conflicts between aliases and flags                                                 | ✈️ ✅    |      |         |    |    |
| [no-execcmd-double-quotes](docs/rules/no-execcmd-double-quotes.md)                     | Do not use double quotes in NUT examples.  They will not work on windows                                                         |         |      | 📚 ✈️ ✅ | 🔧 |    |
| [no-filepath-flags](docs/rules/no-filepath-flags.md)                                   | Change filepath flag to file flag                                                                                                |         |      |         | 🔧 |    |
| [no-h-short-char](docs/rules/no-h-short-char.md)                                       | Do not allow creation of a flag with short char -h                                                                               | ✈️ ✅    |      |         |    |    |
| [no-hardcoded-messages-commands](docs/rules/no-hardcoded-messages-commands.md)         | Use loaded messages and separate files for messages                                                                              |         | ✈️ ✅ |         |    |    |
| [no-hardcoded-messages-flags](docs/rules/no-hardcoded-messages-flags.md)               | Use loaded messages and separate files for messages.  Follow the message naming guidelines                                       |         | ✈️ ✅ |         | 🔧 |    |
| [no-hyphens-aliases](docs/rules/no-hyphens-aliases.md)                                 | Mark when an alias starts with a hyphen, like -f or --foo                                                                        | ✈️ ✅    |      |         | 🔧 |    |
| [no-id-flags](docs/rules/no-id-flags.md)                                               | Change Id flag to salesforceId                                                                                                   | ✈️      |      |         | 🔧 |    |
| [no-json-flag](docs/rules/no-json-flag.md)                                             | Do not allow creation of json flag                                                                                               | ✈️ ✅    |      |         |    |    |
| [no-messages-load](docs/rules/no-messages-load.md)                                     | Use Messages.loadMessages() instead of Messages.load()                                                                           | 📚 ✈️ ✅ |      |         | 🔧 |    |
| [no-missing-messages](docs/rules/no-missing-messages.md)                               | Checks core Messages usage for correct usage of named messages and message tokens                                                | 📚 ✈️ ✅ |      |         |    |    |
| [no-number-flags](docs/rules/no-number-flags.md)                                       | Change number flag to integer                                                                                                    |         |      |         | 🔧 |    |
| [no-oclif-flags-command-import](docs/rules/no-oclif-flags-command-import.md)           | Change import of flags and Command from oclif to use sf-plugins-core                                                             | ✈️ ✅    |      |         | 🔧 |    |
| [no-sfdx-command-import](docs/rules/no-sfdx-command-import.md)                         | Change import and base class from SfdxCommand to sfCommand                                                                       | ✈️      |      |         | 🔧 |    |
| [no-split-examples](docs/rules/no-split-examples.md)                                   | Arrays of messags should use getMessages instead of getMessage followed by EOL splitting                                         | ✈️ ✅    |      |         | 🔧 |    |
| [no-this-flags](docs/rules/no-this-flags.md)                                           | Fix references to this.org (property on SfdxCommand)                                                                             | ✈️      |      |         | 🔧 | 💡 |
| [no-this-org](docs/rules/no-this-org.md)                                               | Fix references to this.org (property on SfdxCommand)                                                                             | ✈️      |      |         | 🔧 | 💡 |
| [no-this-ux](docs/rules/no-this-ux.md)                                                 | SfCommand does not have a ux property                                                                                            | ✈️      |      |         | 🔧 |    |
| [no-time-flags](docs/rules/no-time-flags.md)                                           | Migrate time flags to Flags.duration                                                                                             | ✈️      |      |         | 🔧 |    |
| [no-unnecessary-aliases](docs/rules/no-unnecessary-aliases.md)                         | Mark when an alias is unnecessary because its only an order permutation, not really a different name                             | ✈️ ✅    |      |         | 🔧 |    |
| [no-unnecessary-properties](docs/rules/no-unnecessary-properties.md)                   | Boolean properties are false by default, so they should not be set to false                                                      |         | ✈️ ✅ |         | 🔧 |    |
| [no-username-properties](docs/rules/no-username-properties.md)                         | Convert requiresUsername and supportusername to username flags                                                                   | ✈️      |      |         | 🔧 |    |
| [only-extend-SfCommand](docs/rules/only-extend-SfCommand.md)                           | Only allow commands that directly extend SfCommand                                                                               |         | ✈️ ✅ |         |    |    |
| [read-only-properties](docs/rules/read-only-properties.md)                             | Class-level static properties, like flags or descriptions, should be marked public and read-only                                 |         | ✈️ ✅ |         | 🔧 |    |
| [run-matches-class-type](docs/rules/run-matches-class-type.md)                         | The return type of the run method should match the Type passed to sfCommand                                                      | ✈️ ✅    |      |         | 🔧 |    |
| [sfdx-flags-property](docs/rules/sfdx-flags-property.md)                               | Change flag definitions to SfCommand version                                                                                     | ✈️      |      |         | 🔧 |    |
| [should-parse-flags](docs/rules/should-parse-flags.md)                                 | The run method should call this.parse when there are flags                                                                       | ✈️      |      |         | 🔧 |    |
| [spread-base-flags](docs/rules/spread-base-flags.md)                                   | When not directly extending SfCommand, the parent's flags must be spread like flags = { ...{{parent}}.{{property}} }             | ✈️      | ✅    |         |    |    |
| [use-sf-command-flags](docs/rules/use-sf-command-flags.md)                             | Use Flags export from sf-plugins-core                                                                                            | ✈️      |      |         | 🔧 |    |

<!-- end auto-generated rules list -->
