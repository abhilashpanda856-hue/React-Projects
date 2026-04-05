export const blackHoleVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const blackHoleFragmentShader = `
  uniform float uTime;
  uniform vec2 uResolution;
  uniform float uBlackHoleRadius;
  uniform float uAccretionDiskInner;
  uniform float uAccretionDiskOuter;
  
  varying vec2 vUv;
  varying vec3 vPosition;
  
  #define PI 3.14159265359
  #define MAX_STEPS 128
  #define MAX_DIST 100.0
  #define EPSILON 0.001
  
  // Noise functions for disk detail
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }
  
  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    
    for (int i = 0; i < 6; i++) {
      value += amplitude * noise(p * frequency);
      amplitude *= 0.5;
      frequency *= 2.0;
    }
    
    return value;
  }
  
  // Gravitational lensing - ray bending
  vec3 gravitationalLensing(vec3 rayDir, vec3 rayOrigin, float schwarzschildRadius) {
    vec3 position = rayOrigin;
    vec3 velocity = normalize(rayDir);
    float stepSize = 0.05;
    
    for (int i = 0; i < MAX_STEPS; i++) {
      float r = length(position);
      
      if (r < schwarzschildRadius * 1.5) {
        return vec3(0.0); // Ray fell into black hole
      }
      
      if (r > MAX_DIST) {
        return velocity; // Ray escaped
      }
      
      // Gravitational acceleration (simplified Schwarzschild geodesic)
      float gravitationalStrength = schwarzschildRadius / (r * r);
      vec3 acceleration = -normalize(position) * gravitationalStrength;
      
      // Velocity Verlet integration
      velocity += acceleration * stepSize * 0.5;
      position += velocity * stepSize;
      velocity += acceleration * stepSize * 0.5;
      velocity = normalize(velocity);
    }
    
    return velocity;
  }
  
  // Accretion disk color and intensity
  vec4 accretionDisk(vec3 pos, float time) {
    float r = length(pos.xz);
    float angle = atan(pos.z, pos.x);
    
    // Disk boundaries
    float innerRadius = uAccretionDiskInner;
    float outerRadius = uAccretionDiskOuter;
    
    if (r < innerRadius || r > outerRadius) {
      return vec4(0.0);
    }
    
    // Disk height (thin disk approximation)
    float diskHeight = 0.05 * (1.0 - (r - innerRadius) / (outerRadius - innerRadius));
    if (abs(pos.y) > diskHeight) {
      return vec4(0.0);
    }
    
    // Radial temperature profile (hotter near center)
    float temperature = pow((innerRadius / r), 0.75);
    
    // Spiral arm structure
    float spiralAngle = angle + time * 0.3 + log(r) * 3.0;
    float spiral = sin(spiralAngle * 4.0) * 0.5 + 0.5;
    
    // Turbulence and noise
    vec2 noiseCoord = vec2(r * 5.0, angle * 3.0 + time * 0.5);
    float turbulence = fbm(noiseCoord);
    
    // Doppler beaming (relativistic effect - one side brighter)
    float dopplerAngle = angle + time * 0.5;
    float doppler = 1.0 + 0.5 * sin(dopplerAngle);
    
    // Color based on temperature
    vec3 hotColor = vec3(1.0, 0.9, 0.8);      // White-hot inner
    vec3 warmColor = vec3(1.0, 0.5, 0.1);     // Orange middle
    vec3 coolColor = vec3(0.8, 0.2, 0.05);    // Red outer
    vec3 blueShift = vec3(0.4, 0.6, 1.0);     // Blue-shifted regions
    
    vec3 color = mix(coolColor, warmColor, temperature);
    color = mix(color, hotColor, pow(temperature, 2.0));
    color = mix(color, blueShift, doppler * 0.3 * temperature);
    
    // Apply spiral and turbulence
    float intensity = temperature * (0.7 + 0.3 * spiral) * (0.8 + 0.4 * turbulence) * doppler;
    
    // Edge softening
    float edgeFade = smoothstep(innerRadius, innerRadius + 0.2, r) * 
                     smoothstep(outerRadius, outerRadius - 0.3, r);
    float heightFade = 1.0 - smoothstep(0.0, diskHeight, abs(pos.y));
    
    intensity *= edgeFade * heightFade;
    
    return vec4(color * intensity * 2.5, intensity);
  }
  
  // Photon sphere ring
  vec3 photonSphere(vec3 rayDir, float radius) {
    float angle = acos(dot(normalize(rayDir.xz), vec2(1.0, 0.0)));
    float ring = smoothstep(0.02, 0.0, abs(length(rayDir.xz) - radius * 1.5));
    
    vec3 ringColor = vec3(1.0, 0.95, 0.8);
    return ringColor * ring * 3.0;
  }
  
  // Background stars
  vec3 starField(vec3 dir) {
    vec3 stars = vec3(0.0);
    
    // Multiple star layers
    for (int i = 0; i < 3; i++) {
      float scale = 100.0 + float(i) * 50.0;
      vec2 starCoord = dir.xz / (abs(dir.y) + 0.1) * scale + float(i) * 100.0;
      
      float starNoise = hash(floor(starCoord));
      
      if (starNoise > 0.98) {
        float brightness = pow(starNoise - 0.98, 0.5) * 20.0;
        vec3 starColor = mix(
          vec3(1.0, 0.8, 0.6),
          vec3(0.6, 0.8, 1.0),
          hash(floor(starCoord) + 0.5)
        );
        stars += starColor * brightness * 0.3;
      }
    }
    
    return stars;
  }
  
  // Nebula background
  vec3 nebula(vec3 dir, float time) {
    vec2 uv = dir.xz / (abs(dir.y) + 0.5);
    
    float n1 = fbm(uv * 2.0 + time * 0.02);
    float n2 = fbm(uv * 3.0 - time * 0.015 + 100.0);
    
    vec3 nebulaColor1 = vec3(0.1, 0.0, 0.2) * n1;
    vec3 nebulaColor2 = vec3(0.05, 0.02, 0.1) * n2;
    
    return (nebulaColor1 + nebulaColor2) * 0.5;
  }
  
  void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    uv.x *= uResolution.x / uResolution.y;
    
    // Camera setup
    vec3 rayOrigin = vec3(0.0, 2.0, -8.0);
    vec3 rayDir = normalize(vec3(uv.x, uv.y - 0.2, 1.5));
    
    // Apply slight camera rotation over time
    float camAngle = uTime * 0.05;
    mat2 rot = mat2(cos(camAngle), -sin(camAngle), sin(camAngle), cos(camAngle));
    rayOrigin.xz = rot * rayOrigin.xz;
    rayDir.xz = rot * rayDir.xz;
    
    float schwarzschildRadius = uBlackHoleRadius;
    
    // Initialize color
    vec3 color = vec3(0.0);
    
    // Ray marching with gravitational lensing
    vec3 pos = rayOrigin;
    vec3 dir = normalize(rayDir);
    float totalDist = 0.0;
    vec4 accumulatedDisk = vec4(0.0);
    
    for (int i = 0; i < MAX_STEPS; i++) {
      float r = length(pos);
      
      // Event horizon check
      if (r < schwarzschildRadius) {
        color = vec3(0.0);
        break;
      }
      
      // Gravitational bending
      float bendStrength = schwarzschildRadius * schwarzschildRadius / (r * r);
      vec3 toCenter = -normalize(pos);
      dir = normalize(dir + toCenter * bendStrength * 0.1);
      
      // Check accretion disk intersection
      if (abs(pos.y) < 0.1) {
        vec4 diskColor = accretionDisk(pos, uTime);
        accumulatedDisk += diskColor * (1.0 - accumulatedDisk.a) * 0.2;
      }
      
      // Move along ray
      float stepSize = max(0.05, (r - schwarzschildRadius) * 0.1);
      pos += dir * stepSize;
      totalDist += stepSize;
      
      if (totalDist > MAX_DIST) {
        // Ray escaped - render background
        color = starField(dir) + nebula(dir, uTime);
        
        // Add photon ring glow
        float photonDist = abs(length(pos.xz) - schwarzschildRadius * 1.5);
        if (abs(pos.y) < 0.5) {
          float ringIntensity = exp(-photonDist * 2.0) * (1.0 - abs(pos.y) / 0.5);
          color += vec3(1.0, 0.9, 0.7) * ringIntensity * 2.0;
        }
        break;
      }
    }
    
    // Combine disk with background
    color = mix(color, accumulatedDisk.rgb, accumulatedDisk.a);
    
    // Add gravitational lensing glow around event horizon
    vec2 centerUV = vUv * 2.0 - 1.0;
    float distToCenter = length(centerUV);
    float eventHorizonGlow = exp(-pow(distToCenter - 0.15, 2.0) * 50.0);
    color += vec3(1.0, 0.6, 0.2) * eventHorizonGlow * 0.5;
    
    // Outer photon ring
    float photonRing = exp(-pow(distToCenter - 0.2, 2.0) * 100.0);
    color += vec3(1.0, 0.95, 0.8) * photonRing * 0.8;
    
    // Tone mapping
    color = color / (color + vec3(1.0));
    color = pow(color, vec3(1.0 / 2.2));
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

// Accretion disk shader for 3D geometry approach
export const accretionDiskVertexShader = `
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  varying vec3 vNormal;
  uniform float uTime;
  
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    
    // Add subtle wave animation
    float wave = sin(position.x * 3.0 + uTime) * cos(position.z * 3.0 + uTime * 0.7) * 0.02;
    vec3 newPosition = position;
    newPosition.y += wave;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

