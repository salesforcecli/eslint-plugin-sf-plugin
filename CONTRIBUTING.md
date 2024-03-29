# Development

## Add new rules

Use <https://astexplorer.net/> and choose `@typescript/eslint-parser` from the `</>` dropdown.

This'll give you the AST as the parser sees it.

Copy/paste your TS code in the left panel to see the AST in the right.

- basics of eslint rules: <https://eslint.org/docs/developer-guide/working-with-rules>
- ts-specific stuff: <https://typescript-eslint.io/docs/development/custom-rules/>

Useful post

- <https://medium.com/bigpicture-one/writing-custom-typescript-eslint-rules-with-unit-tests-for-angular-project-f004482551db>

Be sure to import/export your rule from index.ts, and add it the configs section with your recommended setting.

Create a doc for your new tests by running `yarn docs --init-rule-docs`

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

If you're using @salesforce/dev-scripts, add the plugin in your `.sfdevrc.json` file to keep dev-scripts from trying to enforce version minimums

```json
{
  "devDepOverrides": ["eslint-plugin-sf-plugin"]
}
```

To get changes in your IDE, restart the eslint server.

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
