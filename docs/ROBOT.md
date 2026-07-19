# Robot 3D hoạt động thế nào (Three.js / React Three Fiber)

Tài liệu này giải thích **bản chất** cách con robot 3D di chuyển, dành cho người
chưa từng code Three.js. Đọc từ trên xuống là hiểu dần.

File liên quan:

- [`components/HeroScene.tsx`](../components/HeroScene.tsx) — robot trong khung hero (WASD/chạm, vẫy, nhảy, tym).
- [`components/RoamingRobot.tsx`](../components/RoamingRobot.tsx) — robot đi rong khắp trang (roam mode).
- [`public/models/RobotExpressive.glb`](../public/models) — model 3D có sẵn xương + animation (CC0).

---

## 0. Mental model: 3D web = 3 thứ

Three.js dựng ảnh 3D từ **3 thành phần**:

```
Scene  (thế giới)      →  chứa mọi vật: robot, đèn, sàn...
Camera (con mắt)       →  đứng ở đâu, nhìn về đâu
Renderer (người vẽ)    →  mỗi khung hình, vẽ Scene theo góc Camera lên <canvas>
```

**React Three Fiber (R3F)** chỉ là lớp React bọc quanh Three.js:

| Three.js thuần | R3F (mình đang dùng) |
|----------------|----------------------|
| `new THREE.Scene()`, `Renderer`, vòng lặp vẽ | `<Canvas>` lo hết |
| `new THREE.Mesh(geo, mat)` rồi `scene.add(...)` | viết JSX: `<mesh><boxGeometry/><meshStandardMaterial/></mesh>` |
| `requestAnimationFrame` tự viết | hook `useFrame(() => {...})` |

> Tức là: mọi thẻ JSX bên trong `<Canvas>` **là một vật thể 3D thật**, không phải HTML.

---

## 1. Hệ toạ độ 3D

Mỗi vật có `position` gồm **3 số** `(x, y, z)`:

```
        y  (lên/xuống)
        │
        │
        └───── x  (trái/phải)
       /
      z  (hướng về phía camera / ra xa)
```

- Robot đứng trên "sàn" tại `y = 0`.
- Đi trái/phải = đổi **x**. Đi tới/lui (xa/gần camera) = đổi **z**.
- Ngoài `position` còn có `rotation` (xoay) và `scale` (phóng to/thu nhỏ).

Trong code robot đứng ở gốc:

```tsx
<primitive ref={group} object={scene} scale={0.5} position={[0, 0, 0]} />
```

`group` là "tay cầm" (ref) tới vật thể — mình sẽ **đổi `group.position` mỗi khung hình** để nó di chuyển.

---

## 2. Trái tim của chuyển động: `useFrame` + `delta`

`useFrame(cb)` chạy `cb` **mỗi khung hình** (~60 lần/giây). Đây là nơi mọi
chuyển động xảy ra.

```tsx
useFrame((state, delta) => {
    // state = { camera, scene, ... }
    // delta = số GIÂY trôi qua kể từ khung hình trước (vd 0.016s nếu 60fps)
});
```

**Vì sao cần `delta`?** Để tốc độ không phụ thuộc máy nhanh/chậm.

```
Sai:  position.x += 0.05           // máy 120fps sẽ đi nhanh gấp đôi máy 60fps
Đúng: position.x += speed * delta  // "đi speed đơn vị mỗi GIÂY", đều nhau mọi máy
```

Đây là quy tắc vàng: **quãng đường = tốc_độ × thời_gian**, mà `delta` chính là "thời gian" của khung hình đó.

---

## 3. Bản chất robot di chuyển — từng bước

Toàn bộ nằm trong `useFrame` của component `Robot`. Đọc kèm giải thích:

