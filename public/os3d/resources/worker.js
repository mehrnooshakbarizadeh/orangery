// base
var document = {};
var window = { alert: function(s) { console.log('alert in worker:', s) } };
var alert = window.alert;
var DOMTokenList = function() {};
var _null = "set null anyway";


function getPPI() {
    var t = document.createElement("div");
    t.style.width = "1in";
    var e = document.getElementsByTagName("body")[0];
    e.appendChild(t);
    var n = t.offsetWidth;
    return e.removeChild(t), parseFloat(n)
}

function dcc(t, e) {
    var n = t / e,
        r = .5 * sqrt(1 - pow(2 * n - 1));
    return n > .5 && (r = 1 - .5 * sqrt(1 - pow(2 * n - 1))), r * e
}

function acc(t, e) {
    var n = t / e,
        r = .5 * -sqrt(1 - pow(2 * n)) + .5;
    return n > .5 && (r = r = .5 * sqrt(1 - pow(2 * n - 2)) + .5), r * e
}

function toRGB(t, e) {
    e = def(e, 255);
    var n = t - floor(t / e) * e,
        r = (t = floor(t / e)) - floor(t / e) * e,
        i = (t = floor(t / e)) - floor(t / e) * e;
    return n > 126 && n++, r > 126 && r++, i > 126 && i++, { r: n, g: r, b: i }
}

function torgb(t, e) { var n = toRGB(t, e = def(e, 255)); return { r: n.r / 256, g: n.g / 256, b: n.b / 256 } }

function toID(t, e) {
    var n = 255 / (e = def(e, 255)),
        r = floor(t.r / n),
        i = floor(t.g / n);
    return floor(t.b / n) * e * e + i * e + r
}

function toid(t, e) { return toID({ r: 256 * t.r, g: 256 * t.g, b: 256 * t.b }, e) }

function def(t, e) { return null != t && null != t ? null == e || null == e || t : e != _null ? null != e && null != e && e : null }
var always = function() { return !0 };

function n_1(t) { return t = def(t, []), def(t.length) ? t[t.length - 1] : null }

function repeat(t, e, n) { for (var r = 0; r < t; r++) def(e) && e(r, r == t - 1); if (def(n)) return n() }

function css_r(t, e) {
    if (def(t.length)) _each(t, function(t, n) { try { def(t) && def(t.classList) && t.classList.remove(e) } catch (t) {} }, function() {}, function() {});
    else try { def(t) && def(t.classList) && t.classList.remove(e) } catch (t) {}
}

function css_t(t, e) { def(t) && def(t.classList) && t.classList.toggle(e) }

function css(t, e) {
    if (def(t.length)) _each(t, function(t, n) { try { def(t) && def(t.classList) && t.classList._add(e) } catch (t) {} }, function() {}, function() {});
    else try { def(t) && def(t.classList) && t.classList._add(e) } catch (t) {}
}




function dim(t, e) { return sqrt(pow(e.x - t.x) + pow(e.y - t.y) + (def(e.z) ? pow(e.z - t.z) : 0)) }

function norm(t) {
    var e = t.x,
        n = t.y,
        r = t.z,
        i = sqrt(e * e + n * n + r * r);
    if (0 == i) return { x: .1, y: .1, z: .1 };
    var o = 1 / i;
    return t.x *= o, t.y *= o, t.z *= o, t
}

function sub(t, e) { return { x: e.x - t.x, y: e.y - t.y, z: e.z - t.z } }

function dot(t, e) { return { x: e.x * t.x, y: e.y * t.y, z: e.z * t.z } }

function cross(t, e) {
    var n = t.x,
        r = t.y,
        i = t.z,
        o = e.x,
        s = e.y,
        a = e.z,
        u = { x: 0, y: 0, z: 0 };
    return u.x = s * i - a * r, u.y = a * n - o * i, u.z = o * r - s * n, u
}

function nott(t) { return { x: -1 * t.x, y: -1 * t.y, z: -1 * t.z } }

function add(t, e) { return { x: e.x + t.x, y: e.y + t.y, z: e.z + t.z } }

function rotate_xy(t, e, n) { return pp2 = { x: e.x - t.x, y: e.y - t.y }, { x: t.x + pp2.x * cos(n) - pp2.y * sin(n), y: t.y + pp2.x * sin(n) + pp2.y * cos(n) } }

