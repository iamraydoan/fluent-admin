/**
 * List of available font names (visit the url `/settings/appearance`).
 * This array is used to generate dynamic font classes (e.g., `font-inter`, `font-manrope`).
 *
 * 📝 How to Add a New Font (plain CSS, Tailwind removed):
 * 1. Add the font name here.
 * 2. Update the `<link>` tag in 'index.html' to include the new font from Google Fonts (or any other source).
 * 3. Add the new font family to 'index.css' as a plain CSS rule, e.g.:
 *   html.font-roboto {
 *     font-family: 'Roboto', sans-serif;
 *   }
 */
export const fonts = ['inter', 'manrope', 'system'] as const
