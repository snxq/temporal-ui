export const Namespace = 'codec-server';

export const Strings = {
  title: 'Codec Server',
  description: '通过远程端点解码你的数据。',
  'info-message':
    '用户可以使用此命名空间 Namespace 级别的 codec server 端点，也可以在浏览器中用其他端点覆盖它。',
  'endpoint-description-prefix': '输入一个',
  'endpoint-link-text': 'Codec Server 端点',
  'endpoint-description-suffix':
    '，为与此命名空间 Namespace 交互的用户解码 Payload',
  'endpoint-label': 'Codec Server 端点',
  'endpoint-placeholder': 'https://your-codec-server.com/api/v1',
  'pass-access-token-label': '传递用户访问令牌',
  'pass-access-token-description':
    '向 codec server 发起请求时包含用户的访问令牌',
  'cross-origin-credentials-label': '包含跨域凭证',
  'cross-origin-credentials-description':
    '向 codec server 发起跨域请求时包含凭证',
  'custom-section-description':
    '可选地自定义错误消息，并在 Codec Server 失败时为用户提供重定向链接。',
  'add-custom-button': '添加自定义消息和链接',
  'custom-message-label': '自定义错误消息',
  'custom-message-placeholder': '输入自定义错误消息...',
  'custom-link-label': '自定义错误链接',
  'custom-link-placeholder': 'https://your-help-docs.com/codec-errors',
  'custom-link-description':
    '仅包含可信链接。此 URL 将对最终用户可见，并应在 Codec Server 失败时指向安全目标。',
  'remove-custom-button': '移除自定义消息和链接',
  'validation-error-title': '校验错误',
  'validation-endpoint-required': '端点为必填项',
  'validation-endpoint-url': '请输入有效的 URL',
  'validation-custom-link-url': '请输入有效的 URL',
  'save-button': '保存',
  'saving-button': '保存中...',
  'cancel-button': '取消',
  'save-success': 'Codec server 配置已成功保存',
  'load-error-title': '加载 codec server 设置失败',
};