export const accretionDiskFragmentShader = `
  uniform float uTime;
  uniform float uInnerRadius;
  uniform float uOuterRadius;
  
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  varying vec3 vNormal;
  
  #define PI 3.14159265359
  
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }
  
  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    
    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(p);
      p *= 2.0;
      amplitude *= 0.5;
    }
    
    return value;
  }
  
  void main() {
    vec2 centeredUV = vUv * 2.0 - 1.0;
    float dist = length(centeredUV);
    float angle = atan(centeredUV.y, centeredUV.x);
    
    // Normalize distance for color calculation
    float normalizedDist = (dist - uInnerRadius) / (uOuterRadius - uInnerRadius);
    normalizedDist = clamp(normalizedDist, 0.0, 1.0);
    
    // Temperature profile - hotter near center
    float temperature = pow(1.0 - normalizedDist, 0.75);
    
    // Spiral arms
    float spiralAngle = angle + uTime * 0.4 + log(dist + 0.1) * 4.0;
    float spiral = sin(spiralAngle * 5.0) * 0.5 + 0.5;
    float spiral2 = sin(spiralAngle * 3.0 + PI) * 0.5 + 0.5;
    
    // Turbulence
    vec2 noiseCoord = vec2(dist * 8.0, angle * 2.0 / PI + uTime * 0.3);
    float turb = fbm(noiseCoord);
    
    // Fine detail noise
    vec2 fineNoiseCoord = vec2(dist * 20.0, angle * 5.0 / PI + uTime * 0.5);
    float fineNoise = noise(fineNoiseCoord);
    
    // Doppler beaming effect
    float dopplerAngle = angle + uTime * 0.3;
    float doppler = 0.7 + 0.5 * sin(dopplerAngle);
    
    // Color palette
    vec3 innerColor = vec3(1.0, 1.0, 0.95);      // White-hot
    vec3 hotColor = vec3(1.0, 0.7, 0.3);         // Orange-yellow
    vec3 warmColor = vec3(1.0, 0.4, 0.1);        // Orange
    vec3 coolColor = vec3(0.8, 0.15, 0.05);      // Deep red
    vec3 coldColor = vec3(0.3, 0.05, 0.02);      // Dark red
    
    // Blue-shifted region
    vec3 blueShift = vec3(0.5, 0.7, 1.0);
    
    // Mix colors based on temperature
    vec3 color;
    if (temperature > 0.8) {
      color = mix(hotColor, innerColor, (temperature - 0.8) / 0.2);
    } else if (temperature > 0.5) {
      color = mix(warmColor, hotColor, (temperature - 0.5) / 0.3);
    } else if (temperature > 0.2) {
      color = mix(coolColor, warmColor, (temperature - 0.2) / 0.3);
    } else {
      color = mix(coldColor, coolColor, temperature / 0.2);
    }
    
    // Apply blue shift to approaching side
    float blueAmount = max(0.0, sin(dopplerAngle)) * temperature * 0.4;
    color = mix(color, blueShift * length(color), blueAmount);
    
    // Apply spiral and turbulence
    float intensity = (0.6 + 0.4 * spiral) * (0.5 + 0.5 * spiral2);
    intensity *= (0.7 + 0.5 * turb);
    intensity *= (0.9 + 0.2 * fineNoise);
    intensity *= doppler;
    
    // Edge fading
    float innerFade = smoothstep(0.0, 0.15, normalizedDist);
    float outerFade = smoothstep(1.0, 0.7, normalizedDist);
    intensity *= innerFade * outerFade;
    
    // Hot spots
    float hotSpots = pow(turb, 3.0) * temperature;
    color += vec3(1.0, 0.9, 0.7) * hotSpots * 0.5;
    
    // Final color with intensity
    vec3 finalColor = color * intensity * 2.0;
    
    // Alpha for transparency
    float alpha = intensity * innerFade * outerFade;
    alpha = clamp(alpha, 0.0, 1.0);
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

// Photon ring shader
export const photonRingVertexShader = `
  varying vec2 vUv;
  uniform float uTime;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const photonRingFragmentShader = `
  uniform float uTime;
  uniform float uRadius;
  
  varying vec2 vUv;
  
  void main() {
    vec2 centeredUV = vUv * 2.0 - 1.0;
    float dist = length(centeredUV);
    float angle = atan(centeredUV.y, centeredUV.x);
    
    // Ring profile - sharp, bright
    float ring = exp(-pow((dist - 0.5) * 15.0, 2.0));
    
    // Secondary inner ring (Einstein ring)
    float innerRing = exp(-pow((dist - 0.35) * 20.0, 2.0)) * 0.5;
    
    // Variation around the ring
    float variation = 0.8 + 0.2 * sin(angle * 8.0 + uTime * 2.0);
    float variation2 = 0.9 + 0.1 * sin(angle * 16.0 - uTime * 3.0);
    
    // Combine rings
    float totalRing = (ring + innerRing) * variation * variation2;
    
    // Color - bright golden white
    vec3 color = vec3(1.0, 0.95, 0.85) * totalRing * 3.0;
    
    // Add subtle color variation
    color += vec3(1.0, 0.6, 0.2) * ring * 0.5;
    
    float alpha = totalRing;
    
    gl_FragColor = vec4(color, alpha);
  }
`;

// Event horizon shader
export const eventHorizonVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const eventHorizonFragmentShader = `
  uniform float uTime;
  
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    vec2 centeredUV = vUv * 2.0 - 1.0;
    float dist = length(centeredUV);
    
    // Pure black center with edge glow
    float edgeGlow = smoothstep(0.8, 1.0, dist);
    vec3 glowColor = vec3(0.3, 0.1, 0.0) * edgeGlow;
    
    // Very faint surface detail
    float detail = sin(centeredUV.x * 20.0 + uTime) * sin(centeredUV.y * 20.0 + uTime * 0.7) * 0.02;
    
    vec3 color = glowColor + detail;
    float alpha = 1.0 - edgeGlow * 0.5;
    
    gl_FragColor = vec4(color, alpha);
  }
`; 