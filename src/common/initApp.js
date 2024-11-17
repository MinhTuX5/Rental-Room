export function initApp() {
  // Add this function at the beginning of your file or in a separate utility file
  String.prototype.format = function (...args) {
    return this.replace(/{(\d+)}/g, (match, number) => {
      return typeof args[number] !== "undefined" ? args[number] : match;
    });
  };
}
