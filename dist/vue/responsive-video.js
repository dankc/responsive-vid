import { defineComponent as h, toRefs as E, ref as d, onMounted as M, openBlock as v, createElementBlock as m, mergeProps as T, Fragment as w, renderList as A, renderSlot as B } from "vue";
const V = h({
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
    const { options: o, isautoplay: r } = E(t), c = Object.keys(o.value), l = [
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
    ], s = d(), n = d([]), u = d(), f = r.value ? { muted: !0, autoplay: !0, loop: !0, playsinline: !0 } : {}, y = (e) => {
      const i = e.split("."), a = i[i.length - 1];
      return l.includes(a) ? `video/${a}` : void 0;
    }, g = (e) => (e = /^\(/.test(e) ? e : `(${e}`, /\)$/.test(e) ? e : `${e})`), _ = () => {
      c.forEach((e) => {
        const i = g(e);
        window.matchMedia(i).addEventListener("change", () => {
          const a = s.value?.currentTime || 0, { src: p, poster: $ } = o.value[e];
          u.value = $ || u.value || void 0, n.value = Array.isArray(p) ? [...p] : [p], s.value?.load(), s.value && (s.value.currentTime = a < s.value.duration ? a : 0), s.value?.play();
        });
      });
    };
    return M(() => {
      _();
    }), {
      backgroundVideoAttrs: f,
      getMediaType: y,
      poster: u,
      sources: n
    };
  }
}), k = (t, o) => {
  const r = t.__vccOpts || t;
  for (const [c, l] of o)
    r[c] = l;
  return r;
}, q = ["poster"], O = ["src", "type"];
function R(t, o, r, c, l, s) {
  return v(), m("video", T({
    ref: "videoEl",
    poster: t.poster
  }, t.backgroundVideoAttrs), [
    (v(!0), m(w, null, A(t.sources, (n, u) => (v(), m("source", {
      key: u,
      src: n,
      type: t.getMediaType(n)
    }, null, 8, O))), 128)),
    B(t.$slots, "default")
  ], 16, q);
}
const L = /* @__PURE__ */ k(V, [["render", R]]);
export {
  L as default
};