```tsx
useFrame((state, delta) => {
    const d = dir.current;                 // trạng thái phím: {f,b,l,r} (đang nhấn?)

    // (1) Gộp phím thành 1 vector hướng (dx, dz)
    let dx = 0, dz = 0;
    if (d.l) dx -= 1;   // trái  → x giảm
    if (d.r) dx += 1;   // phải  → x tăng
    if (d.f) dz -= 1;   // tới   → z giảm (ra xa camera)
    if (d.b) dz += 1;   // lui   → z tăng (lại gần camera)

    if (dx !== 0 || dz !== 0) {
        // (2) Chuẩn hoá vector: để đi chéo KHÔNG nhanh hơn đi thẳng
        const len = Math.hypot(dx, dz);    // độ dài vector
        dx /= len; dz /= len;              // giờ vector dài đúng = 1

        // (3) Dịch chuyển: quãng đường = tốc độ × delta
        const speed = 2.4;
        p.x += dx * speed * delta;
        p.z += dz * speed * delta;
        // ...kèm clamp() để không đi ra ngoài khung

        // (4) Xoay mặt về hướng đi (giải thích ở mục 4)
        // (5) Đổi sang animation "Walking"
        setBase("Walking");
    } else {
        setBase("Idle");                   // không nhấn phím → đứng yên
    }
});
```

Tóm lại mỗi khung hình robot làm 5 việc: **đọc phím → tạo hướng → chuẩn hoá →
cộng vào vị trí → xoay mặt + chọn animation.** Lặp lại 60 lần/giây tạo cảm giác đi mượt.

### Vì sao phải chuẩn hoá (bước 2)?

Nhấn W+D (đi chéo) cho vector `(1,1)` dài `√2 ≈ 1.41`. Nếu không chia cho độ dài,
đi chéo sẽ nhanh hơn đi thẳng 41%. Chia cho `len` ép mọi hướng về độ dài 1 → tốc độ đều.

### `clamp` để giữ trong khung

```tsx
p.x = THREE.MathUtils.clamp(p.x + dx * speed * delta, -2.2, 2.2);
```

`clamp(giá_trị, min, max)` = kẹp giá trị trong khoảng. Robot chỉ đi được `x` trong
`[-2.2, 2.2]`, chạm mép là dừng — không lọt ra ngoài camera.

---

## 4. Xoay mặt theo hướng đi

Muốn robot **quay đầu** về nơi nó đang đi:

```tsx
const targetRot = Math.atan2(dx, dz);        // góc cần quay (radian)
let diff = targetRot - group.rotation.y;      // còn lệch bao nhiêu
diff = Math.atan2(Math.sin(diff), Math.cos(diff)); // ép về [-π, π] (đi đường ngắn nhất)
group.rotation.y += diff * Math.min(1, delta * 12); // xoay DẦN, không giật
```

- `Math.atan2(dx, dz)` biến vector hướng thành **góc** quanh trục y.
- Thay vì gán thẳng `rotation.y = targetRot` (sẽ giật), mình **nội suy dần** (lerp):
  mỗi khung xoay thêm một phần nhỏ về phía góc đích → mượt như rẽ cua.
- Mẹo `atan2(sin, cos)` để tránh lỗi "quay ngược 350° thay vì 10°".

> `rotation.y` = xoay quanh trục đứng (như người xoay tại chỗ). Đơn vị **radian** (π = 180°).

---

## 5. Animation & bộ xương (rig)

File `.glb` không chỉ có hình khối — nó có **bộ xương (skeleton)** và nhiều
**đoạn animation (clip)**: `Idle`, `Walking`, `Running`, `Jump`, `Wave`, `Dance`,
`ThumbsUp`...

R3F nạp model và animation bằng 2 hook:

```tsx
const { scene, animations } = useGLTF("/models/RobotExpressive.glb");
const { actions, mixer } = useAnimations(animations, group);
// actions["Walking"], actions["Idle"]... là các "nút bấm" để phát từng clip
```

**Chuyển animation mượt (crossfade)** — mờ cái cũ, hiện cái mới:

```tsx
const setBase = (name) => {
    if (base.current === name) return;         // đang chạy rồi thì thôi
    actions[base.current]?.fadeOut(0.2);        // clip cũ mờ dần trong 0.2s
    actions[name]?.reset().fadeIn(0.2).play();  // clip mới hiện dần
    base.current = name;
};
```

**Animation "1 lần" (Wave/Dance/Jump/ThumbsUp)** — chạy hết rồi tự về Idle:

