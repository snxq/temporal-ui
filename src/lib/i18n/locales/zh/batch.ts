export const Namespace = 'batch' as const;

export const Strings = {
  'nav-title': '批处理 Batch',
  'list-page-title': '批处理操作 Batch Operations',
  'describe-page-title': '批处理操作 Batch Operation',
  'empty-state-title': '暂无批处理操作',
  'back-link': '返回批处理操作 Batch Operations',
  'operation-type': '操作类型',
  details: '操作详情',
  identity: '身份标识',
  'total-operations': '操作总数',
  'operations-failed': '{{ count, number }} 个失败',
  'operations-succeeded': '{{ count, number }} 个成功',
  'operations-progress': '已完成 {{ percent }}%',
  results: '操作结果',
  'max-concurrent-alert-title': '已达到批处理操作并发上限',
  'max-concurrent-alert-description':
    '同时只允许 1 个进行中的批处理操作。如果当前已有一个正在运行，此时再创建新的批处理操作将会失败。',
  'job-id-input-hint': 'Job ID 必须唯一。若留空，将使用随机生成的 UUID。',
  'job-id-input-error': 'Job ID 只能包含 URL 安全字符',
} as const;