function r_y(t, e, n) {
    var r = { x: (n = def(n, { x: 0, y: 0, z: 0 })).x, y: n.y, z: n.z };
    r.x = r.x, r.y = r.z;
    var i = rotate_xy(r, { x: t.x, y: t.z }, e);
    return t.x = i.x, t.z = i.y, t
}

function r_la(t, e) {
    0 == e.x && (e.x += 1e-5), 0 == e.y && (e.y += 1e-5), 0 == e.z && (e.z += 1e-5);
    var n = { x: e.x, y: e.y, z: e.z },
        r = { x: e.x, y: e.y, z: e.z },
        i = atan((n = n).x / n.z);
    r = r_y(r, i);
    var o = atan(r.z / r.y);
    return t = r_x(t, 90 * deg), t = n.y > 0 ? r_y(t = r_x(t, -1 * (90 * deg - o)), -i) : r_y(t = r_x(t, 1 * (90 * deg - o)), 180 * deg - i)
}

function r_x(t, e, n) {
    var r = { x: (n = def(n, { x: 0, y: 0, z: 0 })).x, y: n.y, z: n.z };
    r.x = r.y, r.y = r.z;
    var i = rotate_xy(r, { x: t.y, y: t.z }, e);
    return t.y = i.x, t.z = i.y, t
}

function r_z(t, e, n) { var r = rotate_xy({ x: (n = def(n, { x: 0, y: 0, z: 0 })).x, y: n.y, z: n.z }, { x: t.x, y: t.y }, e); return t.x = r.x, t.y = r.y, t }

