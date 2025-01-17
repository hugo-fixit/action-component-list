# action-component-list | FixIt

[![GitHub Super-Linter](https://github.com/hugo-fixit/action-component-list/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/hugo-fixit/action-component-list/actions/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/hugo-fixit/action-component-list/actions/workflows/check-dist.yml/badge.svg)](https://github.com/hugo-fixit/action-component-list/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/hugo-fixit/action-component-list/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/hugo-fixit/action-component-list/actions/workflows/codeql-analysis.yml)

This is a GitHub Action to generate a list of all hugo-fixit theme components.

## How to use

You can reference different stable versions of this action. For more
information, see
[Versioning](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md)
in the GitHub Actions toolkit.

To include the action in a workflow in another repository, you can use the
`uses` syntax with the `@` symbol to reference a specific branch, tag, or commit
hash.

1. Star this repository 😉
2. Go to your repository
3. Add the following section to your **README.md** file, you can give whatever
   title you want. Just make sure that you use
   `<!-- HUGO_FIXIT_COMPONENTS:START --><!-- HUGO_FIXIT_COMPONENTS:END -->` in
   your readme. The workflow will replace this comment with the actual blog post
   list:

   ```markdown
   # Hugo FixIt Components

   <!-- HUGO_FIXIT_COMPONENTS:START -->
   <!-- HUGO_FIXIT_COMPONENTS:END -->
   ```

4. Create a folder named `.github` and create a `workflows` folder inside it, if
   it doesn't exist.
5. Create a new file named `fixit-component-list.yml` with the following
   contents inside the workflows folder:

   ```yaml
   name: Generate hugo-fixit component list
   on:
     schedule: # Run workflow automatically
       - cron: '0 0 * * *' # Runs every day at 00:00 UTC
     workflow_dispatch: # Run workflow manually (without waiting for the cron to be called), through the GitHub Actions Workflow page directly
   permissions:
     contents: write # To write the generated contents to the readme

   jobs:
     generate-component-list:
       name:
         Update this repo's README with the list of hugo-fixit theme components
       runs-on: ubuntu-latest
       steps:
         - name: Checkout
           uses: actions/checkout@v4
         - name: Generate hugo-fixit component list
           id: test-action
           uses: hugo-fixit/action-component-list@v1
           env:
             GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
           with:
             comment_tag_name: HUGO_FIXIT_COMPONENTS
             template: '- [{$repo.name}]({$repo.html_url}): {$repo.description}'
         - name: Print Output
           id: output
           run: echo "${{ steps.test-action.outputs.repos }}"
         - name: Commit changes
           uses: stefanzweifel/git-auto-commit-action@v5
           with:
             commit_message: 'Docs: update hugo-fixit component list'
             commit_author:
               'github-actions[bot]
               <github-actions[bot]@users.noreply.github.com>'
   ```

6. Go to repository settings, Click on Actions > General. Update the "Workflow
   permissions" to "Read and write permissions". Click on save.
7. Wait for it to run automatically, or you can also trigger it manually to see
   the result instantly.

## Inputs

| Name               | Description                                                                                                           | Default                                                   |
| :----------------- | :-------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------- |
| `comment_tag_name` | The tag name to look for in the readme file                                                                           | `HUGO_FIXIT_COMPONENTS`                                   |
| `readme_path`      | Comma separated paths of the readme files you want to update                                                          | `./README.md`                                             |
| `exclude_repos`    | Comma separated list of repos to exclude from the list                                                                |                                                           |
| `template`         | Template to use while creating the list of hugo-fixit theme components. It can contain {$repo.name} etc. as variables | `- [{$repo.name}]({$repo.html_url}): {$repo.description}` |

## Outputs

| Name    | Description                                                      |
| :------ | :--------------------------------------------------------------- |
| `repos` | The list of hugo-fixit theme components repos that were updated. |

## Example

Insert the following code block in your Markdown file to display the list of
hugo-fixit components.

```md
The list of hugo-fixit components will be displayed here.

<!-- HUGO_FIXIT_COMPONENTS:START -->
<!-- HUGO_FIXIT_COMPONENTS:END -->
```

The list of hugo-fixit components will be displayed here.

<!-- FIXIT_COMPONENTS:START -->

<!-- FIXIT_COMPONENTS:END -->
