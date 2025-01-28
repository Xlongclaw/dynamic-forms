export const normalToSnakeOrDash = (
    input: string,
    separator: "_" | "-" = "_"
  ): string => {
    return input
      .toLowerCase() // Convert the string to lowercase
      .trim() // Remove leading/trailing spaces
      .replace(/\s+/g, separator); // Replace spaces with the specified separator
  };
  