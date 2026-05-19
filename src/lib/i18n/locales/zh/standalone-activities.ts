export const Namespace = 'standalone-activities' as const;

export const Strings = {
  'standalone-activities': '独立活动 Standalone Activities',
  'start-standalone-activity': '启动独立活动 Start Standalone Activity',
  'activities-error-querying': '查询活动 Activity 时出错',
  'activity-query-error-state': '筛选活动 Activity 时出错',
  'activities-plural_one': '独立活动 Activity',
  'activities-plural_other': '独立活动 Standalone Activities',
  'all-activities': '全部',
  'running-activities': '运行中',
  'completed-activities': '已完成',
  'failed-activities': '失败',
  'canceled-activities': '已取消',
  'terminated-activities': '已终止',
  'timed-out-activities': '已超时',
  'empty-state-title': '未找到活动 Activity',
  'empty-state-description': '没有活动 Activity 与当前筛选条件匹配。',
  'custom-views': '自定义视图',
  'recent-activities': '最近的独立活动 Standalone Activities',
  'activity-id': '活动 ID Activity ID',
  'run-id': '运行 ID Run ID',
  'activity-type': '活动类型 Activity Type',
  'task-queue': '任务队列 Task Queue',
  'close-time': '关闭时间',
  duration: '耗时',
  'last-started-time': '最近启动时间',
  'scheduled-time': '调度时间',
  'activities-table': '独立活动 Standalone Activities 表格',
  'back-to-activities': '返回独立活动 Standalone Activities',
  'start-activity-like-this-one':
    '按此活动启动独立活动 Start Standalone Activity',
  'request-cancellation': '请求取消',
  terminate: '终止',
  'cancel-modal-title': '取消独立活动 Standalone Activity',
  'cancel-modal-confirmation':
    '确定要取消这个独立活动 Standalone Activity 吗？',
  'cancel-success': '已请求取消独立活动 Standalone Activity。',
  'terminate-modal-title': '终止独立活动 Standalone Activity',
  'terminate-modal-confirmation':
    '确定要终止这个独立活动 Standalone Activity 吗？此操作无法撤销。',
  'terminate-success': '独立活动 Standalone Activity 已终止。',
  'activity-execution-actions': '独立活动 Standalone Activity 操作',
  'standalone-activities-disabled':
    '此命名空间 Namespace 未启用独立活动 Standalone Activities。',
  'standalone-activities-enablement':
    '如果你想在全局启用独立活动 Standalone Activities，请确保在 Dynamic Config 中设置以下值。',
  'standalone-activities-enablement-per-namespace':
    '如果你只想为此命名空间 Namespace 启用独立活动 Standalone Activities，请包含以下内容',
  'form-activity-id-label': '活动 ID Activity ID',
  'form-activity-id-required': '活动 ID Activity ID 为必填项。',
  'form-task-queue-label': '任务队列 Task Queue',
  'form-task-queue-required': '任务队列 Task Queue 为必填项。',
  'form-activity-type-label': '活动类型 Activity Type',
  'form-activity-type-required': '活动类型 Activity Type 为必填项。',
  'form-random-uuid': '随机 UUID',
  'form-timeouts-heading': '活动超时 Activity Timeouts',
  'form-start-to-close-timeout-label': '开始到关闭超时 Start to Close Timeout',
  'form-start-to-close-timeout-hint':
    '活动 Activity 被 worker 获取后，允许运行的最长时间。',
  'form-schedule-to-close-timeout-label':
    '调度到关闭超时 Schedule to Close Timeout',
  'form-schedule-to-close-timeout-hint':
    '调用方愿意等待活动 Activity 完成的时长。',
  'form-schedule-to-start-timeout-label':
    '调度到开始超时 Schedule to Start Timeout',
  'form-schedule-to-start-timeout-hint':
    '限制活动 Activity 任务在任务队列 Task Queue 中等待 Worker 领取的时间。若未指定，默认使用“调度到关闭超时 Schedule to Close Timeout”。',
  'form-timeout-required':
    '“开始到关闭超时 Start to Close Timeout”或“调度到关闭超时 Schedule to Close Timeout”至少需要填写一项。',
  'form-search-attributes-heading': '自定义搜索属性 Search Attributes',
  'form-search-attributes-description':
    '用于在列表筛选器 List Filter 中筛选独立活动 Standalone Activities 的已建立索引字段。',
  'form-user-metadata-heading': '用户元数据 User Metadata',
  'form-user-metadata-description':
    '为独立活动 Standalone Activities 添加上下文，以帮助识别并理解其操作。',
  'form-retry-policy-heading': '重试策略 Retry Policy',
  'form-heartbeat-timeout-label': '心跳超时 Heartbeat Timeout',
  'form-heartbeat-timeout-hint': 'Worker 成功发送心跳之间允许的最长时间。',
  'form-id-policies-heading': '活动 ID 策略 Activity ID Policies',
  'form-id-reuse-policy-label': 'ID 重用策略 ID Reuse Policy',
  'form-id-conflict-policy-label': 'ID 冲突策略 ID Conflict Policy',
  'form-activity-started': '活动 Activity 执行已开始。',
  'layout-tabs-label': '活动执行标签页 Activity Execution Tabs',
  'layout-details-tab': '详情',
  'layout-workers-tab': 'Workers',
  'layout-search-attributes-tab': '搜索属性 Search Attributes',
  'layout-user-metadata-tab': '用户元数据 User Metadata',
} as const;
