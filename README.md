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

`yarn add @salesforce/sf-plugins-core`
`yarn add --dev eslint-plugin-sf-plugin`

[`migration` includes all of the `recommended` rules, so you don't have to include both]

```js
module.exports = {
  extends: ['eslint-config-salesforce-typescript', 'eslint-config-salesforce-license', 'plugin:sf-plugin/migration'],
};
```

## Add new rules

Use <https://astexplorer.net/> and choose `@typescript/eslint-parser` from the `</>` dropdown.

This'll give you the AST as the parser sees it.

Copy/paste your TS code in the left panel to see the AST in the right.

- basics of eslint rules: <https://eslint.org/docs/developer-guide/working-with-rules>
- ts-specific stuff: <https://typescript-eslint.io/docs/development/custom-rules/>

Useful post

- <https://medium.com/bigpicture-one/writing-custom-typescript-eslint-rules-with-unit-tests-for-angular-project-f004482551db>

Be sure to import/export your rule from index.ts, and add it the configs section with your recommended setting.

# Testing

## unit testing

`yarn test:watch`. It's easiest to clone an existing test and modify it.

You can write code examples of what's valid/invalid and the errors that invalid code should return.

## exploratory testing/development using a real local sf plugin

To begin, and each time you make a change to the eslint-plugin,

```bash
# in eslint-plugin-sf-plugin
yarn build
```

```bash
# in your sf plugin
yarn add --dev file:/absolute/path/to/eslint-plugin-sf-plugin
```

include in the plugin's `eslint.rc`

```js
module.exports = {
  <whatever was already present>
  plugins: ['sf-plugin'],
  // add any or all rules you need to test with
  rules: {
    "sf-plugin/flag-case": "error",
  }
}
```
