// Create a function to introduce a delay
export const delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
