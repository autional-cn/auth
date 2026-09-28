/** GENERATED FILE — DO NOT EDIT. Source: tokens/tokens.json · Regenerate: pnpm gen · v0.1.0-rc
 *
 * antd v5/v6 ThemeConfig bridge (ESM). Usage:
 *   import antdTheme from '@autional-cn/tailwind-preset/antd-theme.mjs';
 *   <ConfigProvider theme={{ algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
 *                            token: (isDark ? antdTheme.dark : antdTheme.light).token }}>
 *
 * 由 pnpm sync:consumers 下发到各站点的 packages/tailwind-preset/。
 * 控制台不得再手写这些色值——手写会让令牌变更无法传导，各 portal 各自漂移（KI-011）。
 */
const antdTheme = {
  light: { token: {
    colorPrimary: '#003153',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#1890ff',
    colorBgContainer: '#ffffff',
    colorBgElevated: '#ffffff',
    colorText: '#041d31',
    borderRadius: 8,
    fontFamily: "Inter, -apple-system, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', 'Noto Sans CJK SC', sans-serif"
  } },
  dark: { token: {
    colorPrimary: '#003153',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#1890ff',
    colorBgContainer: '#0a2940',
    colorBgElevated: '#0f3348',
    colorText: '#f8fbfe',
    borderRadius: 8,
    fontFamily: "Inter, -apple-system, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', 'Noto Sans CJK SC', sans-serif"
  } },
};
export default antdTheme;
export const light = antdTheme.light;
export const dark = antdTheme.dark;
