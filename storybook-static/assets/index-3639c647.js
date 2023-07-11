import { s as f } from './index-d475d2ea.js'
const { addons: N } = __STORYBOOK_MODULE_PREVIEW_API__,
    { once: b, logger: A } = __STORYBOOK_MODULE_CLIENT_LOGGER__,
    {
        FORCE_REMOUNT: E,
        STORY_RENDER_PHASE_CHANGED: C,
        SET_CURRENT_STORY: D,
        IGNORED_EXCEPTION: j,
    } = __STORYBOOK_MODULE_CORE_EVENTS__
var L = ((n) => ((n.DONE = 'done'), (n.ERROR = 'error'), (n.ACTIVE = 'active'), (n.WAITING = 'waiting'), n))(L || {}),
    p = {
        CALL: 'storybook/instrumenter/call',
        SYNC: 'storybook/instrumenter/sync',
        START: 'storybook/instrumenter/start',
        BACK: 'storybook/instrumenter/back',
        GOTO: 'storybook/instrumenter/goto',
        NEXT: 'storybook/instrumenter/next',
        END: 'storybook/instrumenter/end',
    },
    R = { start: !1, back: !1, goto: !1, next: !1, end: !1 },
    T = new Error('This function ran after the play function completed. Did you forget to `await` it?'),
    I = (n) => Object.prototype.toString.call(n) === '[object Object]',
    U = (n) => Object.prototype.toString.call(n) === '[object Module]',
    B = (n) => {
        if (!I(n) && !U(n)) return !1
        if (n.constructor === void 0) return !0
        let s = n.constructor.prototype
        return !(!I(s) || Object.prototype.hasOwnProperty.call(s, 'isPrototypeOf') === !1)
    },
    k = (n) => {
        try {
            return new n.constructor()
        } catch {
            return {}
        }
    },
    m = () => ({
        renderPhase: void 0,
        isDebugging: !1,
        isPlaying: !1,
        isLocked: !1,
        cursor: 0,
        calls: [],
        shadowCalls: [],
        callRefsByResult: new Map(),
        chainedCallIds: new Set(),
        ancestors: [],
        playUntil: void 0,
        resolvers: {},
        syncTimeout: void 0,
    }),
    w = (n, s = !1) => {
        let c = (s ? n.shadowCalls : n.calls).filter((i) => i.retain)
        if (!c.length) return
        let h = new Map(Array.from(n.callRefsByResult.entries()).filter(([, i]) => i.retain))
        return { cursor: c.length, calls: c, callRefsByResult: h }
    },
    P = class {
        constructor() {
            ;(this.initialized = !1),
                (this.channel = N.getChannel()),
                (this.state = f.window.parent.__STORYBOOK_ADDON_INTERACTIONS_INSTRUMENTER_STATE__ || {})
            let n = ({ storyId: e, isPlaying: r = !0, isDebugging: t = !1 }) => {
                let a = this.getState(e)
                this.setState(e, {
                    ...m(),
                    ...w(a, t),
                    shadowCalls: t ? a.shadowCalls : [],
                    chainedCallIds: t ? a.chainedCallIds : new Set(),
                    playUntil: t ? a.playUntil : void 0,
                    isPlaying: r,
                    isDebugging: t,
                }),
                    this.sync(e)
            }
            this.channel.on(E, n),
                this.channel.on(C, ({ storyId: e, newPhase: r }) => {
                    let { isDebugging: t } = this.getState(e)
                    this.setState(e, { renderPhase: r }),
                        r === 'preparing' && t && n({ storyId: e }),
                        r === 'playing' && n({ storyId: e, isDebugging: t }),
                        r === 'played' && this.setState(e, { isLocked: !1, isPlaying: !1, isDebugging: !1 }),
                        r === 'errored' && this.setState(e, { isLocked: !1, isPlaying: !1 })
                }),
                this.channel.on(D, () => {
                    this.initialized ? this.cleanup() : (this.initialized = !0)
                })
            let s = ({ storyId: e, playUntil: r }) => {
                    this.getState(e).isDebugging ||
                        this.setState(e, ({ calls: a }) => ({
                            calls: [],
                            shadowCalls: a.map((o) => ({ ...o, status: 'waiting' })),
                            isDebugging: !0,
                        }))
                    let t = this.getLog(e)
                    this.setState(e, ({ shadowCalls: a }) => {
                        var d
                        if (r || !t.length) return { playUntil: r }
                        let o = a.findIndex((_) => _.id === t[0].callId)
                        return {
                            playUntil:
                                (d = a
                                    .slice(0, o)
                                    .filter((_) => _.interceptable && !_.ancestors.length)
                                    .slice(-1)[0]) == null
                                    ? void 0
                                    : d.id,
                        }
                    }),
                        this.channel.emit(E, { storyId: e, isDebugging: !0 })
                },
                c = ({ storyId: e }) => {
                    var a
                    let r = this.getLog(e).filter((o) => !o.ancestors.length),
                        t = r.reduceRight((o, d, _) => (o >= 0 || d.status === 'waiting' ? o : _), -1)
                    s({ storyId: e, playUntil: (a = r[t - 1]) == null ? void 0 : a.callId })
                },
                h = ({ storyId: e, callId: r }) => {
                    var g
                    let { calls: t, shadowCalls: a, resolvers: o } = this.getState(e),
                        d = t.find(({ id: u }) => u === r),
                        _ = a.find(({ id: u }) => u === r)
                    if (!d && _ && Object.values(o).length > 0) {
                        let u = (g = this.getLog(e).find((O) => O.status === 'waiting')) == null ? void 0 : g.callId
                        _.id !== u && this.setState(e, { playUntil: _.id }), Object.values(o).forEach((O) => O())
                    } else s({ storyId: e, playUntil: r })
                },
                i = ({ storyId: e }) => {
                    var t
                    let { resolvers: r } = this.getState(e)
                    if (Object.values(r).length > 0) Object.values(r).forEach((a) => a())
                    else {
                        let a = (t = this.getLog(e).find((o) => o.status === 'waiting')) == null ? void 0 : t.callId
                        a ? s({ storyId: e, playUntil: a }) : l({ storyId: e })
                    }
                },
                l = ({ storyId: e }) => {
                    this.setState(e, { playUntil: void 0, isDebugging: !1 }),
                        Object.values(this.getState(e).resolvers).forEach((r) => r())
                }
            this.channel.on(p.START, s),
                this.channel.on(p.BACK, c),
                this.channel.on(p.GOTO, h),
                this.channel.on(p.NEXT, i),
                this.channel.on(p.END, l)
        }
        getState(n) {
            return this.state[n] || m()
        }
        setState(n, s) {
            let c = this.getState(n),
                h = typeof s == 'function' ? s(c) : s
            ;(this.state = { ...this.state, [n]: { ...c, ...h } }),
                (f.window.parent.__STORYBOOK_ADDON_INTERACTIONS_INSTRUMENTER_STATE__ = this.state)
        }
        cleanup() {
            this.state = Object.entries(this.state).reduce((s, [c, h]) => {
                let i = w(h)
                return i && (s[c] = Object.assign(m(), i)), s
            }, {})
            let n = { controlStates: R, logItems: [] }
            this.channel.emit(p.SYNC, n), (f.window.parent.__STORYBOOK_ADDON_INTERACTIONS_INSTRUMENTER_STATE__ = this.state)
        }
        getLog(n) {
            let { calls: s, shadowCalls: c } = this.getState(n),
                h = [...c]
            s.forEach((l, e) => {
                h[e] = l
            })
            let i = new Set()
            return h.reduceRight(
                (l, e) => (
                    e.args.forEach((r) => {
                        r != null && r.__callId__ && i.add(r.__callId__)
                    }),
                    e.path.forEach((r) => {
                        r.__callId__ && i.add(r.__callId__)
                    }),
                    (e.interceptable || e.exception) &&
                        !i.has(e.id) &&
                        (l.unshift({ callId: e.id, status: e.status, ancestors: e.ancestors }), i.add(e.id)),
                    l
                ),
                [],
            )
        }
        instrument(n, s) {
            if (!B(n)) return n
            let { mutate: c = !1, path: h = [] } = s
            return Object.keys(n).reduce(
                (i, l) => {
                    let e = n[l]
                    return typeof e != 'function'
                        ? ((i[l] = this.instrument(e, { ...s, path: h.concat(l) })), i)
                        : typeof e.__originalFn__ == 'function'
                        ? ((i[l] = e), i)
                        : ((i[l] = (...r) => this.track(l, e, r, s)),
                          (i[l].__originalFn__ = e),
                          Object.defineProperty(i[l], 'name', { value: l, writable: !1 }),
                          Object.keys(e).length > 0 &&
                              Object.assign(i[l], this.instrument({ ...e }, { ...s, path: h.concat(l) })),
                          i)
                },
                c ? n : k(n),
            )
        }
        track(n, s, c, h) {
            var u, O, S, y
            let i =
                    ((u = c == null ? void 0 : c[0]) == null ? void 0 : u.__storyId__) ||
                    ((y =
                        (S = (O = f.__STORYBOOK_PREVIEW__) == null ? void 0 : O.selectionStore) == null ? void 0 : S.selection) ==
                    null
                        ? void 0
                        : y.storyId),
                { cursor: l, ancestors: e } = this.getState(i)
            this.setState(i, { cursor: l + 1 })
            let r = `${e.slice(-1)[0] || i} [${l}] ${n}`,
                { path: t = [], intercept: a = !1, retain: o = !1 } = h,
                d = typeof a == 'function' ? a(n, t) : a,
                _ = { id: r, cursor: l, storyId: i, ancestors: e, path: t, method: n, args: c, interceptable: d, retain: o },
                g = (d && !e.length ? this.intercept : this.invoke).call(this, s, _, h)
            return this.instrument(g, { ...h, mutate: !0, path: [{ __callId__: _.id }] })
        }
        intercept(n, s, c) {
            let { chainedCallIds: h, isDebugging: i, playUntil: l } = this.getState(s.storyId),
                e = h.has(s.id)
            return !i || e || l
                ? (l === s.id && this.setState(s.storyId, { playUntil: void 0 }), this.invoke(n, s, c))
                : new Promise((r) => {
                      this.setState(s.storyId, ({ resolvers: t }) => ({ isLocked: !1, resolvers: { ...t, [s.id]: r } }))
                  }).then(
                      () => (
                          this.setState(s.storyId, (r) => {
                              let { [s.id]: t, ...a } = r.resolvers
                              return { isLocked: !0, resolvers: a }
                          }),
                          this.invoke(n, s, c)
                      ),
                  )
        }
        invoke(n, s, c) {
            let { callRefsByResult: h, renderPhase: i } = this.getState(s.storyId),
                l = (t) => {
                    var a, o
                    if (h.has(t)) return h.get(t)
                    if (t instanceof Array) return t.map(l)
                    if (t instanceof Date) return { __date__: { value: t.toISOString() } }
                    if (t instanceof Error) {
                        let { name: d, message: _, stack: g } = t
                        return { __error__: { name: d, message: _, stack: g } }
                    }
                    if (t instanceof RegExp) {
                        let { flags: d, source: _ } = t
                        return { __regexp__: { flags: d, source: _ } }
                    }
                    if (t instanceof f.window.HTMLElement) {
                        let { prefix: d, localName: _, id: g, classList: u, innerText: O } = t,
                            S = Array.from(u)
                        return { __element__: { prefix: d, localName: _, id: g, classNames: S, innerText: O } }
                    }
                    return typeof t == 'function'
                        ? { __function__: { name: t.name } }
                        : typeof t == 'symbol'
                        ? { __symbol__: { description: t.description } }
                        : typeof t == 'object' &&
                          (a = t == null ? void 0 : t.constructor) != null &&
                          a.name &&
                          ((o = t == null ? void 0 : t.constructor) == null ? void 0 : o.name) !== 'Object'
                        ? { __class__: { name: t.constructor.name } }
                        : Object.prototype.toString.call(t) === '[object Object]'
                        ? Object.fromEntries(Object.entries(t).map(([d, _]) => [d, l(_)]))
                        : t
                },
                e = { ...s, args: s.args.map(l) }
            s.path.forEach((t) => {
                t != null &&
                    t.__callId__ &&
                    this.setState(s.storyId, ({ chainedCallIds: a }) => ({
                        chainedCallIds: new Set(Array.from(a).concat(t.__callId__)),
                    }))
            })
            let r = (t) => {
                if (t instanceof Error) {
                    let { name: a, message: o, stack: d, callId: _ = s.id } = t,
                        g = { name: a, message: o, stack: d, callId: _ }
                    if (
                        (this.update({ ...e, status: 'error', exception: g }),
                        this.setState(s.storyId, (u) => ({
                            callRefsByResult: new Map([
                                ...Array.from(u.callRefsByResult.entries()),
                                [t, { __callId__: s.id, retain: s.retain }],
                            ]),
                        })),
                        s.ancestors.length)
                    )
                        throw (
                            (Object.prototype.hasOwnProperty.call(t, 'callId') ||
                                Object.defineProperty(t, 'callId', { value: s.id }),
                            t)
                        )
                    if (t !== T) throw (A.warn(t), j)
                }
                throw t
            }
            try {
                if (i === 'played' && !s.retain) throw T
                let t = (c.getArgs ? c.getArgs(s, this.getState(s.storyId)) : s.args).map((o) =>
                        typeof o != 'function' || Object.keys(o).length
                            ? o
                            : (...d) => {
                                  let { cursor: _, ancestors: g } = this.getState(s.storyId)
                                  this.setState(s.storyId, { cursor: 0, ancestors: [...g, s.id] })
                                  let u = () => this.setState(s.storyId, { cursor: _, ancestors: g }),
                                      O = !1
                                  try {
                                      let S = o(...d)
                                      return S instanceof Promise ? ((O = !0), S.finally(u)) : S
                                  } finally {
                                      O || u()
                                  }
                              },
                    ),
                    a = n(...t)
                return (
                    a &&
                        ['object', 'function', 'symbol'].includes(typeof a) &&
                        this.setState(s.storyId, (o) => ({
                            callRefsByResult: new Map([
                                ...Array.from(o.callRefsByResult.entries()),
                                [a, { __callId__: s.id, retain: s.retain }],
                            ]),
                        })),
                    this.update({ ...e, status: a instanceof Promise ? 'active' : 'done' }),
                    a instanceof Promise ? a.then((o) => (this.update({ ...e, status: 'done' }), o), r) : a
                )
            } catch (t) {
                return r(t)
            }
        }
        update(n) {
            this.channel.emit(p.CALL, n),
                this.setState(n.storyId, ({ calls: s }) => {
                    let c = s.concat(n).reduce((h, i) => Object.assign(h, { [i.id]: i }), {})
                    return { calls: Object.values(c).sort((h, i) => h.id.localeCompare(i.id, void 0, { numeric: !0 })) }
                }),
                this.sync(n.storyId)
        }
        sync(n) {
            let s = () => {
                var a
                let { isLocked: c, isPlaying: h } = this.getState(n),
                    i = this.getLog(n),
                    l =
                        (a = i.filter(({ ancestors: o }) => !o.length).find((o) => o.status === 'waiting')) == null
                            ? void 0
                            : a.callId,
                    e = i.some((o) => o.status === 'active')
                if (c || e || i.length === 0) {
                    let o = { controlStates: R, logItems: i }
                    this.channel.emit(p.SYNC, o)
                    return
                }
                let r = i.some((o) => ['done', 'error'].includes(o.status)),
                    t = { controlStates: { start: r, back: r, goto: !0, next: h, end: h }, logItems: i, pausedAt: l }
                this.channel.emit(p.SYNC, t)
            }
            this.setState(n, ({ syncTimeout: c }) => (clearTimeout(c), { syncTimeout: setTimeout(s, 0) }))
        }
    }
function M(n, s = {}) {
    var c, h, i, l
    try {
        let e = !1,
            r = !1
        return (
            (h = (c = f.window.location) == null ? void 0 : c.search) != null && h.includes('instrument=true')
                ? (e = !0)
                : (l = (i = f.window.location) == null ? void 0 : i.search) != null && l.includes('instrument=false') && (r = !0),
            (f.window.parent === f.window && !e) || r
                ? n
                : (f.window.__STORYBOOK_ADDON_INTERACTIONS_INSTRUMENTER__ ||
                      (f.window.__STORYBOOK_ADDON_INTERACTIONS_INSTRUMENTER__ = new P()),
                  f.window.__STORYBOOK_ADDON_INTERACTIONS_INSTRUMENTER__.instrument(n, s))
        )
    } catch (e) {
        return b.warn(e), n
    }
}
export { M as i }
//# sourceMappingURL=index-3639c647.js.map
