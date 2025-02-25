import { defineComponent as h, toRefs as E, ref as l, onMounted as M, openBlock as v, createElementBlock as m, mergeProps as w, Fragment as A, renderList as B, renderSlot as q } from "vue";
const O = h({
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
    const { options: s, isautoplay: u } = E(t), i = Object.keys(s.value), p = [
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
    ], o = l(), r = l([]), d = l(), c = l(0), f = l(!u.value), g = u.value ? { muted: !0, autoplay: !0, loop: !0, playsinline: !0 } : {}, $ = (e) => {
      const n = e.split("."), a = n[n.length - 1];
      return p.includes(a) ? `video/${a}` : void 0;
    }, V = (e) => (e = /^\(/.test(e) ? e : `(${e}`, /\)$/.test(e) ? e : `${e})`), L = () => {
      o.value && (o.value.currentTime = c.value < o.value?.duration ? c.value : 0, f.value || o.value.play());
    }, y = (e) => {
      const { src: n, poster: a } = s.value[e];
      o.value?.pause(), c.value = o.value?.currentTime || 0, d.value = a || d.value || void 0, r.value = Array.isArray(n) ? [...n] : [n], o.value?.load();
    }, P = () => {
      i.forEach((e) => {
        const n = V(e), a = window.matchMedia(n);
        a.matches && y(e), a.addEventListener("change", ({ matches: T }) => {
          T && y(e);
        });
      });
    };
    return M(() => {
      P();
    }), {
      backgroundVideoAttrs: g,
      getMediaType: $,
      handleVideoLoad: L,
      isPaused: f,
      poster: d,
      sources: r,
      videoEl: o
    };
  }
}), R = (t, s) => {
  const u = t.__vccOpts || t;
  for (const [i, p] of s)
    u[i] = p;
  return u;
}, j = ["poster"], k = ["src", "type"];
function Q(t, s, u, i, p, o) {
  return v(), m("video", w({
    ref: "videoEl",
    poster: t.poster
  }, t.backgroundVideoAttrs, {
    onLoadedmetadata: s[0] || (s[0] = (...r) => t.handleVideoLoad && t.handleVideoLoad(...r)),
    onPause: s[1] || (s[1] = () => t.isPaused = !0),
    onPlay: s[2] || (s[2] = () => t.isPaused = !1)
  }), [
    (v(!0), m(A, null, B(t.sources, (r, d) => (v(), m("source", {
      key: d,
      src: r,
      type: t.getMediaType(r)
    }, null, 8, k))), 128)),
    q(t.$slots, "default")
  ], 16, j);
}
const F = /* @__PURE__ */ R(O, [["render", Q]]);
export {
  F as default
};
