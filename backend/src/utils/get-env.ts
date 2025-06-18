export const getEnv = (key: string, defaultValue: string = "") => {
  console.log(`[getEnv] Attempting to get env var: ${key}, Default: ${defaultValue}`);
  const value = process.env[key];
  if (value === undefined) {
    console.log(`[getEnv] Env var ${key} is undefined. Using default value: ${defaultValue}`);
    if (defaultValue) {
      return defaultValue;
    }
    throw new Error(`Environment variable ${key} is not set`);
  }
  console.log(`[getEnv] Env var ${key} found. Value: ${value}`);
  return value;
};
