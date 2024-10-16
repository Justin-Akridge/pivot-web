// @ts-nocheck this is a javascript file
import { Toolbar } from './Toolbar';
import * as THREE from 'three';
import { useEffect, useRef, useState } from "react"
import MapInstance from "./MapInstance";
import { Sidebar } from "./Sidebar";
import { useJobContext } from "@/context/JobContext";
import { Navbar } from './Navbar';
export function addMeasurement(viewer) {
  // @ts-expect-error measuring tool is js library
  const measure = viewer.measuringTool.startInsertion({
    showDistances: false,
    showAngles: false,
    showCoordinates: true,
    showArea: false,
    closed: true,
    maxMarkers: 1,
    name: 'Point'
  });

  return measure
}

//TODO WORKING ON adding the measurements to potree viewer
export function Viewer() {
  const viewerRef = useRef<HTMLDivElement>();
  const { viewer, setViewer, selectedMarker, activeMeasurement, setActiveMeasurement } = useJobContext();
  const [showViewer, setShowViewer] = useState<boolean>(true);

  useEffect(() => {
    console.log(selectedMarker)
    if (!selectedMarker) return 
    const polePosition = new THREE.Vector3(
      selectedMarker.x,
      selectedMarker.y,
      selectedMarker.z
    );

    let zLevel = -2;
    if (selectedMarker.pole1) {
      zLevel = -5;
    }
    targetTo(viewer, polePosition, zLevel)
  },[selectedMarker])

  const targetTo = (viewer, target, zLevel) => {
		const {view} = viewer.scene;
		viewer.scene.orbitControls = true;

		let d = viewer.scene.view.direction.multiplyScalar(-2);
		let cameraTargetPosition = new THREE.Vector3().addVectors(target, d.multiplyScalar(10));
		let animationDuration = 400;
		let easing = TWEEN.Easing.Quartic.Out;

		let tweens = []

			{ // animate
				let value = {x: 0};
				let tween = new TWEEN.Tween(value).to({x: animationDuration});
				tween.easing(easing);
				tweens.push(tween);

				let startPos = viewer.scene.view.position.clone();
				let targetPos = cameraTargetPosition.clone();
				let startRadius = viewer.scene.view.radius;
				let targetRadius = cameraTargetPosition.distanceTo(target); 

				tween.onUpdate(() => {
					// let t = value.x;
					let t = value.x / animationDuration; 
					viewer.scene.view.position.x = (1 - t) * startPos.x + t * targetPos.x;
					viewer.scene.view.position.y = (1 - t) * startPos.y + t * targetPos.y;
					viewer.scene.view.position.z = (1 - t) * startPos.z + t * targetPos.z + zLevel;

					viewer.scene.view.radius = (1 - t) * startRadius + t * targetRadius;
					viewer.setMoveSpeed(viewer.scene.view.radius);
				});

				tween.onComplete(() => {
					tweens = tweens.filter(e => e !== tween);
				});

				tween.start();
			}
		view.position.copy(cameraTargetPosition);
	};

  useEffect(() => {
    // Ensure Potree is ready and viewer is initialized
    //@ts-expect-error Potree is a js library
    const viewer = new Potree.Viewer(viewerRef.current);
    setViewer(viewer);

    //@ts-expect-error Potree is a js library
    Potree.loadPointCloud("/whiteland/metadata.json", "whiteland", function(e) {
      viewer.scene.addPointCloud(e.pointcloud);
      const material = e.pointcloud.material;
			material.size = 0.7;
			material.shape = Potree.PointShape.CIRCLE;
			material.pointSizeType = Potree.PointSizeType.ADAPTIVE;
			// material.activeAttributeName = "classification";
      viewer.fitToScreen()
    })
  }, []);

  return (
    <div className='h-screen overflow-hidden'>
    <Navbar />
    <div className='w-full overflow-hidden flex h-full top-12'>
      <Toolbar />
      <div className='w-1/2 h-full relative'>
        <div className="absolute w-full h-full" ref={viewerRef}></div>
      </div>
      <div className='w-1/2 h-full relative bottom-12'>
        <MapInstance />
      </div>
      <Sidebar />
    </div>
    </div>
  );
}