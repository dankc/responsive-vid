import { defineComponent as E, toRefs as M, ref as l, computed as w, onMounted as B, openBlock as m, createElementBlock as f, mergeProps as q, Fragment as O, renderList as R, renderSlot as j } from "vue";
const k = E({
  name: "ResponsiveVideo",
  props: {
    options: {
      type: Object,
      required: !0
    },
    isAutoplay: {
      type: Boolean,
      required: !1,
      default: !1
    }
  },
  setup(t) {
    const { options: s, isAutoplay: a } = M(t), i = Object.keys(s.value), p = [
      "mp4",
      // MPEG-4 Video
      "webm",
      // WebM Video
      "ogg",
      // Ogg Video
      "x-m4v",
      // MPEG-4 Video (Apple variant)
      "quicktime",
      // QuickTime video
      "x-ms-wmv",
      // Windows Media Video
      "mpeg",
      // MPEG Video
      "3gpp",
      // 3GPP Video
      "3gpp2"
      // 3GPP2 Video
    ], o = l(), r = l([]), d = l(), v = l(0), y = l(!a.value), A = w(
      () => a.value ? { muted: !0, autoplay: !0, loop: !0, playsinline: !0 } : {}
    ), L = (e) => {
      const n = e.split("."), u = n[n.length - 1];
      return p.includes(u) ? `video/${u}` : void 0;
    }, P = (e) => (e = /^\(/.test(e) ? e : `(${e}`, /\)$/.test(e) ? e : `${e})`), T = () => {
      var e;
      o.value && (o.value.currentTime = v.value < ((e = o.value) == null ? void 0 : e.duration) ? v.value : 0, y.value || o.value.play());
    }, g = (e) => {
      var c, $, V;
      const { src: n, poster: u } = s.value[e];
      (c = o.value) == null || c.pause(), v.value = (($ = o.value) == null ? void 0 : $.currentTime) || 0, d.value = u || d.value || void 0, r.value = Array.isArray(n) ? [...n] : [n], (V = o.value) == null || V.load();
    }, h = () => {
      i.forEach((e) => {
        const n = P(e), u = window.matchMedia(n);
        u.matches && g(e), u.addEventListener("change", ({ matches: c }) => {
          c && g(e);
        });
      });
    };
    return B(() => {
      h();
    }), {
      backgroundVideoAttrs: A,
      getMediaType: L,
      handleVideoLoad: T,
      isPaused: y,
      poster: d,
      sources: r,
      videoEl: o
    };
  }
}), Q = (t, s) => {
  const a = t.__vccOpts || t;
  for (const [i, p] of s)
    a[i] = p;
  return a;
}, C = ["poster"], F = ["src", "type"];
function S(t, s, a, i, p, o) {
  return m(), f("video", q({
    ref: "videoEl",
    poster: t.poster
  }, t.backgroundVideoAttrs, {
    onLoadedmetadata: s[0] || (s[0] = (...r) => t.handleVideoLoad && t.handleVideoLoad(...r)),
    onPause: s[1] || (s[1] = () => t.isPaused = !0),
    onPlay: s[2] || (s[2] = () => t.isPaused = !1)
  }), [
    (m(!0), f(O, null, R(t.sources, (r, d) => (m(), f("source", {
      key: d,
      src: r,
      type: t.getMediaType(r)
    }, null, 8, F))), 128)),
    j(t.$slots, "default")
  ], 16, C);
}
const D = /* @__PURE__ */ Q(k, [["render", S]]);
export {
  D as default
};
