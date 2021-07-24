export default function get(obj, path, defaultValue = undefined) {
    try {
      return path.split('.').reduce((o, key) => o[key], obj || {}) || defaultValue;
    } catch (e) {
      return defaultValue;
    }
  }
  