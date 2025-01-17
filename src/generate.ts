import { request } from 'https'
import fs from 'fs'

export interface Repo {
  name: string
  full_name: string
  topics: string[]
  private: boolean
  archived: boolean
  fork: boolean
  homepage?: string
  html_url: string
  description: string
}

const escapeMap: { [key: string]: string } = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  "'": '&#39;',
  '"': '&#quot;'
}

export function escape(str: string): string {
  let newStr = ''
  for (const char of str) newStr += char in escapeMap ? escapeMap[char] : char
  return newStr
}

export function json(url: string): Promise<Repo[]> {
  return new Promise((resolve, reject) => {
    if (!process.env['GITHUB_TOKEN']) {
      return reject(new Error('GITHUB_TOKEN is not defined'))
    }

    const req = request(
      url,
      {
        headers: {
          'User-Agent': `nodejs ${process.version}`,
          Authorization: `Bearer ${process.env['GITHUB_TOKEN']}`,
          Accept: 'application/vnd.github.mercy-preview+json'
        }
      },
      async (res) => {
        res.on('error', reject)
        let body = ''
        for await (const chunk of res) {
          body += chunk
        }
        resolve(JSON.parse(body))
      }
    )
    req.on('error', reject)
    req.end()
  })
}

export async function* getRepos(excludes: string[] = []): AsyncGenerator<Repo> {
  for (let page = 1; page < 1000; page += 1) {
    const repos: Repo[] = await json(
      `https://api.github.com/orgs/hugo-fixit/repos?type=public&per_page=100&page=${page}`
    )
    if (!repos.length) return
    for (const repo of repos) {
      if (!repo.topics) continue
      if (repo.private) continue
      if (repo.archived) continue
      if (repo.fork) continue
      if (!repo.topics.includes('theme-component')) continue
      if (repo.name === 'component-skeleton') continue
      if (excludes.includes(repo.name)) continue
      yield repo
    }
  }
}

/**
 * Write components to the README files.
 * @param repos The list of repos.
 * @param readmePath The path of the README file (Comma separated paths of the readme files). default is './README.md'
 * @param commentTagName The tag name of the comment. default is 'HUGO_FIXIT_COMPONENTS'
 * @param template The template of the component list. default is '- [{$repo.name}]({$repo.html_url}): {$repo.description}'
 */
export async function writeReadmes(
  repos: Repo[],
  readmePath: string,
  commentTagName: string,
  template: string
): Promise<void> {
  // generate components
  const components: string[] = []
  for (const repo of repos) {
    components.push(
      template.replace(/\{\$repo\.(\w+)\}/g, (_, key) => {
        return escape(String(repo[key as keyof Repo] || ''))
      })
    )
  }
  const start = `<!-- ${commentTagName}:START -->`
  const end = `<!-- ${commentTagName}:END -->`
  const readmePaths: string[] = readmePath.split(',')
  // read and write README
  for (const path of readmePaths) {
    const readmeContent = fs.readFileSync(path, 'utf8')
    const startIndex = readmeContent.indexOf(start) + start.length
    const endIndex = readmeContent.indexOf(end)
    if (startIndex === -1 || endIndex === -1) continue
    const newReadmeContent = `${readmeContent.slice(0, startIndex)}\n${components.join('\n')}\n${readmeContent.slice(endIndex)}`
    fs.writeFileSync(path, newReadmeContent)
  }
}
