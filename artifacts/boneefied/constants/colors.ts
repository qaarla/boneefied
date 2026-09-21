/**
 * Semantic design tokens for the mobile app.
 *
 * These tokens mirror the naming conventions used in web artifacts (index.css)
 * so that multi-artifact projects share a cohesive visual identity.
 *
 * Replace the placeholder values below with values that match the project's
 * brand. If a sibling web artifact exists, read its index.css and convert the
 * HSL values to hex so both artifacts use the same palette.
 *
 * To add dark mode, add a `dark` key with the same token names.
 * The useColors() hook will automatically pick it up.
 */

const dark = {
  text: '#F6F1E9',
  tint: '#E87532',
  background: '#1E2226',
  foreground: '#F6F1E9',
  card: '#272D32',
  cardForeground: '#F6F1E9',
  primary: '#E87532',
  primaryForeground: '#1E2226',
  secondary: '#31383E',
  secondaryForeground: '#F6F1E9',
  muted: '#31383E',
  mutedForeground: '#AAB2B8',
  accent: '#3A4249',
  accentForeground: '#F6F1E9',
  destructive: '#D95C52',
  destructiveForeground: '#FFFFFF',
  success: '#4FA76B',
  successForeground: '#102418',
  border: '#3A4249',
  input: '#3A4249',
};

const light = {
  text: '#23272B',
  tint: '#C95618',
  background: '#FAF7F2',
  foreground: '#23272B',
  card: '#FFFFFF',
  cardForeground: '#23272B',
  primary: '#C95618',
  primaryForeground: '#FFFFFF',
  secondary: '#F3E9DF',
  secondaryForeground: '#23272B',
  muted: '#E7DDD3',
  mutedForeground: '#626A70',
  accent: '#F8D7C2',
  accentForeground: '#23272B',
  destructive: '#B83E35',
  destructiveForeground: '#FFFFFF',
  success: '#2F7D4A',
  successForeground: '#FFFFFF',
  border: '#D8CEC4',
  input: '#D8CEC4',
};

const colors = {
  light,
  dark,

  // Border radius (in px). Sync from the sibling web artifact's --radius
  // CSS variable. This value applies to cards, buttons, inputs, and modals.
  radius: 8,
};

export default colors;
