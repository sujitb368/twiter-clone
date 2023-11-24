// File and directory path handling
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Get the current module's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Export the directory name
export { __dirname };
