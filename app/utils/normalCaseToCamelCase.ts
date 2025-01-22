export const normalCaseToCamelCase = (input: string): string => {
    return input
      .toLowerCase() // Convert the entire string to lowercase
      .split(/[\s_]+/) // Split by spaces or underscores
      .map((word, index) =>
        index === 0
          ? word // Keep the first word lowercase
          : word.charAt(0).toUpperCase() + word.slice(1) // Capitalize the first letter of subsequent words
      )
      .join(""); // Join all words together
  };