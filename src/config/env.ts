const parsePort = (value: string | undefined): number => {
  const parsed = Number(value);

  if (!value || Number.isNaN(parsed) || parsed <= 0) {
    return 4000;
  }

  return parsed;
};

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: parsePort(process.env.PORT),
} as const;
