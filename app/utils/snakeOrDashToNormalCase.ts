export const snakeOrDashToNormalCase = (input: string): string => {
    return input
      .replace(/[_-]/g, " ") // Replace underscores or dashes with spaces
      .replace(/\b\w/g, (match) => match.toUpperCase()); // Capitalize the first letter of each word
  };
  