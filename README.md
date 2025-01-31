# GitHub PR Size Labeler

This plugin labels GitHub pull requests based on the number of lines changed.


## Drone Plugin

### Prerequisites

- A GitHub token with repo access

### Example

```bash
docker run --rm \
  -e PLUGIN_GITHUB_TOKEN=<YOUR_GITHUB_TOKEN> \ 
  -e PLUGIN_PR_NUMBER=7 \ 
  -e PLUGIN_GITHUB_OWNER=<org> \
  -e PLUGIN_GITHUB_REPO=<repository> \ 
  parraletz/pr-sizer:latest
```

## GitHub Action

### Prerequisites

- A GitHub token with repo access

### Example

```yaml
name: "Label PR by Size"

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  label-pr:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Label PR based on size
        uses: parraletz/pr-size-labeler@v1
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          pr_number: ${{ github.event.pull_request.number }}
          repo_owner: ${{ github.repository_owner }}
          repo_name: ${{ github.event.repository.name }}

```

### Licencse

This project is licensed under the MIT License.