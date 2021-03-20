# YAML file validation using a remote JSON schema

Validates a YAML file by converting it to JSON and validating it using a JSON schema retrieved from a remote API endpoint.

## Inputs

### `api-endpoint`

**Required** The HTTP API endpoint which returns the JSON schema.

### `yaml-file`

**Required** The name of the YAML file to validate.

## Example usage

```yaml
- name: YAML file validation
  uses: mpoc/nexus-validate-using-remote-schema-action@main
  with:
    api-endpoint: 'http://example.com/validate'
    yaml-file: assignment.yml
```
