import * as core from '@actions/core'
import { Octokit } from '@octokit/rest'

async function run() {
  try {
    const githubToken = core.getInput('github_token', { required: true })
    const prNumber = core.getInput('pr_number', { required: true })

    const octokit = new Octokit({ auth: githubToken })

    const repo = core.getInput('repo', { required: true })
    const owner = core.getInput('owner', { required: true })

    core.info(`Fetching PR #${prNumber} from ${owner}/${repo}...`)

    const { data: pr } = await octokit.pulls.get({
      owner,
      repo,
      pull_number: prNumber
    })

    const changedLines = pr.additions + pr.deletions
    core.info(`Total changed lines: ${changedLines}`)

    let label = 'size/XS'
    if (changedLines >= 10) label = 'size/S'
    if (changedLines >= 30) label = 'size/M'
    if (changedLines >= 100) label = 'size/L'
    if (changedLines >= 500) label = 'size/XL'
    if (changedLines >= 1000) label = 'size/XXL'

    core.info(`Assigning label: ${label}`)

    await octokit.issues.addLabels({
      owner,
      repo,
      issue_number: prNumber,
      labels: [label]
    })

    core.info(`Successfully added label: ${label}`)
  } catch (error) {
    core.setFailed(`Failed to label the PR: ${(error as Error).message}`)
  }
}

run()
