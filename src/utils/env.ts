/**
 * @param {string} key           Name of environment variable.
 * @param {string} default_value Default value (if not provided throws an error in the absence of the variable).
 * @returns {string}             The value of the environment variable
 */
export function env (key: string, default_value?: string): string {

  const value = process.env[key]

  if (typeof value === 'string') {
    return value
  }

  if (typeof default_value === 'string') {
    return default_value
  }

  throw new Error(`Missing required environment variable "${key}"`)

}
