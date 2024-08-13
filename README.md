# GitHub PR Size Labeler

This plugin labels GitHub pull requests based on the number of lines changed.

## Prerequisites

- A GitHub token with repo access

## Example

```bash
docker run --rm \
  -e PLUGIN_GITHUB_TOKEN=<YOUR_GITHUB_TOKEN> \ 
  -e PLUGIN_PR_NUMBER=7 \ 
  -e PLUGIN_GITHUB_OWNER=<org> \
  -e PLUGIN_GITHUB_REPO=<repository> \ 
  parraletz/pr-sizer:latest
```


### Licencse

This project is licensed under the MIT License.