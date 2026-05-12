# Phantom Bottle 🍊

A lightweight, highly performant React application demonstrating a **2.5D Relighting** effect using `@react-three/fiber`.

This project creates the illusion of a fully rendered 3D Fanta bottle without the overhead of loading complex `.gltf` or `.obj` models. By intelligently layering 2D maps on a simple flat plane, we achieve a dynamic, interactive "fake 3D" result.

## The Texture Pipeline Tester 🎛️

This project includes an interactive Texture Pipeline Tester. It demonstrates how different PBR (Physically Based Rendering) maps contribute to the final 2.5D illusion. You can toggle each map individually directly in the UI:

*   **Diffuse (Color) Map:** The core image. With all other maps turned off, it renders as a pure black silhouette.
*   **Normal Map:** The core trick! It bends the interactive point light to simulate the object's physical shape. When enabled alongside Diffuse, it also activates a digital `clearcoat` to fake a highly reflective glass/plastic layer.
*   **Roughness Map:** Tells the light which parts of the bottle are glossy (the plastic) and which are matte (the paper label or cap), overriding the default fake glass effect for accurate material separation.
*   **Ambient Occlusion (AO) Map:** The final step. Simulates micro-shadows in deep crevices (like the ridges under the bottle cap) ensuring the fake 3D structure feels heavy and grounded.

Experiment by turning different maps on and off to see exactly how PBR pipelines construct realistic materials!

### Why do this?
*   **Insanely Fast:** A flat plane with 4 image textures loads instantly compared to parsing a heavy `.gltf` 3D geometry file.
*   **Performance:** Consumes a fraction of the GPU/CPU power.
*   **Interactive:** When you move your mouse, a `<pointLight>` follows the cursor. The `<meshPhysicalMaterial>` calculates real-time reflections and shadows across the Normal and Roughness maps, making the flat image look undeniably 3D. Add in the environment map reflections, and the illusion is complete.

## Tech Stack 🛠

*   [Next.js](https://nextjs.org/)
*   [React](https://react.dev/)
*   [Three.js](https://threejs.org/)
*   [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction)
*   [@react-three/drei](https://github.com/pmndrs/drei)

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser. Move your mouse around the bottle to see the 2.5D lighting in action!
