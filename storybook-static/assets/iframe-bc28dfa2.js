import '../sb-preview/runtime.js'
;(function () {
    const i = document.createElement('link').relList
    if (i && i.supports && i.supports('modulepreload')) return
    for (const t of document.querySelectorAll('link[rel="modulepreload"]')) c(t)
    new MutationObserver((t) => {
        for (const e of t)
            if (e.type === 'childList') for (const o of e.addedNodes) o.tagName === 'LINK' && o.rel === 'modulepreload' && c(o)
    }).observe(document, { childList: !0, subtree: !0 })
    function s(t) {
        const e = {}
        return (
            t.integrity && (e.integrity = t.integrity),
            t.referrerPolicy && (e.referrerPolicy = t.referrerPolicy),
            t.crossOrigin === 'use-credentials'
                ? (e.credentials = 'include')
                : t.crossOrigin === 'anonymous'
                ? (e.credentials = 'omit')
                : (e.credentials = 'same-origin'),
            e
        )
    }
    function c(t) {
        if (t.ep) return
        t.ep = !0
        const e = s(t)
        fetch(t.href, e)
    }
})()
const p = 'modulepreload',
    f = function (_, i) {
        return new URL(_, i).href
    },
    O = {},
    r = function (i, s, c) {
        if (!s || s.length === 0) return i()
        const t = document.getElementsByTagName('link')
        return Promise.all(
            s.map((e) => {
                if (((e = f(e, c)), e in O)) return
                O[e] = !0
                const o = e.endsWith('.css'),
                    d = o ? '[rel="stylesheet"]' : ''
                if (!!c)
                    for (let a = t.length - 1; a >= 0; a--) {
                        const l = t[a]
                        if (l.href === e && (!o || l.rel === 'stylesheet')) return
                    }
                else if (document.querySelector(`link[href="${e}"]${d}`)) return
                const n = document.createElement('link')
                if (
                    ((n.rel = o ? 'stylesheet' : p),
                    o || ((n.as = 'script'), (n.crossOrigin = '')),
                    (n.href = e),
                    document.head.appendChild(n),
                    o)
                )
                    return new Promise((a, l) => {
                        n.addEventListener('load', a),
                            n.addEventListener('error', () => l(new Error(`Unable to preload CSS for ${e}`)))
                    })
            }),
        )
            .then(() => i())
            .catch((e) => {
                const o = new Event('vite:preloadError', { cancelable: !0 })
                if (((o.payload = e), window.dispatchEvent(o), !o.defaultPrevented)) throw e
            })
    },
    { createChannel: R } = __STORYBOOK_MODULE_CHANNEL_POSTMESSAGE__,
    { createChannel: P } = __STORYBOOK_MODULE_CHANNEL_WEBSOCKET__,
    { addons: u } = __STORYBOOK_MODULE_PREVIEW_API__,
    m = R({ page: 'preview' })
