import * as core from '@actions/core'
import * as github from '@actions/github'
import { Octokit } from '@octokit/rest'

async function run() {
  try {
    const githubToken = core.getInput("github_token") || process.env.GITHUB_TOKEN || ''
    const octokit = new Octokit({ auth: githubToken })

    const context = github.context
    const { repo, owner } = context.repo
    const prNumber = context.payload.pull_request?.number || context.issue.number

    core.info(`Fetching PR #${prNumber} from ${owner}/${repo}...`)

    const { data: pr } = await octokit.pulls.get({
      owner,
      repo,
      pull_number: Number(prNumber)
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
      issue_number: Number(prNumber),
      labels: [label]
    })

    core.info(`Successfully added label: ${label}`)
  } catch (error) {
    core.setFailed(`Failed to label the PR: ${(error as Error).message}`)
  }
}

run()