function vec(t, e, n) { return { x: def(t, 0), y: def(e, 0), z: def(n, 0) } }
var vec3 = function(t, e, n) { def(e) || def(n) || (this.p = { x: 0, y: 0, z: 0 }, this.d = t), n ? (this.p = t, this.d = e) : (this.p = t, this.d = sub(e, t)) };
vec3.prototype = {
    p: { x: 0, y: 0, z: 0 },
    d: { x: 0, y: 1, z: 0 },
    pageNormal: function(t, e, n) {
        if (!def(e) && !def(n)) return new vec3(this.p, cross(this.d, t.d), !0);
        if (!def(n)) return new vec3(t.p, cross(t.d, e.d), !0);
        var r = new vec3(t, e),
            i = new vec3(t, n);
        return new vec3(r.p, cross(r.d, i.d), !0)
    },
    normal: function() { return new vec3(this.p, norm(this.d), !0) }
};
var face3 = function(t, e, n) { this.p1 = t, this.p2 = e, this.p3 = n };
face3.prototype = {
    p1: {},
    p2: {},
    p3: {},
    getCenter: function() { var t = add(add(this.p1, this.p2), this.p3); return vec(t.x / 3, t.y / 3, t.z / 3) },
    normal: function() {
        var t = new vec3(this.p1, this.p2),
            e = new vec3(this.p1, this.p3),
            n = new vec3(t.p, cross(t.d, e.d), !0).normal();
        return vec(n.d.x, n.d.y, n.d.z)
    }
};
var qt = function() {
    function t(t, e, n, r) { void 0 === t && (t = 0), void 0 === e && (e = 0), void 0 === n && (n = 0), void 0 === r && (r = 1), this.x = t, this.y = e, this.z = n, this.w = r }
    return t.prototype.toString = function() { return "{X: " + this.x + " Y:" + this.y + " Z:" + this.z + " W:" + this.w + "}" }, t.prototype.asArray = function() { return [this.x, this.y, this.z, this.w] }, t.prototype.equals = function(t) { return t && this.x === t.x && this.y === t.y && this.z === t.z && this.w === t.w }, t.prototype.clone = function() { return new t(this.x, this.y, this.z, this.w) }, t.prototype.copyFrom = function(t) { this.x = t.x, this.y = t.y, this.z = t.z, this.w = t.w }, t.prototype.add = function(e) { return new t(this.x + e.x, this.y + e.y, this.z + e.z, this.w + e.w) }, t.prototype.subtract = function(e) { return new t(this.x - e.x, this.y - e.y, this.z - e.z, this.w - e.w) }, t.prototype.scale = function(e) { return new t(this.x * e, this.y * e, this.z * e, this.w * e) }, t.prototype.multiply = function(e) { var n = new t(0, 0, 0, 1); return this.multiplyToRef(e, n), n }, t.prototype.multiplyToRef = function(t, e) { e.x = this.x * t.w + this.y * t.z - this.z * t.y + this.w * t.x, e.y = -this.x * t.z + this.y * t.w + this.z * t.x + this.w * t.y, e.z = this.x * t.y - this.y * t.x + this.z * t.w + this.w * t.z, e.w = -this.x * t.x - this.y * t.y - this.z * t.z + this.w * t.w }, t.prototype.length = function() { return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w) }, t.prototype.normalize = function() {
        var t = 1 / this.length();
        this.x *= t, this.y *= t, this.z *= t, this.w *= t
    }, t.prototype.toEulerAngles = function() {
        var t = this.x,
            e = this.y,
            n = this.z,
            r = this.w,
            i = t * t,
            o = e * e,
            s = n * n,
            a = Math.atan2(2 * (e * r - t * n), 1 - 2 * (o + s)),
            u = Math.asin(2 * (t * e + n * r)),
            f = Math.atan2(2 * (t * r - e * n), 1 - 2 * (i + s)),
            h = t * e + n * r;
        return h > .499 ? (a = 2 * Math.atan2(t, r), f = 0) : h < -.499 && (a = -2 * Math.atan2(t, r), f = 0), new Vector3(u, a, f)
    }, t.prototype.toRotationMatrix = function(t) {
        var e = this.x * this.x,
            n = this.y * this.y,
            r = this.z * this.z,
            i = this.x * this.y,
            o = this.z * this.w,
            s = this.z * this.x,
            a = this.y * this.w,
            u = this.y * this.z,
            f = this.x * this.w;
        t.m[0] = 1 - 2 * (n + r), t.m[1] = 2 * (i + o), t.m[2] = 2 * (s - a), t.m[3] = 0, t.m[4] = 2 * (i - o), t.m[5] = 1 - 2 * (r + e), t.m[6] = 2 * (u + f), t.m[7] = 0, t.m[8] = 2 * (s + a), t.m[9] = 2 * (u - f), t.m[10] = 1 - 2 * (n + e), t.m[11] = 0, t.m[12] = 0, t.m[13] = 0, t.m[14] = 0, t.m[15] = 1
    }, t.prototype.fromRotationMatrix = function(t) {
        var e, n = t.m,
            r = n[0],
            i = n[4],
            o = n[8],
            s = n[1],
            a = n[5],
            u = n[9],
            f = n[2],
            h = n[6],
            c = n[10],
            l = r + a + c;
        return l > 0 ? (e = .5 / Math.sqrt(l + 1), this.w = .25 / e, this.x = (h - u) * e, this.y = (o - f) * e, void(this.z = (s - i) * e)) : r > a && r > c ? (e = 2 * Math.sqrt(1 + r - a - c), this.w = (h - u) / e, this.x = .25 * e, this.y = (i + s) / e, void(this.z = (o + f) / e)) : a > c ? (e = 2 * Math.sqrt(1 + a - r - c), this.w = (o - f) / e, this.x = (i + s) / e, this.y = .25 * e, void(this.z = (u + h) / e)) : (e = 2 * Math.sqrt(1 + c - r - a), this.w = (s - i) / e, this.x = (o + f) / e, this.y = (u + h) / e, void(this.z = .25 * e))
    }, t.RotationAxis = function(e, n) {
        var r = new t,
            i = Math.sin(n / 2);
        return r.w = Math.cos(n / 2), r.x = e.x * i, r.y = e.y * i, r.z = e.z * i, r
    }, t.FromArray = function(e, n) { return n || (n = 0), new t(e[n], e[n + 1], e[n + 2], e[n + 3]) }, t.RotationYawPitchRoll = function(e, n, r) { var i = new t; return t.RotationYawPitchRollToRef(e, n, r, i), i }, t.RotationYawPitchRollToRef = function(t, e, n, r) {
        var i = .5 * n,
            o = .5 * e,
            s = .5 * t,
            a = Math.sin(i),
            u = Math.cos(i),
            f = Math.sin(o),
            h = Math.cos(o),
            c = Math.sin(s),
            l = Math.cos(s);
        r.x = l * f * u + c * h * a, r.y = c * h * u - l * f * a, r.z = l * h * a - c * f * u, r.w = l * h * u + c * f * a
    }, t.Slerp = function(e, n, r) {
        var i, o, s = r,
            a = e.x * n.x + e.y * n.y + e.z * n.z + e.w * n.w,
            u = !1;
        if (a < 0 && (u = !0, a = -a), a > .999999) o = 1 - s, i = u ? -s : s;
        else {
            var f = Math.acos(a),
                h = 1 / Math.sin(f);
            o = Math.sin((1 - s) * f) * h, i = u ? -Math.sin(s * f) * h : Math.sin(s * f) * h
        }
        return new t(o * e.x + i * n.x, o * e.y + i * n.y, o * e.z + i * n.z, o * e.w + i * n.w)
    }, t
}();
lookAt = function(t, e, n, r, i) {
        n = n || 0, r = r || 0, i = i || 0;
        var o = sub(t, e),
            s = -Math.atan2(o.z, o.x) - Math.PI / 2,
            a = Math.sqrt(o.x * o.x + o.z * o.z),
            u = Math.atan2(o.y, a);
        return qt.RotationYawPitchRoll(s + n, u + r, i)
    },
    function(t) {
        var e = t.noise = {};

        function n(t, e, n) { this.x = t, this.y = e, this.z = n }
        n.prototype.dot2 = function(t, e) { return this.x * t + this.y * e }, n.prototype.dot3 = function(t, e, n) { return this.x * t + this.y * e + this.z * n };
        var r = [new n(1, 1, 0), new n(-1, 1, 0), new n(1, -1, 0), new n(-1, -1, 0), new n(1, 0, 1), new n(-1, 0, 1), new n(1, 0, -1), new n(-1, 0, -1), new n(0, 1, 1), new n(0, -1, 1), new n(0, 1, -1), new n(0, -1, -1)],
            i = [151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180],
            o = new Array(512),
            s = new Array(512);
        e.seed = function(t) {
            t > 0 && t < 1 && (t *= 65536), (t = Math.floor(t)) < 256 && (t |= t << 8);
            for (var e = 0; e < 256; e++) {
                var n;
                n = 1 & e ? i[e] ^ 255 & t : i[e] ^ t >> 8 & 255, o[e] = o[e + 256] = n, s[e] = s[e + 256] = r[n % 12]
            }
        }, e.seed(0);
        var a = .5 * (Math.sqrt(3) - 1),
            u = (3 - Math.sqrt(3)) / 6,
            f = 1 / 6;

        function h(t) { return t * t * t * (t * (6 * t - 15) + 10) }

        function c(t, e, n) { return (1 - n) * t + n * e }
        e.simplex2 = function(t, e) {
            var n, r, i = (t + e) * a,
                f = Math.floor(t + i),
                h = Math.floor(e + i),
                c = (f + h) * u,
                l = t - f + c,
                d = e - h + c;
            l > d ? (n = 1, r = 0) : (n = 0, r = 1);
            var _ = l - n + u,
                p = d - r + u,
                v = l - 1 + 2 * u,
                y = d - 1 + 2 * u,
                x = s[(f &= 255) + o[h &= 255]],
                m = s[f + n + o[h + r]],
                g = s[f + 1 + o[h + 1]],
                w = .5 - l * l - d * d,
                z = .5 - _ * _ - p * p,
                M = .5 - v * v - y * y;
            return 70 * ((w < 0 ? 0 : (w *= w) * w * x.dot2(l, d)) + (z < 0 ? 0 : (z *= z) * z * m.dot2(_, p)) + (M < 0 ? 0 : (M *= M) * M * g.dot2(v, y)))
        }, e.simplex3 = function(t, e, n) {
            var r, i, a, u, h, c, l = (t + e + n) * (1 / 3),
                d = Math.floor(t + l),
                _ = Math.floor(e + l),
                p = Math.floor(n + l),
                v = (d + _ + p) * f,
                y = t - d + v,
                x = e - _ + v,
                m = n - p + v;
            y >= x ? x >= m ? (r = 1, i = 0, a = 0, u = 1, h = 1, c = 0) : y >= m ? (r = 1, i = 0, a = 0, u = 1, h = 0, c = 1) : (r = 0, i = 0, a = 1, u = 1, h = 0, c = 1) : x < m ? (r = 0, i = 0, a = 1, u = 0, h = 1, c = 1) : y < m ? (r = 0, i = 1, a = 0, u = 0, h = 1, c = 1) : (r = 0, i = 1, a = 0, u = 1, h = 1, c = 0);
            var g = y - r + f,
                w = x - i + f,
                z = m - a + f,
                M = y - u + 2 * f,
                L = x - h + 2 * f,
                b = m - c + 2 * f,
                T = y - 1 + .5,
                H = x - 1 + .5,
                A = m - 1 + .5,
                q = s[(d &= 255) + o[(_ &= 255) + o[p &= 255]]],
                S = s[d + r + o[_ + i + o[p + a]]],
                C = s[d + u + o[_ + h + o[p + c]]],
                N = s[d + 1 + o[_ + 1 + o[p + 1]]],
                R = .6 - y * y - x * x - m * m,
                k = .6 - g * g - w * w - z * z,
                E = .6 - M * M - L * L - b * b,
                O = .6 - T * T - H * H - A * A;
            return 32 * ((R < 0 ? 0 : (R *= R) * R * q.dot3(y, x, m)) + (k < 0 ? 0 : (k *= k) * k * S.dot3(g, w, z)) + (E < 0 ? 0 : (E *= E) * E * C.dot3(M, L, b)) + (O < 0 ? 0 : (O *= O) * O * N.dot3(T, H, A)))
        }, e.perlin2 = function(t, e) {
            var n = Math.floor(t),
                r = Math.floor(e);
            t -= n, e -= r;
            var i = s[(n &= 255) + o[r &= 255]].dot2(t, e),
                a = s[n + o[r + 1]].dot2(t, e - 1),
                u = s[n + 1 + o[r]].dot2(t - 1, e),
                f = s[n + 1 + o[r + 1]].dot2(t - 1, e - 1),
                l = h(t);
            return c(c(i, u, l), c(a, f, l), h(e))
        }, e.perlin3 = function(t, e, n) {
            var r = Math.floor(t),
                i = Math.floor(e),
                a = Math.floor(n);
            t -= r, e -= i, n -= a;
            var u = s[(r &= 255) + o[(i &= 255) + o[a &= 255]]].dot3(t, e, n),
                f = s[r + o[i + o[a + 1]]].dot3(t, e, n - 1),
                l = s[r + o[i + 1 + o[a]]].dot3(t, e - 1, n),
                d = s[r + o[i + 1 + o[a + 1]]].dot3(t, e - 1, n - 1),
                _ = s[r + 1 + o[i + o[a]]].dot3(t - 1, e, n),
                p = s[r + 1 + o[i + o[a + 1]]].dot3(t - 1, e, n - 1),
                v = s[r + 1 + o[i + 1 + o[a]]].dot3(t - 1, e - 1, n),
                y = s[r + 1 + o[i + 1 + o[a + 1]]].dot3(t - 1, e - 1, n - 1),
                x = h(t),
                m = h(e),
                g = h(n);
            return c(c(c(u, _, x), c(f, p, x), g), c(c(l, v, x), c(d, y, x), g), m)
        }
    }(this);
