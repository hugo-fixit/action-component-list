export interface Repo {
    name: string;
    full_name: string;
    topics: string[];
    private: boolean;
    archived: boolean;
    fork: boolean;
    homepage?: string;
    html_url: string;
    description: string;
}
export declare function escape(str: string): string;
export declare function json(url: string): Promise<Repo[]>;
export declare function getRepos(excludes?: string[]): AsyncGenerator<Repo>;
/**
 * Write components to the README files.
 * @param repos The list of repos.
 * @param readmePath The path of the README file (Comma separated paths of the readme files). default is './README.md'
 * @param commentTagName The tag name of the comment. default is 'HUGO_FIXIT_COMPONENTS'
 * @param template The template of the component list. default is '- [{$repo.name}]({$repo.html_url}): {$repo.description}'
 */
export declare function writeReadmes(repos: Repo[], readmePath: string, commentTagName: string, template: string): Promise<void>;
