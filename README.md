TypeScripts 

This project is an Advanced TypeScript demonstration application. It showcases core TypeScript features like interfaces, type aliases, generics, type narrowing, and utility types using a simulated student course management system.

Defined Interfaces & Types

All models and custom types are defined in [types/index.ts](file:///c:/Users/Acer/Documents/toby/ITELEC/ITELEC4/itelect4-project/types/index.ts):

*   **User**: Represents user profile information.
*   **Course**: Represents course subject details.
*   **Submission**: Represents assignment submissions.
*   **ID** & **StringOrNumber**: Union types for flexible parameters.
*   **Coordinate**: 2D coordinate structure.
*   **Formatter**: Formatting function signature.
*   **Status**: Status literals (`"pending" | "active" | "inactive"`).
*   **StudentWithCourse**: Intersection type combining User details and Course GPA.
*   **ApiResponse<T>**: Generic interface for standardized API responses.
*   **Utility Types**: `UserUpdate` (Partial), `UserPreview` (Pick), `PublicUser` (Omit), `RoleCount` (Record).

Setup & Running

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the application**:
   ```bash
   npx ts-node src/index.ts
   ```