```tsx
clip.setLoop(THREE.LoopOnce, 1);   // chỉ phát 1 lần (không lặp)
clip.clampWhenFinished = true;     // giữ khung cuối, không nhảy về đầu
clip.reset().fadeIn(0.12).play();
mixer.addEventListener("finished", () => { /* quay lại Idle/Walking */ });
```

`mixer` là "máy phát" điều phối thời gian các clip; sự kiện `finished` báo clip 1-lần đã xong.

---

## 6. Vì sao input dùng `ref` chứ không dùng `useState`?

```tsx
const dir = useRef({ f: false, b: false, l: false, r: false });
```

- Nếu dùng `useState`, **mỗi lần nhấn phím React sẽ re-render** cả component — 60 lần/giây thì lag.
- `useRef` là một "cái hộp" giá trị **thay đổi được mà KHÔNG re-render**. `useFrame`
  đọc thẳng `dir.current` mỗi khung → nhanh, mượt.

Bàn phím chỉ ghi vào hộp:

```tsx
window.addEventListener("keydown", (e) => { dir.current[map[e.code]] = true; });
window.addEventListener("keyup",   (e) => { dir.current[map[e.code]] = false; });
```

D-pad cảm ứng (mobile) cũng ghi vào **cùng cái hộp đó** → desktop và mobile dùng chung 1 cơ chế.

---

## 7. Camera đi theo robot (chỉ ở hero)

Trong khung hero, camera **bám theo** để robot luôn trong khung:

```tsx
const followX = p.x * 0.7;
state.camera.position.x += (followX - state.camera.position.x) * Math.min(1, delta * 3);
state.camera.lookAt(p.x * 0.6, 0.9, 0);
```

Đây cũng là **lerp** (nội suy dần): camera nhích 1 phần nhỏ về vị trí đích mỗi khung →
theo mượt chứ không dính cứng. (Ở roam mode thì camera **cố định** để robot thật sự đi ngang qua màn hình.)

---

## 8. Vụ phím tiếng Việt (tại sao có `e.code` + failsafe)

- Bộ gõ tiếng Việt (EVKey/Telex) **chiếm** phím W/A/S/D làm phím bỏ dấu (w→ư, s→sắc,
  d→đ...), nên nó "nuốt" luôn sự kiện `keyup` → phím bị kẹt "true" mãi → robot đi hoài.
- **Cách chống:**
  1. Dùng `e.code` (`KeyW`, `ArrowUp`...) = mã phím vật lý, không bị bộ gõ biến đổi.
  2. Thêm **phím mũi tên ↑↓←→** — bộ gõ không đụng tới → luôn chuẩn.
  3. **Failsafe:** khi giữ phím, `keydown` lặp lại liên tục. Nếu ngừng lặp > 0.6s
     (dấu hiệu đã nhả nhưng `keyup` bị nuốt) thì tự đặt phím về `false`.

```tsx
setInterval(() => {
    const now = performance.now();
    for (const k of ["f","b","l","r"])
        if (dir.current[k] && now - (lastDown[k] || 0) > 600) dir.current[k] = false;
}, 80);
```

---

## 9. Roam mode khác gì?

[`RoamingRobot.tsx`](../components/RoamingRobot.tsx) dùng **cùng ý tưởng**, chỉ khác:

| | Hero (`HeroScene`) | Roam (`RoamingRobot`) |
|---|---|---|
| Canvas | nằm trong khung panel | **phủ full màn** (`fixed inset-0`), `pointer-events-none` để trang vẫn bấm/cuộn được |
| Camera | **bám theo** robot | **cố định** → robot đi ngang hết màn hình |
| Bounds `x` | hẹp (`±2.2`) | rộng, tính theo bề ngang màn hình |
| Vào/ra | toggle "🚶 Roam / ✕ Exit" | thêm nút Return + phím `Esc` |

---

## 10. Bản đồ nhanh (đọc code theo thứ tự này)

