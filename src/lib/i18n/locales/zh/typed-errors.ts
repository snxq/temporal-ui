export const Namespace = 'typed-errors';

export const Strings = {
  'link-preface': '了解更多关于',
  Unspecified: {
    title: '未指定',
    description: 'Workflow Task 失败。详情请查看错误信息。',
  },
  UnhandledCommand: {
    title: '未处理的命令',
    description:
      'Workflow Task 失败，因为自上一个 Workflow Task 开始后出现了新的可用事件。系统已调度一个重试 Workflow Task，工作流 Workflow 将有机会处理这些新事件。',
  },
  BadScheduleActivityAttributes: {
    title: '错误的 Schedule Activity 属性',
    description: 'Workflow Task 失败，因为 ScheduleActivity 属性缺失或不正确。',
  },
  BadRequestCancelActivityAttributes: {
    title: '错误的 Request Cancel Activity 属性',
    description:
      'Workflow Task 失败，因为 RequestCancelActivity 属性不正确。系统已调度取消一个活动 Activity，但 scheduled event id 从未被设置。',
  },
  BadStartTimerAttributes: {
    title: '错误的 Start Timer 属性',
    description: 'Workflow Task 失败，因为 scheduled event 缺少 timer id。',
  },
  BadCancelTimerAttributes: {
    title: '错误的 Cancel Timer 属性',
    description:
      'Workflow Task 在尝试取消计时器时失败，原因是 timer id 未设置。',
  },
  BadRecordMarkerAttributes: {
    title: '错误的 Record Marker 属性',
    description: 'Workflow Task 失败，因为 Marker 名称缺失或无效。',
  },
  BadCompleteWorkflowExecutionAttributes: {
    title: '错误的 Complete Workflow Execution 属性',
    description:
      'Workflow Task 失败，因为 CompleteWorkflowExecution 上有未设置的属性。',
  },
  BadFailWorkflowExecutionAttributes: {
    title: '错误的 Fail Workflow Execution 属性',
    description:
      'Workflow Task 失败，因为 FailWorkflowExecution 属性或 failure 未设置。',
  },
  BadCancelWorkflowExecutionAttributes: {
    title: '错误的 Cancel Workflow Execution 属性',
    description:
      'Workflow Task 失败，因为 CancelWorkflowExecution 上有未设置的属性。',
  },
  BadRequestCancelExternalAttributes: {
    title: '错误的 Request Cancel External 属性',
    description:
      'Workflow Task 失败，因为取消外部工作流 Workflow 的请求中包含无效属性。更多详情请检查 Failure Message。',
  },
  BadContinueAsNewAttributes: {
    title: '错误的 Continue As New 属性',
    description:
      'Workflow Task 失败，因为 ContinueAsNew 属性校验失败。更多详情请检查 Failure Message。',
  },
  StartTimerDuplicateId: {
    title: 'Start Timer 重复 ID',
    description: 'Workflow Task 失败，因为具有给定 timer id 的计时器已经启动。',
  },
  ResetStickyTaskQueue: {
    title: '重置 Sticky Task Queue',
    description:
      'Workflow Task 失败，因为需要重置 Sticky Task Queue。系统将自动重试。',
  },
  WorkflowWorkerUnhandledFailure: {
    title: 'Workflow Worker 未处理的失败',
    description:
      'Workflow Task 失败，因为工作流 Workflow 代码中出现了未处理的失败。',
  },
  WorkflowTaskHeartbeatError: {
    title: 'Workflow Task 心跳错误',
    description:
      'Workflow Task 在执行长时间运行的本地活动 Activity 时发送心跳失败。这些本地活动 Activity 会在下一次 Workflow Task 尝试时重新执行。如果此错误持续存在，这些本地活动 Activity 将反复运行，直到工作流 Workflow 超时。',
  },
  BadSignalWorkflowExecutionAttributes: {
    title: '错误的 Signal Workflow Execution 属性',
    description:
      'Workflow Task 在校验 SignalWorkflowExecution 的属性时失败。更多详情请检查 Failure Message。',
  },
  BadStartChildExecutionAttributes: {
    title: '错误的 Start Child Execution 属性',
    description:
      'Workflow Task 在校验 StartChildWorkflowExecution 所需属性时失败。更多详情请检查 Failure Message。',
  },
  ForceCloseCommand: {
    title: '强制关闭命令',
    description:
      'Workflow Task 被强制关闭。如果该错误可恢复，系统将调度一次重试。',
  },
  FailoverCloseCommand: {
    title: '故障切换关闭命令',
    description:
      'Workflow Task 因命名空间 Namespace 故障切换而被强制关闭。系统将自动调度一次重试。',
  },
  BadSignalInputSize: {
    title: '错误的 Signal 输入大小',
    description: '该负载已超过 Signal 可用的输入大小限制。',
  },
  BadBinary: {
    title: '错误的二进制版本',
    description:
      '系统使这个 Workflow Task 失败，因为此 Worker 的部署被标记为 bad binary。',
  },
  ScheduleActivityDuplicateId: {
    title: 'Schedule Activity 重复 ID',
    description:
      'Workflow Task 失败，因为该 Activity ID 已被使用。请检查你是否在工作流中指定了相同的 Activity ID。',
  },
  BadSearchAttributes: {
    title: '错误的搜索属性 Search Attributes',
    description:
      '某个搜索属性 Search Attribute 缺失，或者其值超出了限制。这可能导致 Workflow Task 持续重试但始终无法成功。',
    action: '配置搜索属性 Search Attributes',
    link: 'https://docs.temporal.io/visibility#search-attribute',
  },
  NonDeterministicError: {
    title: '非确定性错误',
    description:
      '非确定性错误导致 Workflow Task 失败。这通常意味着工作流代码发生了不向后兼容的变更，但没有正确的版本分支。',
    action: '确定性约束',
    link: 'https://docs.temporal.io/workflows/#deterministic-constraints',
  },
  BadModifyWorkflowPropertiesAttributes: {
    title: '错误的 Modify Workflow Properties 属性',
    description:
      'Workflow Task 在校验 upsert memo 上的 ModifyWorkflowProperty 属性时失败。更多详情请检查 Failure Message。',
  },
  PendingChildWorkflowsLimitExceeded: {
    title: '待处理子工作流超出限制',
    description:
      '待处理子工作流 Workflow 的容量已达到上限。为防止再添加更多子工作流 Workflow，Workflow Task 被置为失败。',
  },
  PendingActivitiesLimitExceeded: {
    title: '待处理活动超出限制',
    description:
      '待处理活动 Activity 的容量已达到上限。为防止再创建新的活动 Activity，Workflow Task 被置为失败。',
  },
  PendingSignalsLimitExceeded: {
    title: '待处理 Signal 超出限制',
    description: '从该工作流 Workflow 发送的待处理 Signal 容量已达到上限。',
  },
  PendingRequestCancelLimitExceeded: {
    title: '待处理取消请求超出限制',
    description: '取消其他工作流 Workflow 的待处理请求容量已达到上限。',
  },
  BadUpdateWorkflowExecutionMessage: {
    title: '错误的 Update',
    description: '某个 Workflow Execution 在收到 Update 之前就尝试完成。',
  },
  UnhandledUpdate: {
    title: '未处理的 Update',
    description:
      'Temporal Server 在 Worker 正在处理 Workflow Task 时收到了一个 Workflow Update。',
  },
  BadScheduleNexusOperationAttributes: {
    title: '错误的 Schedule Nexus Operation 属性',
    description:
      '某个 workflow task 完成时带有无效的 ScheduleNexusOperation 命令。',
  },
  PendingNexusOperationsLimitExceeded: {
    title: '待处理 Nexus Operation 超出限制',
    description:
      '某个 workflow task 完成时请求调度的 Nexus Operation 超过了服务器配置的限制。',
  },
  BadRequestCancelNexusOperationAttributes: {
    title: '错误的 Request Cancel Nexus Operation 属性',
    description:
      '某个 workflow task 完成时带有无效的 RequestCancelNexusOperation 命令。',
  },
  FeatureDisabled: {
    title: '功能已禁用',
    description:
      '某个 workflow task 完成时请求了一个服务器上已禁用的功能（可能是全局禁用，或更常见地是在该工作流所属的命名空间中被禁用）。更多信息请检查 workflow task failure message。',
  },
  GrpcMessageTooLarge: {
    title: 'gRPC 消息过大',
    description: 'Workflow Task 失败，因为 gRPC 消息超过了允许的最大大小。',
  },
  WorkflowTaskTimedOut: {
    title: 'Workflow Task 超时',
    description: 'Workflow Task 发生超时。',
  },
} as const;