var prop = { domain: "", loader: {}, noise: { simplex2d: function(t, e) { return noise.simplex2(t, e) }, simplex3d: function(t, e, n) { return noise.simplex3(t, e) }, perlin2d: function(t, e) { return noise.perlin2(t, e) }, perlin3d: function(t, e, n) { return noise.perlin2(t, e, n) } }, $3d: { geos: [], shaders: {} } };

var dn = function(op) {

    op = def(op, {});
    op.type = def(op.type, 'Get');
    op.url = def(op.url, '/');
    op.success = def(op.success, function(data) { alert(data); });
    op.error = def(op.error, function(data) { alert(data.responseText); });
    op.end = def(op.end, function() {});
    op.begin = def(op.begin, function() {});
    op.option = def(op.option, {});

    function processData(data) {
        op.success(data, op.option);
    }

    function handler() {
        op.subProgress = def(op.subProgress, function(p) {});
        op.subProgress(this);
        if (this.readyState == this.DONE) {
            if (this.status == 200) {
                // success!
                processData(this.responseText);
            } else {
                op.error(this);
            }
            op.end();
        }
    }

    try {
        op.begin();
        var client = new XMLHttpRequest();
        client.onreadystatechange = handler;
        client.open(op.type, op.url);
        client.send();
        client.onprogress = function(pe) {
            if (pe.lengthComputable) {
                op.progress = def(op.progress, function(p) {});
                op.progress(pe.loaded * 100. / pe.total);
            }
        }
    } catch (e) {
        op.error(e);
        op.end();
    }

};
var up = function(op) {
    op = def(op, {});
    op.type = def(op.type, 'POST');
    op.url = def(op.url, '/');
    op.success = def(op.success, function(data) { alert(data); });
    op.error = def(op.error, function(data) { alert(data.responseText); });
    op.end = def(op.end, function() {});
    op.begin = def(op.begin, function() {});

    function processData(data) {
        op.success(data);
    }

    function handler() {
        if (this.readyState == this.DONE) {
            if (this.status == 200) {
                // success!
                processData(this.responseText);
            } else {
                op.error(this);
            }
            op.end();
        }
    }

    try {
        op.begin();
        var client = new XMLHttpRequest();
        client.onreadystatechange = handler;
        if ("withCredentials" in client) {
            client.open(op.type, op.url, true);
            client.upload.onprogress = function(pe) {
                if (pe.lengthComputable) {
                    op.progress = def(op.progress, function(p) {});
                    op.progress(pe.loaded * 100. / pe.total);
                }
            }

        } else if (typeof XDomainRequest != "undefined") {

            // Otherwise, check if XDomainRequest.
            // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
            client = new XDomainRequest();
            client.onreadystatechange = handler;

            client.open(op.type, op.url);
            client.upload.onprogress = function(pe) {
                if (pe.lengthComputable) {
                    op.progress = def(op.progress, function(p) {});
                    op.progress(pe.loaded * 100. / pe.total);
                }
            }
        }

        if (def(op.file)) {
            var data = new FormData();
            _for(op.file, function(at, i) {
                data.append("file" + i, at.data);

            }, function() {
                client.setRequestHeader("content", JSON.stringify(op.data));
                client.send(data);
                client.upload.onprogress = function(pe) {
                    if (pe.lengthComputable) {
                        op.progress = def(op.progress, function(p) {});
                        op.progress(pe.loaded * 100. / pe.total);
                    }
                }
            });
        } else {
            client.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            client.send((def(op.data, false) ? JSON.stringify(op.data) : ''));
            client.onprogress = function(pe) {
                if (pe.lengthComputable) {
                    op.progress = def(op.progress, function(p) {});
                    op.progress(pe.loaded * 100. / pe.total);
                }
            }
        }
    } catch (e) {
        op.error(e);
        op.end();
    }
};

