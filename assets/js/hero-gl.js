/* =========================================================
   Mariluz Festas — cena WebGL do hero (Three.js)
   Sequência cinematográfica das decorações: zoom lento,
   profundidade de campo, transição líquida, luz ambiente
   que acompanha o cursor e partículas discretas.
   Three.js só é baixado se o aparelho suportar WebGL.
   ========================================================= */
const canvas = document.querySelector('.hero-gl');
const hero = document.querySelector('.hero');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const saveData = navigator.connection && navigator.connection.saveData;

const supportsGL = (() => {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; }
})();

const IMAGES = [
  'assets/img/tema-oh-baby.webp',
  'assets/img/tema-praia.webp',
  'assets/img/tema-batman.webp'
];

if (canvas && supportsGL && !reduced && !saveData) start();

async function start() {
  const THREE = await import('../vendor/three.module.min.js');
  const mobile = innerWidth < 900;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.25 : 1.5));
  renderer.setClearColor(0x111112, 1);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const loader = new THREE.TextureLoader();
  const load = (src) => new Promise((res, rej) => loader.load(src, (t) => {
    t.colorSpace = THREE.SRGBColorSpace;
    t.minFilter = THREE.LinearFilter;
    t.generateMipmaps = false;
    res(t);
  }, undefined, rej));

  let textures;
  try { textures = await Promise.all(IMAGES.map(load)); } catch (e) { return; }
  const size = (t) => new THREE.Vector2(t.image.width, t.image.height);

  /* ---------- Plano de fundo: fotografia com direção de arte ---------- */
  const bgMat = new THREE.ShaderMaterial({
    uniforms: {
      uA: { value: textures[0] }, uB: { value: textures[0] },
      uSizeA: { value: size(textures[0]) }, uSizeB: { value: size(textures[0]) },
      uProgress: { value: 0 }, uTime: { value: 0 }, uAgeA: { value: 0 }, uAgeB: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) }, uMouse: { value: new THREE.Vector2(0, 0) },
      uBlur: { value: mobile ? .0025 : .0045 }
    },
    vertexShader: /* glsl */`
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
    `,
    fragmentShader: /* glsl */`
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uA, uB;
      uniform vec2 uSizeA, uSizeB, uRes, uMouse;
      uniform float uProgress, uTime, uAgeA, uAgeB, uBlur;

      float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float noise(vec2 p) {
        vec2 i = floor(p), f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
      }
      float fbm(vec2 p) { float v = 0.0, a = .5; for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.02; a *= .5; } return v; }

      vec2 cover(vec2 uv, vec2 img) {
        float rs = uRes.x / uRes.y, ri = img.x / img.y;
        vec2 s = rs > ri ? vec2(1.0, ri / rs) : vec2(rs / ri, 1.0);
        return (uv - .5) * s + .5;
      }
      // zoom lento de câmera (Ken Burns) + parallax do cursor
      vec2 camera(vec2 uv, float age, vec2 img, float seed) {
        float z = 1.0 + .10 * (1.0 - smoothstep(0.0, 9.0, age));
        vec2 drift = vec2(sin(seed * 3.1), cos(seed * 1.7)) * .015 * smoothstep(0.0, 9.0, age);
        uv = (uv - .5) / z + .5 + drift + uMouse * .012;
        return cover(uv, img);
      }
      // profundidade de campo: disco com ângulo dourado
      vec3 soft(sampler2D t, vec2 uv, float r) {
        vec3 acc = vec3(0.0); float tot = 0.0;
        for (int i = 0; i < 16; i++) {
          float fi = float(i);
          float rad = sqrt((fi + .5) / 16.0) * r;
          float ang = fi * 2.39996323;
          vec2 o = vec2(cos(ang), sin(ang)) * rad * vec2(uRes.y / uRes.x, 1.0);
          acc += texture2D(t, clamp(uv + o, .001, .999)).rgb; tot += 1.0;
        }
        return acc / tot;
      }

      void main() {
        vec2 uv = vUv;
        float n = fbm(uv * 3.0 + uTime * .03);
        float p = uProgress;
        // transição líquida guiada por ruído
        float m = smoothstep(n - .22, n + .22, p * 1.44 - .22);
        float bump = sin(p * 3.14159);
        vec2 warp = (vec2(fbm(uv * 4.0 + 7.0), fbm(uv * 4.0 + 3.0)) - .5) * .06 * bump;

        float r = uBlur * (1.0 + bump * 2.5);
        vec3 a = soft(uA, camera(uv + warp, uAgeA, uSizeA, 1.0), r);
        vec3 b = soft(uB, camera(uv - warp, uAgeB, uSizeB, 2.0), r);
        vec3 col = mix(a, b, m);

        // gradação: menos saturação, tom quente, contraste suave
        float l = dot(col, vec3(.2126, .7152, .0722));
        col = mix(vec3(l), col, .6);
        col *= vec3(1.05, 1.0, .93);
        col = (col - .5) * .92 + .5;
        col *= .74;

        // luz ambiente que segue o cursor
        vec2 lp = vec2(.72, .62) + uMouse * vec2(.18, .12);
        float d = length((uv - lp) * vec2(uRes.x / uRes.y, 1.0));
        col += vec3(1.0, .92, .8) * .09 * exp(-d * 2.4);

        // vinheta e grão
        float v = smoothstep(1.25, .25, length((uv - .5) * vec2(1.1, 1.3)));
        col *= mix(.55, 1.0, v);
        col += (hash(uv * uRes + fract(uTime) * 100.0) - .5) * .035;
        gl_FragColor = vec4(col, 1.0);
      }
    `,
    depthTest: false, depthWrite: false
  });
  const bg = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), bgMat);
  scene.add(bg);

  /* ---------- Partículas: poeira de luz ---------- */
  const COUNT = mobile ? 70 : 150;
  const pos = new Float32Array(COUNT * 3), seed = new Float32Array(COUNT);
  for (let i = 0; i < COUNT; i++) {
    pos[i * 3] = Math.random() * 2 - 1;
    pos[i * 3 + 1] = Math.random() * 2 - 1;
    pos[i * 3 + 2] = Math.random();
    seed[i] = Math.random();
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  pGeo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
  const pMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uMouse: { value: new THREE.Vector2() }, uDpr: { value: renderer.getPixelRatio() } },
    vertexShader: /* glsl */`
      attribute float aSeed;
      uniform float uTime, uDpr;
      uniform vec2 uMouse;
      varying float vAlpha;
      void main() {
        vec3 p = position;
        float depth = p.z;
        p.y = mod(p.y + 1.0 + uTime * (.008 + .02 * aSeed), 2.0) - 1.0;
        p.x += sin(uTime * .2 + aSeed * 20.0) * .02 + uMouse.x * .03 * depth;
        p.y += uMouse.y * .02 * depth;
        gl_Position = vec4(p.xy, 0.0, 1.0);
        gl_PointSize = (1.0 + depth * 2.6) * uDpr;
        float tw = .5 + .5 * sin(uTime * (.6 + aSeed) + aSeed * 40.0);
        vAlpha = (.12 + .3 * depth) * tw;
      }
    `,
    fragmentShader: /* glsl */`
      varying float vAlpha;
      void main() {
        float d = length(gl_PointCoord - .5);
        float a = smoothstep(.5, 0.0, d) * vAlpha;
        gl_FragColor = vec4(1.0, .94, .84, a);
      }
    `,
    transparent: true, depthTest: false, depthWrite: false, blending: THREE.AdditiveBlending
  });
  scene.add(new THREE.Points(pGeo, pMat));

  /* ---------- Estado ---------- */
  const mouse = new THREE.Vector2(), target = new THREE.Vector2();
  addEventListener('pointermove', (e) => { target.set(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight * 2 - 1)); }, { passive: true });

  let current = 0, trans = null, ageA = 0, ageB = 0;
  const goTo = (i) => {
    if (i === current && !trans) return;
    if (trans) { // conclui a transição anterior antes de começar outra
      bgMat.uniforms.uA.value = bgMat.uniforms.uB.value;
      bgMat.uniforms.uSizeA.value = bgMat.uniforms.uSizeB.value;
      ageA = ageB;
    }
    bgMat.uniforms.uB.value = textures[i];
    bgMat.uniforms.uSizeB.value = size(textures[i]);
    ageB = 0; current = i; trans = { t: 0, dur: 2.4 };
  };
  addEventListener('hero:goto', (e) => goTo(e.detail.index));

  const resize = () => {
    const w = hero.clientWidth, h = hero.clientHeight;
    renderer.setSize(w, h, false);
    bgMat.uniforms.uRes.value.set(w, h);
  };
  resize();
  addEventListener('resize', resize);

  let visible = true;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) tick(); }, { threshold: 0 }).observe(hero);

  const ease = (t) => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const clock = new THREE.Clock();
  let running = false, first = true;
  function tick() {
    if (running) return;
    running = true;
    requestAnimationFrame(frame);
  }
  function frame() {
    if (!visible || document.hidden) { running = false; clock.getDelta(); return; }
    const dt = Math.min(clock.getDelta(), .05);
    const t = clock.elapsedTime;
    ageA += dt; ageB += dt;
    mouse.lerp(target, .04);
    if (trans) {
      trans.t += dt;
      const k = Math.min(trans.t / trans.dur, 1);
      bgMat.uniforms.uProgress.value = ease(k);
      if (k >= 1) {
        bgMat.uniforms.uA.value = bgMat.uniforms.uB.value;
        bgMat.uniforms.uSizeA.value = bgMat.uniforms.uSizeB.value;
        bgMat.uniforms.uProgress.value = 0;
        ageA = ageB; trans = null;
      }
    }
    bgMat.uniforms.uTime.value = t;
    bgMat.uniforms.uAgeA.value = ageA;
    bgMat.uniforms.uAgeB.value = ageB;
    bgMat.uniforms.uMouse.value.copy(mouse);
    pMat.uniforms.uTime.value = t;
    pMat.uniforms.uMouse.value.copy(mouse);
    renderer.render(scene, camera);
    if (first) { first = false; canvas.classList.add('is-ready'); hero.classList.add('has-gl'); }
    requestAnimationFrame(frame);
  }
  document.addEventListener('visibilitychange', () => { if (!document.hidden) tick(); });
  tick();
}
