import { defineComponent as T, toRefs as E, ref as c, onMounted as M, openBlock as v, createElementBlock as m, mergeProps as _, Fragment as w, renderList as A, renderSlot as B } from "vue";
const q = T({
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
    const { options: n, isautoplay: u } = E(t), l = Object.keys(n.value), i = [
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
    ], o = c(), r = c([]), d = c(), p = c(0), y = u.value ? { muted: !0, autoplay: !0, loop: !0, playsinline: !0 } : {}, g = (e) => {
      const s = e.split("."), a = s[s.length - 1];
      return i.includes(a) ? `video/${a}` : void 0;
    }, h = (e) => (e = /^\(/.test(e) ? e : `(${e}`, /\)$/.test(e) ? e : `${e})`), $ = () => {
      o.value && (o.value.currentTime = p.value < o.value?.duration ? p.value : 0, o.value.play());
    }, f = (e) => {
      const { src: s, poster: a } = n.value[e];
      o.value?.pause(), p.value = o.value?.currentTime || 0, d.value = a || d.value || void 0, r.value = Array.isArray(s) ? [...s] : [s], o.value?.load();
    }, V = () => {
      l.forEach((e) => {
        const s = h(e), a = window.matchMedia(s);
        a.matches && f(e), a.addEventListener("change", ({ matches: L }) => {
          L && f(e);
        });
      });
    };
    return M(() => {
      V(), console.log("test 2");
    }), {
      backgroundVideoAttrs: y,
      getMediaType: g,
      handleVideoLoad: $,
      poster: d,
      sources: r,
      videoEl: o
    };
  }
}), O = (t, n) => {
  const u = t.__vccOpts || t;
  for (const [l, i] of n)
    u[l] = i;
  return u;
}, R = ["poster"], j = ["src", "type"];
function k(t, n, u, l, i, o) {
  return v(), m("video", _({
    ref: "videoEl",
    poster: t.poster
  }, t.backgroundVideoAttrs, {
    onLoadedmetadata: n[0] || (n[0] = (...r) => t.handleVideoLoad && t.handleVideoLoad(...r))
  }), [
    (v(!0), m(w, null, A(t.sources, (r, d) => (v(), m("source", {
      key: d,
      src: r,
      type: t.getMediaType(r)
    }, null, 8, j))), 128)),
    B(t.$slots, "default")
  ], 16, R);
}
const C = /* @__PURE__ */ O(q, [["render", k]]);
export {
  C as default
};
