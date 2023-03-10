import md5 from "blueimp-md5";
import { app } from "electron";
import { writeFile, stat, mkdir } from "fs/promises";
import { join } from "path";

const i = "320305.131321201";

const n = (r, o) => {
  for (let t = 0; t < o.length - 2; t += 3) {
    let a = o.charAt(t + 2);
    (a = a >= "a" ? a.charCodeAt(0) - 87 : Number(a)),
      (a = "+" === o.charAt(t + 1) ? r >>> a : r << a),
      (r = "+" === o.charAt(t) ? (r + a) & 4294967295 : r ^ a);
  }
  return r;
};

export const e = (r) => {
  let o = r.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g);
  if (null === o) {
    let t = r.length;
    t > 30 &&
      (r =
        "" +
        r.substr(0, 10) +
        r.substr(Math.floor(t / 2) - 5, 10) +
        r.substr(-10, 10));
  } else {
    let e = r.split(/[\uD800-\uDBFF][\uDC00-\uDFFF]/),
      h = e.length,
      f = [];
    for (let C = 0; h > C; C++) "" !== e[C], C !== h - 1 && f.push(o[C]);
    let g = f.length;
    g > 30 &&
      (r =
        f.slice(0, 10).join("") +
        f.slice(Math.floor(g / 2) - 5, Math.floor(g / 2) + 5).join("") +
        f.slice(-10).join(""));
  }
  let u = void 0;
  u = null !== i ? i : "";
  let d = u.split("."),
    m = Number(d[0]) || 0,
    s = Number(d[1]) || 0,
    S = [],
    c = 0;
  for (let v = 0; v < r.length; v++) {
    let A = r.charCodeAt(v);
    128 > A
      ? (S[c++] = A)
      : (2048 > A
          ? (S[c++] = (A >> 6) | 192)
          : (55296 === (64512 & A) &&
            v + 1 < r.length &&
            56320 === (64512 & r.charCodeAt(v + 1))
              ? ((A = 65536 + ((1023 & A) << 10) + (1023 & r.charCodeAt(++v))),
                (S[c++] = (A >> 18) | 240),
                (S[c++] = ((A >> 12) & 63) | 128))
              : (S[c++] = (A >> 12) | 224),
            (S[c++] = ((A >> 6) & 63) | 128)),
        (S[c++] = (63 & A) | 128));
  }
  let p = m,
    F = "+-a^+6",
    D = "+-3^+b+-f";
  for (let b = 0; b < S.length; b++) (p += S[b]), (p = n(p, F));
  return (
    (p = n(p, D)),
    (p ^= s),
    0 > p && (p = (2147483647 & p) + 2147483648),
    (p %= 1e6),
    p.toString() + "." + (p ^ m)
  );
};

export const y = (data, UA) => {
  const bv = md5(UA),
    lts = "" + Date.now(),
    salt = lts + parseInt(10 * Math.random(), 10);
  const sign = md5("fanyideskweb" + data + salt + "]BjuETDhU)zqSxf-=B#7m");
  return { bv, lts, salt, sign };
};

export const FormatDate = (date = new Date()) => {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const d = date.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${d}`;
};

export const FormatTime = (date = new Date()) => {
  const h = date.getHours().toString().padStart(2, "0");
  const m = date.getMinutes().toString().padStart(2, "0");
  const s = date.getSeconds().toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
};

const file = join(
  app.getPath("exe"),
  `../Log/Log-${FormatDate(new Date())}.log`
);
const filepath = join(app.getPath("exe"), "../Log/");

export const Log = async (text) => {
  const time = FormatTime(new Date());
  try {
    await stat(filepath);
  } catch (error) {
    await mkdir(filepath);
  }
  await writeFile(file, `${time} - ${text}\n`, { flag: "a+" });
};
