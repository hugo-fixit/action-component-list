import * as core from '@actions/core'
import { getRepos, writeReadmes, type Repo } from './generate.js'

/**
 * The main function for the action.
 *
 * @returns Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const commentTagName: string = core.getInput('comment_tag_name')
    const readmePath: string = core.getInput('readme_path')
    const excludeRepos: string[] = core.getInput('exclude_repos').split(',')
    const template: string = core.getInput('template')

    // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true
    if (core.isDebug()) {
      core.debug(`commentTagName: ${commentTagName}`)
      core.debug(`readmePath: ${readmePath}`)
    }

    // Get component repos
    const repos: Repo[] = []
    for await (const repo of getRepos(excludeRepos)) {
      repos.push(repo)
    }
    // Sort repos
    repos.sort((a: Repo, b: Repo): number =>
      a.name === 'fixit-bundle' ? -1 : a.name.localeCompare(b.name)
    )
    // Set outputs for other workflow steps to use
    core.setOutput('repos', JSON.stringify(repos))

    // Generate component list and write to README files
    await writeReadmes(repos, readmePath, commentTagName, template)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