1. `<Canvas camera={...}>` — dựng scene + camera. (`HeroScene`)
2. `<ambientLight/> <directionalLight/>` — ánh sáng để thấy vật.
3. `<Robot/>` bên trong `<Suspense>` — nạp model (`useGLTF`) + animation (`useAnimations`).
4. `useFrame` trong `Robot` — **vòng lặp di chuyển** (mục 3, 4).
5. `dir` ref + listener bàn phím + D-pad — nguồn input (mục 6).
6. `<ContactShadows/>` — bóng đổ dưới chân.

---

## Phụ lục A — Toán nền (giải thích kỹ + ví dụ số)

Bốn khái niệm dưới đây là ~90% toán của robot. Mỗi cái có ví dụ số cụ thể.

### A.1 Vector — mũi tên có hướng và độ lớn

Vector 2D là cặp số `(x, z)`, hình dung là **mũi tên** từ gốc `(0,0)` tới điểm `(x,z)`.

```
(dx, dz) = (1, 0)  →  mũi tên chỉ sang phải
(dx, dz) = (0, -1) →  mũi tên chỉ tới trước (z âm = ra xa camera)
(dx, dz) = (1, 1)  →  mũi tên chỉ chéo phải-lui
```

**Cộng vector** = cộng từng thành phần (dùng khi đi tới + sang phải cùng lúc):

```
(1, 0) + (0, -1) = (1, -1)   // đi phải + tới = đi chéo phải-tới
```

**Nhân vô hướng** (vector × 1 số) = kéo dài/thu ngắn mũi tên, giữ nguyên hướng:

```
(1, -1) × 2.4 = (2.4, -2.4)  // "đi nhanh gấp 2.4 lần" theo hướng đó
```

> Trong code: `p.x += dx * speed * delta` chính là **nhân vô hướng** vector hướng
> `(dx,dz)` với `speed*delta` rồi **cộng** vào vị trí hiện tại.

### A.2 Độ dài vector (Pythagoras)

Độ dài mũi tên `(dx, dz)` = cạnh huyền tam giác vuông:

```
len = √(dx² + dz²)          // Math.hypot(dx, dz)
```

Ví dụ:

```
(1, 0)  → √(1+0) = 1
(3, 4)  → √(9+16) = √25 = 5
(1, 1)  → √(1+1) = √2 ≈ 1.414   ← đây là lý do đi chéo "dài" hơn!
```

### A.3 Chuẩn hoá (normalize) — ép độ dài về 1

Chia vector cho chính độ dài của nó → được **cùng hướng** nhưng **độ dài = 1**
(gọi là *vector đơn vị*):

```
đơn_vị = (dx/len, dz/len)
```

Ví dụ đi chéo `(1, 1)`:

```
len = √2 ≈ 1.414
chuẩn hoá → (1/1.414, 1/1.414) = (0.707, 0.707)
kiểm tra độ dài: √(0.707² + 0.707²) = √(0.5+0.5) = 1  ✓
```

Giờ đi thẳng `(1,0)` (đã dài 1) và đi chéo `(0.707, 0.707)` (dài 1) → **cùng tốc độ**.
Không chuẩn hoá thì đi chéo nhanh hơn 41% (vì 1.414 so với 1).

```tsx
const len = Math.hypot(dx, dz);
dx /= len; dz /= len;   // ← chính là normalize
```

### A.4 Radian & `atan2` — đổi giữa "hướng" và "góc"

**Radian** là đơn vị góc mà lập trình đồ hoạ dùng (thay cho độ):

```
π rad   = 180°
π/2 rad = 90°
đổi:  độ = rad × 180/π      rad = độ × π/180
```

**`Math.atan2(dx, dz)`** nhận một **hướng** `(dx, dz)` và trả về **góc** (radian)
tương ứng. Đây là cách robot biết phải quay đầu bao nhiêu.

Với quy ước trong code (`rotation.y = atan2(dx, dz)`):

```
hướng (dx, dz)     atan2(dx,dz)   ≈ độ    ý nghĩa
(0,  1)  lui        0             0°       nhìn về phía camera
(1,  0)  phải       π/2           90°      quay sang phải
(0, -1)  tới        π (hoặc -π)   180°     quay ra xa camera
(-1, 0)  trái       -π/2          -90°     quay sang trái
```

