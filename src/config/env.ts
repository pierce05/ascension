const parsePort = (value: string | undefined): number => {
  const parsed = Number(value);

  if (!value || Number.isNaN(parsed) || parsed <= 0) {
    return 4000;
  }

  return parsed;
};

const parseStateFilePath = (value: string | undefined): string | null => {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: parsePort(process.env.PORT),
  stateFilePath: parseStateFilePath(process.env.STATE_FILE_PATH),
} as const;
