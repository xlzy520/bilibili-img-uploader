import fs from 'fs-extra'
import type { Manifest } from 'webextension-polyfill'
import type PkgType from '../package.json'
import { isDev, port, r } from '../scripts/utils'

export async function getManifest() {
  const pkg = await fs.readJSON(r('package.json')) as typeof PkgType

  // update this file to update this manifest.json
  // can also be conditional based on your need
  const manifest: Manifest.WebExtensionManifest = {
    manifest_version: 3,
    name: pkg.displayName || pkg.name,
    version: pkg.version,
    description: pkg.description + (isDev ? '(开发版)' : ''),
    homepage_url: 'https://github.com/xlzy520/bilibili-img-uploader',
    action: {
      default_title: '哔哩哔哩图床',
      default_icon: './assets/favicon.png',
      default_popup: './dist/popup/index.html',
    },
    background: {
      service_worker: './dist/background/index.mjs',
    },
    icons: {
      16: './assets/favicon@16.png',
      48: './assets/favicon@48.png',
      64: './assets/favicon@64.png',
      128: './assets/favicon.png',
    },
    permissions: [
      'cookies',
      'declarativeNetRequest',
    ],
    // @ts-expect-error 这个包暂时不支持Manifest V3, TS检查先忽略
    declarative_net_request: {
      rule_resources: [
        {
          id: 'ruleset_1',
          enabled: true,
          path: './assets/rules.json',
        },
      ],
    },
    host_permissions: [
      'https://*.bilibili.com/*',
    ],
    content_security_policy: {
      extension_pages: isDev // this is required on dev for Vite script to load
        ? `script-src 'self' http://localhost:${port}; object-src 'self' http://localhost:${port}`
        : 'script-src \'self\'; object-src \'self\'',
    },
  }

  if (isDev) {
    manifest.permissions?.push('webNavigation')
  }

  return manifest
}
