export const Namespace = 'search-attributes' as const;

export const Strings = {
  title: '搜索属性 Search Attributes',
  description: '为工作流 Workflow 查询定义自定义搜索属性。',
  'column-attribute': '属性',
  'column-type': '类型',
  'attribute-label': '属性 {{index}}',
  'type-label': '属性 {{index}} 的类型',
  'select-type-placeholder': '选择类型',
  'custom-search-attributes': '自定义搜索属性 Search Attributes',

  'add-attribute-button': '添加新的自定义搜索属性',
  'save-button': '保存',
  'saving-button': '保存中...',
  'cancel-button': '取消',

  'validation-error-title': '验证错误',
  'save-success': '搜索属性已成功保存',
  'save-error': '保存搜索属性失败',
  'save-error-generic': '保存搜索属性时发生错误',
  'load-error-title': '加载搜索属性失败',
  'error-title': '错误',

  'validation-name-required': '属性名称为必填项',
  'validation-names-unique': '属性名称必须唯一',

  'crud-not-implemented': 'SDK 团队添加端点后将实现 CRUD 操作',

  'type-keyword': 'Keyword',
  'type-text': 'Text',
  'type-int': 'Int',
  'type-double': 'Double',
  'type-bool': 'Bool',
  'type-datetime': 'DateTime',
  'type-keywordlist': 'KeywordList',

  'story-title': '{{namespace}} 的自定义搜索属性 Search Attributes',
} as const;