> Vì sao `atan2` chứ không `atan`? `atan` (1 tham số) không phân biệt được góc ở
> phần tư nào (vd phải vs trái đều cho cùng kết quả). `atan2` nhận **2 tham số** nên
> biết đúng hướng trong cả 360°.

### A.5 Lerp — nội suy tuyến tính (bí quyết làm mượt)

Công thức 1 dòng, dùng ở **xoay mặt** và **camera follow**:

```
mới = cũ + (đích − cũ) × t         với t trong [0, 1]
```

- `t = 1` → nhảy thẳng tới đích (giật).
- `t = 0` → đứng im.
- `t` nhỏ (vd 0.1) → mỗi khung nhích **10% khoảng cách còn lại** → tiến gần đích rất mượt, chậm dần.

Ví dụ camera đang ở `x = 0`, đích `x = 4`, dùng `t = 0.2` mỗi khung:

```
khung 1: 0   + (4−0)×0.2 = 0.8
khung 2: 0.8 + (4−0.8)×0.2 = 1.44
khung 3: 1.44+ (4−1.44)×0.2 = 1.95
khung 4: 1.95+ (4−1.95)×0.2 = 2.36
...      tiến dần tới 4, bước sau nhỏ hơn bước trước → mượt, "ease-out"
```

Trong code:

```tsx
state.camera.position.x += (followX - state.camera.position.x) * Math.min(1, delta * 3);
//                          └──── (đích − cũ) ────┘             └──── t ────┘
```

> `Math.min(1, delta * 12)` cho phần xoay: nhân `delta` để tốc độ mượt **không phụ
> thuộc fps**, và `min(1, …)` để `t` không vượt quá 1 khi khung hình bị giật (lag).

### A.6 clamp — kẹp trong khoảng

```
clamp(x, min, max) = max(min, min(max, x))
```

Ví dụ giữ robot trong `x ∈ [-2.2, 2.2]`:

```
clamp( 3.0, -2.2, 2.2) = 2.2    // vượt phải → kẹp lại
clamp(-5.0, -2.2, 2.2) = -2.2   // vượt trái → kẹp lại
clamp( 1.0, -2.2, 2.2) = 1.0    // trong khoảng → giữ nguyên
```

### A.7 Chuyển động đều: quãng đường = vận tốc × thời gian

Vật lý cơ bản: `s = v × t`. Trong game:

```
Δvị_trí = speed × delta
```

Ví dụ `speed = 2.4` (đơn vị/giây), khung hình 60fps nên `delta ≈ 0.0167s`:

```
mỗi khung đi:  2.4 × 0.0167 ≈ 0.04 đơn vị
sau 1 giây:    0.04 × 60 ≈ 2.4 đơn vị   ✓ đúng bằng speed
```

Máy 30fps thì `delta ≈ 0.033s`, mỗi khung đi 0.08 đơn vị, nhưng chỉ 30 khung/giây →
vẫn 2.4 đơn vị/giây. **Đó là lý do luôn nhân `delta`.**

---

## Cheat-sheet

| Khái niệm | Một câu |
|-----------|---------|
| `<Canvas>` | Scene + Camera + Renderer + vòng lặp, gói trong 1 thẻ |
| `useFrame((s, delta) => …)` | Chạy mỗi khung hình (~60fps); nơi mọi chuyển động diễn ra |
| `delta` | Số giây của khung hình đó → `pos += speed * delta` cho đều |
| `position [x,y,z]` | Vị trí; đổi x = trái/phải, z = xa/gần |
| `rotation.y` | Xoay quanh trục đứng (radian) |
| chuẩn hoá vector | Chia cho độ dài để đi chéo không nhanh hơn |
| `lerp` / nội suy dần | Nhích 1 phần nhỏ mỗi khung → mượt (xoay, camera) |
| `useGLTF` / `useAnimations` | Nạp model + các clip animation |
| `fadeIn/fadeOut` | Chuyển animation mượt (crossfade) |
| `useRef` (input) | Đổi giá trị mà không re-render → hợp với 60fps |
