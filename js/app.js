const module = {
	frame: 0, camera: null, renderer: null, scene: null, controls: null,
	
	init() {
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
		this.controls = new THREE.TrackballControls( this.camera );
		this.clock = new THREE.Clock();

		var renderer = new THREE.WebGLRenderer( {antialias: true});
		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.setClearColor(0xEEEEEE);
		renderer.shadowMap.enabled = true;
		this.renderer = renderer;
		document.body.appendChild( this.renderer.domElement );

		this.stats = new Stats();
		this.stats.showPanel( 0 );
		document.body.appendChild( this.stats.dom );
		
		this.setupEvents();
		this.createWorld();
		this.createObjects();
		this.createLights();
		this.animate();
		
		
		
		this.controls.rotateSpeed = 1.0;
		this.controls.zoomSpeed = 1.2;
		this.controls.panSpeed = 0.8;
		this.controls.noZoom = false;
		this.controls.noPan = false;
		this.controls.staticMoving = true;
		this.controls.dynamicDampingFactor = 0.3;

	},

	setupEvents() {
		window.addEventListener( 'resize', () => {
			this.camera.aspect = window.innerWidth / window.innerHeight;
			this.camera.updateProjectionMatrix();
			this.renderer.setSize( window.innerWidth, window.innerHeight );
		}, false );
		
		this.raycaster = new THREE.Raycaster();
		this.mouse = new THREE.Vector2();
		this.selectedObj = null;
		
		window.addEventListener('mousemove', (event) => {
		   this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		   this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
		   this.raycaster.setFromCamera(this.mouse, this.camera);
		   var intersects = this.raycaster.intersectObjects(this.scene.children, true);
		   for (var i = 0; i < intersects.length; i++) {
			   //if (this.changeSelection(intersects[i].object)) break;;
		   }
		}, false);

	},

	changeSelection(obj) {
	   if (obj != this.skysphere && this.selectedObj != obj) {
		   if (this.selectedObj)
			   this.selectedObj.material.color.set(new THREE.Color());
		   this.selectedObj = obj;
		   this.selectedObj.material.color.set(0xff0000);
		   console.log(obj.name);
		   return true;
	   }
	},

	createWorld() {
		this.camera.position.z = 1000;
		
		var objects = [];
		var loader = new THREE.GLTFLoader();
		loader.load( `beetle.gltf`, ( gltf ) => {
			gltf.scene.scale.set(100, 100, 100);
			gltf.scene.position.copy(this.camera.position);
			gltf.scene.position.z -= 200;
			gltf.scene.position.y -= 70;
			gltf.scene.position.x = -200;
			gltf.scene.rotation.y = 80;
			this.scene.add( gltf.scene );

			gltf.scene.traverse( function( beetle ) {
				if ( beetle.isMesh ) objects.push( beetle );
			} );
		});
		loader.load( `spider.gltf`, ( gltf ) => {
			gltf.scene.scale.set(100, 100, 100);
			gltf.scene.position.copy(this.camera.position);
			gltf.scene.position.z -= 220;
			gltf.scene.position.y = 70;
			gltf.scene.position.x = 200;
			gltf.scene.rotation.y = 40;
			this.scene.add( gltf.scene );

			gltf.scene.traverse( function( spider ) {
				if ( spider.isMesh ) objects.push( spider );
			} );
		});
		loader.load( `tree.gltf`, ( gltf ) => {
			gltf.scene.scale.set(100, 100, 100);
			gltf.scene.position.copy(this.camera.position);
			gltf.scene.position.z -= 1200;
			gltf.scene.position.y = -160;
			gltf.scene.position.x = 200;
			gltf.scene.rotation.y = 40;
			this.scene.add( gltf.scene );
			
			gltf.scene.traverse( function( tree ) {
				if ( tree.isMesh ) objects.push( tree );
			} );
		});
		
		var contr = this.controls;
		
		var dragControls = new THREE.DragControls( objects, this.camera, this.renderer.domElement );
		dragControls.addEventListener( 'dragstart', function ( event ) { contr.enabled = false; } );
		dragControls.addEventListener( 'dragend', function ( event ) { contr.enabled = true; } );
		
	},
	
	createObjects() {
		var geometry = new THREE.SphereGeometry( 6970, 32, 32 );
		var material = new THREE.MeshStandardMaterial( {emissive: 0xEEEE99} );
	},

	createLights() {
		var spotLight = new THREE.PointLight( 0xffffff, 1, this.camera.close, 2 );
		spotLight.castShadow = true;
		spotLight.penumbra = 0.5;
		spotLight.shadow.mapSize.width = 1024;
		spotLight.shadow.mapSize.height = 1024;
		this.scene.add( new THREE.AmbientLight( 0x404040 ) );
		this.scene.add( spotLight );
	},

	animate() {
	
		
		requestAnimationFrame(() => this.animate());
		this.controls.update();
		this.renderer.render(this.scene, this.camera);
		
		this.stats.update();
	},

}

module.init();
