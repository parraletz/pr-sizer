const { Octokit } = require('@octokit/rest')

const octokit = new Octokit({
  auth:
    process.env.GITHUB_TOKEN ||
    process.env.PLUGIN_GITHUB_TOKEN ||
    process.env.INPUT_GITHUB_TOKEN
})

const prNumber =
  process.env.PR_NUMBER ||
  process.env.PLUGIN_PR_NUMBER ||
  process.env.INPUT_PR_NUMBER

const remoteUrl =
  (process.env.CI_REMOTE_URL as string) ||
  (process.env.DRONE_REPO_LINK as string) ||
  (process.env.PLUGIN_REPO_LINK as string)

const repoMatch = remoteUrl.match(/github\.com\/([^\/]+)\/([^\/]+)(\.git)?$/)

const owner =
  (repoMatch && repoMatch[1]) ||
  process.env.PLUGIN_GITHUB_OWNER ||
  process.env.PLUGIN_OWNER ||
  process.env.GITHUB_OWNER

let repo =
  (repoMatch && repoMatch[2]) ||
  (process.env.PLUGIN_GITHUB_REPO as string) ||
  (process.env.PLUGIN_REPO as string) ||
  (process.env.GITHUB_REPO as string)

if (repo.endsWith('.git')) {
  repo = repo.slice(0, -4)
}

const commitSha = process.env.CI_COMMIT_SHA || process.env.DRONE_COMMIT_SHA
console.log(`PR number: ${prNumber}`)
console.log(commitSha)
console.log(`Owner: ${owner}`)
console.log(`Repo: ${repo}`)

async function getPRSize() {
  try {
    const { data: pr } = await octokit.pulls.get({
      owner,
      repo,
      pull_number: prNumber
    })

    const changedLines = pr.additions + pr.deletions

    console.log(`Total changed lines: ${changedLines}`)

    let label

    if (changedLines <= 10) {
      label = 'size/XS'
    } else if (changedLines <= 30) {
      label = 'size/S'
    } else if (changedLines <= 100) {
      label = 'size/M'
    } else if (changedLines <= 500) {
      label = 'size/L'
    } else if (changedLines <= 1000) {
      label = 'size/XL'
    } else {
      label = 'size/XXL'
    }

    await octokit.issues.addLabels({
      owner,
      repo,
      issue_number: prNumber,
      labels: [label]
    })

    console.log(`Label added: ${label}`)
  } catch (error) {
    console.error('Error labeling the PR:', error)
  }
}

getPRSize()
