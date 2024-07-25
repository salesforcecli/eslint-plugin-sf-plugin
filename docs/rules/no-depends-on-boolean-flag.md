# Do not allow flags to depend on boolean flags (`sf-plugin/no-depends-on-boolean-flag`)

⚠️ This rule _warns_ in the following configs: ✈️ `migration`, ✅ `recommended`.

<!-- end auto-generated rule header -->

Flags depending on other boolean flags via `dependsOn` can cause unexpected behaviors:

```ts
// src/commands/data/query.ts

export class DataSoqlQueryCommand extends SfCommand<unknown> {
  public static readonly flags = {
    query: Flags.string({
      char: 'q',
      summary: messages.getMessage('flags.query.summary'),
    }),
    bulk: Flags.boolean({
      char: 'b',
      default: false,
      summary: messages.getMessage('flags.bulk.summary'),
    }),
    wait: Flags.duration({
      unit: 'minutes',
      char: 'w',
      summary: messages.getMessage('flags.wait.summary'),
      dependsOn: ['bulk'],
    }) 
  }
}
```

This code is supposed to only allow `--wait` to be used when `--bulk` was provided. 

However, because `--bulk` has a default value of `false`, oclif's flag parser will allow `--wait` even without passing in `--bulk` because the `wait.dependsOn` check only ensures that `bulk` has a value, so the following execution would be allowed:

```
sf data query -q 'select name,id from account limit 1' --wait 10
```

But even if `--bulk` didn't have a default value, it could still allow a wrong combination if it had `allowNo: true`: 

```ts
bulk: Flags.boolean({
  char: 'b',
  default: false,
  summary: messages.getMessage('flags.bulk.summary'),
  allowNo: true // Support reversible boolean flag with `--no-` prefix (e.g. `--no-bulk`).
}),
```

The following example would still run because `--no-bulk` sets `bulk` value to `false`:

```
sf data query -q 'select name,id from account limit 1' --wait 10 --no-bulk
```

If the desired behavior is to only allow a flag when another boolean flag was provided you should use oclif's relationships feature to verify the boolean flag value is `true`:

```ts
bulk: Flags.boolean({
  char: 'b',
  default: false,
  summary: messages.getMessage('flags.bulk.summary'),
  allowNo: true // Support reversible boolean flag with `--no-` prefix (e.g. `--no-bulk`).
}),
wait: Flags.duration({
  unit: 'minutes',
  char: 'w',
  summary: messages.getMessage('flags.wait.summary'),
  relationships: [
    {
      type: 'some',
      // eslint-disable-next-line @typescript-eslint/require-await
      flags: [{ name: 'bulk', when: async (flags): Promise<boolean> => Promise.resolve(flags['bulk'] === true) }],
    },
  ]
}) 
```

See: https://oclif.io/docs/flags
