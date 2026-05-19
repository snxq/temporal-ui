export const Namespace = 'data-encoder' as const;

export const Strings = {
  'codec-server': 'Codec Server',
  'endpoint-title': '此浏览器的 Codec Server 端点',
  'endpoint-description':
    '为此浏览器输入一个 Codec Server 端点。该设置将存储在你的浏览器中，并且只有你可以访问。',
  'endpoint-placeholder': '在此粘贴你的端点',
  'pass-access-token-label': '传递用户访问令牌',
  'include-cross-origin-credentials-label': '包含跨域凭证',
  'include-cross-origin-credentials-warning':
    '警告：将执行预检，这可能因配置不正确而导致解码失败。',
  'port-title': 'tctl plugin 端口 ',
  'port-info': '若两者都已设置，将使用 Codec Server 端点。',
  'access-token-https-error': '如果要传递访问令牌，端点必须为 https://',
  'prefix-error': '端点必须以 http:// 或 https:// 开头',
  'codec-server-description-prefix': '',
  'codec-server-description-suffix':
    ' 负责解码你的数据。Codec Server 端点可在 {{level}} 级别设置，也可在你的浏览器本地设置。',
  'browser-override-description':
    '使用我的浏览器设置并忽略 {{level}} 级别设置。',
  'no-browser-override-description': '尽可能使用 {{level}} 级别设置。',
  'override-radio-group-description':
    '选择你是否要在此浏览器中覆盖 {{level}} 设置。',
  'codec-server-configured': 'Codec Server 已配置',
  'codec-server-error': 'Codec Server 无法连接',
  'codec-server-success': 'Codec Server 已成功转换内容',
  'configure-codec-server': '配置 Codec Server',
  'encode-error': 'Codec Server 编码失败',
} as const;
