import { defineComponent as M, toRefs as w, ref as l, onMounted as A, openBlock as m, createElementBlock as f, mergeProps as B, Fragment as q, renderList as O, renderSlot as R } from "vue";
const j = M({
  name: "ResponsiveVideo",
  props: {
    options: {
      type: Object,
      required: !0
    },
    isautoplay: {
      type: Boolean,
      required: !1,
      default: !1
    }
  },
  setup(t) {
    const { options: s, isautoplay: u } = w(t), i = Object.keys(s.value), p = [
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
    ], o = l(), r = l([]), d = l(), v = l(0), y = l(!u.value), L = u.value ? { muted: !0, autoplay: !0, loop: !0, playsinline: !0 } : {}, P = (e) => {
      const n = e.split("."), a = n[n.length - 1];
      return p.includes(a) ? `video/${a}` : void 0;
    }, T = (e) => (e = /^\(/.test(e) ? e : `(${e}`, /\)$/.test(e) ? e : `${e})`), h = () => {
      var e;
      o.value && (o.value.currentTime = v.value < ((e = o.value) == null ? void 0 : e.duration) ? v.value : 0, y.value || o.value.play());
    }, g = (e) => {
      var c, $, V;
      const { src: n, poster: a } = s.value[e];
      (c = o.value) == null || c.pause(), v.value = (($ = o.value) == null ? void 0 : $.currentTime) || 0, d.value = a || d.value || void 0, r.value = Array.isArray(n) ? [...n] : [n], (V = o.value) == null || V.load();
    }, E = () => {
      i.forEach((e) => {
        const n = T(e), a = window.matchMedia(n);
        a.matches && g(e), a.addEventListener("change", ({ matches: c }) => {
          c && g(e);
        });
      });
    };
    return A(() => {
      E();
    }), {
      backgroundVideoAttrs: L,
      getMediaType: P,
      handleVideoLoad: h,
      isPaused: y,
      poster: d,
      sources: r,
      videoEl: o
    };
  }
}), k = (t, s) => {
  const u = t.__vccOpts || t;
  for (const [i, p] of s)
    u[i] = p;
  return u;
}, Q = ["poster"], C = ["src", "type"];
function F(t, s, u, i, p, o) {
  return m(), f("video", B({
    ref: "videoEl",
    poster: t.poster
  }, t.backgroundVideoAttrs, {
    onLoadedmetadata: s[0] || (s[0] = (...r) => t.handleVideoLoad && t.handleVideoLoad(...r)),
    onPause: s[1] || (s[1] = () => t.isPaused = !0),
    onPlay: s[2] || (s[2] = () => t.isPaused = !1)
  }), [
    (m(!0), f(q, null, O(t.sources, (r, d) => (m(), f("source", {
      key: d,
      src: r,
      type: t.getMediaType(r)
    }, null, 8, C))), 128)),
    R(t.$slots, "default")
  ], 16, Q);
}
const z = /* @__PURE__ */ k(j, [["render", F]]);
export {
  z as default
};
