
Use this plugin for label your Github Pull Request depending of lines modified, deleted


## Example

```yaml
kind: pipeline
name: default

steps:
- name: label-pr-size
  image: parraletz/pr-sizer:latest
  settings:
    github_token:
      from_secret: github_token
	pr_number: 8
	owner: parralez
	repo: pr-sizer
trigger:
	event:
	- pull_request
	action:
	- opened
```

## Properties

| Setting | Type | Example |
| ------ | ----------- | ---- |
| `github_token` (**required**) | String | `gh_token` |
| `org` (**required**) | Github user or org | `parraletz` |
| `repo` (**required**) | Github Repo | `pr-sizer` |
| `pr_number` (**required**) | Pull Request Number| `8` |

