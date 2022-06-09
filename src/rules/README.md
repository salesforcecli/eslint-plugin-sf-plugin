# eslint-plugin-sf-plugin

Helpful eslint rules for sf plugins.

## Developing

Use <https://astexplorer.net/> and choose `@typescript/eslint-parser` from the `</>` dropdown.  This'll give you the AST as the parser sees it.

copy/paste your TS code in the left panel to see the AST in the right.

* basics of eslint rules: <https://eslint.org/docs/developer-guide/working-with-rules>
* ts-specific stuff: <https://typescript-eslint.io/docs/development/custom-rules/>

useful posts

* <https://medium.com/bigpicture-one/writing-custom-typescript-eslint-rules-with-unit-tests-for-angular-project-f004482551db>

be sure to import/export your rule with index.ts

## Testing

`yarn test:watch`.  It's easiest to clone an existing test and modify it.

### to test in a real local project

from your other project

```shell
# add to project
yarn add --dev file:/absolute/path/to/eslint-plugin-sf-plugin
```

include in your `eslint.rc`

```js
module.exports = {
  <whatever was already present>
  plugins: ['sf-plugin'],
    rules: {
      "sf-plugin/no-duplicate-short-characters": "error",
      "sf-plugin/flag-case": "error",
      "sf-plugin/no-hardcoded-messages": "warn",
      "sf-plugin/flag-cross-references": "error",
    }
}
