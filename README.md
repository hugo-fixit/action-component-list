# action-component-list | FixIt

[![GitHub Super-Linter](https://github.com/hugo-fixit/action-component-list/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/hugo-fixit/action-component-list/actions/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/hugo-fixit/action-component-list/actions/workflows/check-dist.yml/badge.svg)](https://github.com/hugo-fixit/action-component-list/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/hugo-fixit/action-component-list/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/hugo-fixit/action-component-list/actions/workflows/codeql-analysis.yml)
[![Coverage](./badges/coverage.svg)](./badges/coverage.svg)

This is a GitHub Action to generate a list of all hugo-fixit theme components.

## Usage

You can reference different stable versions of this action. For more
information, see
[Versioning](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md)
in the GitHub Actions toolkit.

To include the action in a workflow in another repository, you can use the
`uses` syntax with the `@` symbol to reference a specific branch, tag, or commit
hash.

```yaml
steps:
  - name: Checkout
    id: checkout
    uses: actions/checkout@v4

  - name: Test Local Action
    id: test-action
    uses: hugo-fixit/action-component-list@v1 # Commit with the `v1` tag
    with:
      milliseconds: 1000

  - name: Print Output
    id: output
    run: echo "${{ steps.test-action.outputs.time }}"
```
