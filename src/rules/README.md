# eslint-plugin-sf-plugin

Helpful eslint rules for sf plugins.

## Consume

`yarn add --dev eslint-plugin-sf-plugin`

in your `.eslintrc`, add `"plugin:sf-plugin/recommended"` to your`extends` property.  example:

```js
module.exports = {
  extends: ['eslint-config-salesforce-typescript', 'eslint-config-salesforce-license', "plugin:sf-plugin/recommended"],
}
```

## Developing

Use <https://astexplorer.net/> and choose `@typescript/eslint-parser` from the `</>` dropdown.  This'll give you the AST as the parser sees it.

copy/paste your TS code in the left panel to see the AST in the right.

* basics of eslint rules: <https://eslint.org/docs/developer-guide/working-with-rules>
* ts-specific stuff: <https://typescript-eslint.io/docs/development/custom-rules/>

useful posts

* <https://medium.com/bigpicture-one/writing-custom-typescript-eslint-rules-with-unit-tests-for-angular-project-f004482551db>

be sure to import/export your rule with index.ts and add it the configs sections

## Testing

`yarn test:watch`.  It's easiest to clone an existing test and modify it.

### exploratory testing/development with a real local sf plugin

from your sf plugin

```shell
# add to project
yarn add --dev file:/absolute/path/to/eslint-plugin-sf-plugin
```

include in your `eslint.rc`

```js
module.exports = {
  <whatever was already present>
  plugins: ['sf-plugin'],
    // add any or all rules you need to test with
    rules: {
      "sf-plugin/flag-case": "error",      
    }
}