var scene = {};
var camera = {};

var geoInWorker = function(builder, set) {

    var geo = GB.GeometryBase(set, builder);

    return geo; 
};

function BuildGeo(ts) {

    ind = 0;
    var evb;
    eval('evb = ' + ts.build);
    var geos = geoInWorker(evb, ts.set);

    postMessage({ d: { mode: 'geoReady' }, res: geos });
} 

function isReadyForCall() {
    postMessage("is not ready for call");
}

var baseURL = location.pathname.split("/os3d");

window.baseURL = baseURL[0] + "/os3d";
window.baseImgURL = baseURL[0] + "/os3d/3dimages";

dn({
    url: window.baseURL + '/resources/GBv2.0.4.6.js',
    success: function(d) {
        eval(d);


        dn({
            url: window.baseURL + '/resources/version.js',
            success: function(d) {

                eval(d);

                
        dn({
            url: window.baseURL + '/modelScript'+window.currVer+'/basic.models.js',
            success: function(d) {
                eval(d);

                isReadyForCall = function(d) {

                    if (d && d.mode && d.mode == "geo") {
                        BuildGeo(d.data);
                    } else if (d && d.mode && d.mode == "model") {

                        var geos = scene.modelCommand.recreateInWorker(d.data);

                        postMessage({ d: { mode: 'modelReady' }, res: geos, ref: d.data });

                    }

                }

            }
        });
    }

    });

    }
});

self.onmessage = function(msg) {

    isReadyForCall(msg.data);
}

console.log('worker v.0.102.1')