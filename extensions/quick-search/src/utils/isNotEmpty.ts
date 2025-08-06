
export const isNotEmpty = (string: string | null | undefined): string is string => {
  return string != null && String(string).trim().length > 0;
};
