import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Vector3 } from 'three'

function Box(props) {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef()
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)

  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => {
    ref.current.rotation.x += delta;
  });
  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}

function AnimateCamera() {
  const mouse = {
    x: 0,
    y: 0,
  }
  const camera = useThree(state => state.camera);
  const originalCameraQuaternion = camera.quaternion;

  useEffect(() => {
    const mouseMoveListener = (e) => {
      const { innerWidth, innerHeight } = window;
      const { clientX, clientY } = e;
      /* Normalize the values to be [-0.5..0.5] */
      const mouseX = (clientX / innerWidth) - 0.5;
      const mouseY = ((clientY / innerHeight) - 0.5) * -1;
      mouse.x = mouseX;
      mouse.y = mouseY;
    }
    window.addEventListener('mousemove', mouseMoveListener);

    return () => {
      window.removeEventListener('mousemove', mouseMoveListener);
    }
  }, []);

  useFrame((state) => {
    const lookAt = new Vector3(0, 0, -1);
    lookAt.applyQuaternion(originalCameraQuaternion);
    lookAt.add(new Vector3(mouse.x, mouse.y, 0));
    state.camera.lookAt(lookAt);
  });
}

export default function App() {
  return (
    <Canvas>
      <AnimateCamera/>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <Box position={[0, 0, 0]} />
      <OrbitControls />
    </Canvas>
  )
}
