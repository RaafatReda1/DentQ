# Products Module Flow

This document explains the architectural flow, component relationships, state management, and conventions used within the Admin Products module (`src/components/Admin/Products_&_Catalogs/Products`).

## 1. Core Architecture

The `Products.jsx` file acts as the main entry point and container for the product management interface. It manages the global state for the module such as the current view mode, search queries, pagination, and the array of product models.

### State Context
- The products list data is fetched (or mocked) primarily at the `Products.jsx` level.
- `currentView`: Dictates whether the user sees the `GridView` or `TableView`.
- `selectedProduct`: Dictates which product is currently open in the `DetailPanel` (slide-over detail view).
- `editingProduct`: Indicates what is pre-filled inside the `ProductForm` component when in edit mode. When null, the form is empty for creation.
- Sub-components are strictly controlled (React controlled components) and rely heavily on callbacks like `onEdit`, `onDelete`, `onSave`, to push actions up to `Products.jsx`.

## 2. Component Ecosystem

The module's visual and functional breakdown includes:

### A. The Views (`GridView` & `TableView`)
- **Visual Swapper**: Controlled by `ViewSwitcher`, allowing the admin to jump between a highly visual grid (ideal for cataloging) and a dense table (ideal for data analysis).
- **`GridView`**: Renders `ProductCard` items. Good for seeing images, basic prices, and stock statuses at a glance.
- **`TableView`**: Renders `TableRow` items. Suitable for bulk scanning of IDs, numerical data, and flag statuses (active, trending, etc.).

### B. The Inspector (`DetailPanel`)
- A slide-over panel that opens without losing the context of the main list.
- Offers a deep-dive look at the product utilizing a `DetailList`.
- Triggers modifications directly by opening `ProductForm`.

### C. The Form (`ProductForm` & `Sections`)
- Due to the massive scope of creating products (images, dimensions, 2 languages, complex pricing equations), `ProductForm` leverages a modular architecture under `components/ProductForm/sections/`.
- **State Logic**: Calculates Sale Price and Profit margin *on the fly* whenever Cost, Original Price, or Discount percentages are updated.
- **Save Modes**: 
  - *Draft Mode*: Will save the status but force the `is_active` parameter to false.
  - *Publish Mode*: Standard saving protocol.
- **I18n (Internationalization)**: Employs `useTranslation` to toggle labels, but also specifically exposes separate Arabic (`nameAr`, `descAr`) and English (`nameEn`, `descEn`) fields for data-entry.

## 3. Form Sections Breakdown
The monolithic form was refactored into domain-driven sections:
- `BasicInfo`: Standard text and bilingual textareas.
- `PricingInventory`: Math-heavy fields triggering updates to price and profit values.
- `Organization`: Dropdowns for categories and dynamic `TagInput` components for arrays (Colors, Sizes).
- `MediaSection`: Interacts with `ImageUploader` to parse and store arrays of image paths/Blobs.
- `FlagsSection`: Manages boolean toggles (`is_trending`, `is_featured`).
- `DescriptionEditor`: Connects tightly with the `@uiw/react-md-editor` component for heavy markdown compilation.
- `ReviewDashboard`: The high-fidelity split-window component displaying Live LTR/RTL markdowns simultaneously.

## 4. Internationalization (i18n)

### UI Labels
Every piece of text inside the forms, tables, and buttons originates from `useTranslation()`. A helper `tp(key)` maps specifically to `t('admin.products.key')` to maintain short variable lookups inside JSX templates.

### Directional Context
When editing Arabic, properties like `dir="rtl"` and custom CSS classes (`.rtlMde`, `.rtlContent`) are selectively passed down to mimic natural alignment for Arabic authors entering the content. 
