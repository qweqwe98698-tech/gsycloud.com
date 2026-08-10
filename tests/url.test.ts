import { describe, expect, it } from 'vitest';
import { normalizePath, canonicalUrl, postUrl, relatedUrl, slugify } from '../src/utils/url';

describe('normalizePath', () => {
  it('保证首尾斜杠', () => {
    expect(normalizePath('tutorials/clash')).toBe('/tutorials/clash/');
    expect(normalizePath('/tutorials/clash')).toBe('/tutorials/clash/');
    expect(normalizePath('/tutorials/clash/')).toBe('/tutorials/clash/');
  });

  it('根路径保持为 /', () => {
    expect(normalizePath('/')).toBe('/');
    expect(normalizePath('')).toBe('/');
  });

  it('文件类路径不加尾部斜杠', () => {
    expect(normalizePath('/rss.xml')).toBe('/rss.xml');
    expect(normalizePath('robots.txt')).toBe('/robots.txt');
  });
});

describe('canonicalUrl', () => {
  it('生成带域名的绝对 URL', () => {
    expect(canonicalUrl('/about/')).toBe('https://gsycloud.com/about/');
    expect(canonicalUrl('network/what-is-iplc')).toBe('https://gsycloud.com/network/what-is-iplc/');
  });

  it('根路径 canonical 正确', () => {
    expect(canonicalUrl('/')).toBe('https://gsycloud.com/');
  });
});

describe('postUrl / relatedUrl', () => {
  it('collection + id 生成 URL', () => {
    expect(postUrl('network', 'what-is-iplc')).toBe('/network/what-is-iplc/');
    expect(postUrl('tutorials', 'clash/getting-started')).toBe('/tutorials/clash/getting-started/');
  });

  it('relatedSlug 转 URL', () => {
    expect(relatedUrl('ai/chatgpt/network-guide')).toBe('/ai/chatgpt/network-guide/');
  });
});

describe('slugify', () => {
  it('小写并用连字符连接', () => {
    expect(slugify('Clash Verge')).toBe('clash-verge');
    expect(slugify('  IPLC  ')).toBe('iplc');
  });

  it('保留中文字符', () => {
    expect(slugify('故障排查')).toBe('故障排查');
    expect(slugify('节点 超时')).toBe('节点-超时');
  });

  it('去除非法字符与多余连字符', () => {
    expect(slugify('a!!b--c')).toBe('ab-c');
    expect(slugify('-abc-')).toBe('abc');
  });
});