u.setChannel(m)
window.__STORYBOOK_ADDONS_CHANNEL__ = m
if (window.CONFIG_TYPE === 'DEVELOPMENT') {
    const _ = P({})
    u.setServerChannel(_), (window.__STORYBOOK_SERVER_CHANNEL__ = _)
}
const T = {
    './src/stories/Introduction.mdx': async () =>
        r(
            () => import('./Introduction-fadf81ce.js'),
            [
                './Introduction-fadf81ce.js',
                './jsx-runtime-94f6e698.js',
                './index-8db94870.js',
                './_commonjsHelpers-042e6b4d.js',
                './index-8b5e8140.js',
                './index-d475d2ea.js',
                './index-80ae7d84.js',
                './index-d37d4223.js',
                './index-356e4a49.js',
                './index-1d576ef5.js',
            ],
            import.meta.url,
        ),
    './src/stories/Button.stories.ts': async () =>
        r(
            () => import('./Button.stories-e50ec7d0.js'),
            [
                './Button.stories-e50ec7d0.js',
                './Button-1703f682.js',
                './jsx-runtime-94f6e698.js',
                './index-8db94870.js',
                './_commonjsHelpers-042e6b4d.js',
                './Button-bc1a867b.css',
            ],
            import.meta.url,
        ),
    './src/stories/Header.stories.ts': async () =>
        r(
            () => import('./Header.stories-2cba33af.js'),
            [
                './Header.stories-2cba33af.js',
                './Header-f13548e4.js',
                './jsx-runtime-94f6e698.js',
                './index-8db94870.js',
                './_commonjsHelpers-042e6b4d.js',
                './Button-1703f682.js',
                './Button-bc1a867b.css',
                './Header-a6911580.css',
            ],
            import.meta.url,
        ),
    './src/stories/Page.stories.ts': async () =>
        r(
            () => import('./Page.stories-ea4b3791.js'),
            [
                './Page.stories-ea4b3791.js',
                './index-3639c647.js',
                './index-d475d2ea.js',
                './_commonjsHelpers-042e6b4d.js',
                './index-356e4a49.js',
                './jsx-runtime-94f6e698.js',
                './index-8db94870.js',
                './Header-f13548e4.js',
                './Button-1703f682.js',
                './Button-bc1a867b.css',
                './Header-a6911580.css',
                './Page.stories-ece1482a.css',
            ],
            import.meta.url,
        ),
}
async function E(_) {
    return T[_]()
}
E.__docgenInfo = { description: '', methods: [], displayName: 'importFn' }
const { composeConfigs: w, PreviewWeb: S, ClientApi: L } = __STORYBOOK_MODULE_PREVIEW_API__,
    h = async () => {
        const _ = await Promise.all([
            r(
                () => import('./config-2b79f355.js'),
                [
                    './config-2b79f355.js',
                    './index-d475d2ea.js',
                    './index-8db94870.js',
                    './_commonjsHelpers-042e6b4d.js',
                    './react-18-f58e807b.js',
                    './index-80ae7d84.js',
                    './index-356e4a49.js',
                ],
                import.meta.url,
            ),
            r(
                () => import('./preview-5ef354f3.js'),
                ['./preview-5ef354f3.js', './index-d475d2ea.js', './index-d37d4223.js'],
                import.meta.url,
            ),
            r(() => import('./preview-09a75737.js'), [], import.meta.url),
            r(() => import('./preview-a60aa466.js'), [], import.meta.url),
            r(
                () => import('./preview-770cc08b.js'),
                ['./preview-770cc08b.js', './index-d475d2ea.js', './index-356e4a49.js'],
                import.meta.url,
            ),
            r(() => import('./preview-2cd4e1a1.js'), ['./preview-2cd4e1a1.js', './index-d475d2ea.js'], import.meta.url),
            r(
                () => import('./preview-d8c963a4.js'),
                ['./preview-d8c963a4.js', './index-d475d2ea.js', './index-356e4a49.js'],
                import.meta.url,
            ),
            r(() => import('./preview-b1164a2e.js'), ['./preview-b1164a2e.js', './index-d475d2ea.js'], import.meta.url),
            r(
                () => import('./preview-bc596eab.js'),
                ['./preview-bc596eab.js', './index-d475d2ea.js', './index-3639c647.js', './_commonjsHelpers-042e6b4d.js'],
                import.meta.url,
            ),
            r(() => import('./preview-1e5c59db.js'), [], import.meta.url),
        ])
        return w(_)
    }
window.__STORYBOOK_PREVIEW__ = window.__STORYBOOK_PREVIEW__ || new S()
window.__STORYBOOK_STORY_STORE__ = window.__STORYBOOK_STORY_STORE__ || window.__STORYBOOK_PREVIEW__.storyStore
window.__STORYBOOK_CLIENT_API__ =
    window.__STORYBOOK_CLIENT_API__ || new L({ storyStore: window.__STORYBOOK_PREVIEW__.storyStore })
window.__STORYBOOK_PREVIEW__.initialize({ importFn: E, getProjectAnnotations: h })
export { r as _ }
//# sourceMappingURL=iframe-bc28dfa2.js.map
