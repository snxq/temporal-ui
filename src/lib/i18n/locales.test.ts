import { describe, expect, it } from 'vitest';

import resources from './locales';

type Dictionary = Record<string, unknown>;

const flattenKeys = (value: unknown, prefix = ''): string[] => {
  if (!value || typeof value !== 'object') return [prefix];

  return Object.entries(value as Dictionary).flatMap(([key, child]) => {
    const childPrefix = prefix ? `${prefix}.${key}` : key;
    if (child && typeof child === 'object')
      return flattenKeys(child, childPrefix);
    return [childPrefix];
  });
};

const getString = (value: unknown, path: string): string | undefined => {
  const result = path.split('.').reduce<unknown>((current, key) => {
    if (!current || typeof current !== 'object') return undefined;
    return (current as Dictionary)[key];
  }, value);

  return typeof result === 'string' ? result : undefined;
};

describe('locale resources', () => {
  const locales = resources as Record<string, unknown>;

  it('registers Simplified Chinese resources', () => {
    expect(locales.zh).toBeDefined();
  });

  it('keeps zh keys in parity with en keys', () => {
    expect(flattenKeys(locales.zh).sort()).toEqual(
      flattenKeys(locales.en).sort(),
    );
  });

  it('uses Simplified Chinese for representative labels', () => {
    expect(getString(locales.zh, 'common.save')).toBe('保存');
    expect(getString(locales.zh, 'common.cancel')).toBe('取消');
    expect(getString(locales.zh, 'namespaces.namespace')).toBe(
      '命名空间 Namespace',
    );
    expect(getString(locales.zh, 'workflows.back-to-workflows')).toBe(
      '返回工作流 Workflow',
    );
    expect(getString(locales.zh, 'workers.task-queue')).toBe(
      '任务队列 Task Queue',
    );
    expect(getString(locales.zh, 'deployments.deployment')).toBe(
      '部署 Deployment',
    );
    expect(getString(locales.zh, 'events.category.activity')).toBe(
      '活动 Activity',
    );
    expect(getString(locales.zh, 'schedules.schedule')).toBe('调度 Schedule');
    expect(getString(locales.zh, 'nexus.back-to-endpoints')).toBe(
      '返回 Nexus Endpoints',
    );
    expect(getString(locales.zh, 'typed-errors.Unspecified.title')).toBe(
      '未指定',
    );
    expect(getString(locales.zh, 'search-attributes.title')).toBe(
      '搜索属性 Search Attributes',
    );
    expect(
      getString(locales.zh, 'standalone-activities.standalone-activities'),
    ).toBe('独立活动 Standalone Activities');
  });
});
