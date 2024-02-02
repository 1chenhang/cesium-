/**
 * m3d源码场景 请勿下载后售卖
 * gitee:https://gitee.com/m3d
 * b站:https://www.bilibili.com/video/BV1Pk4y1X7ex/
 */
(async () => {
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjMzU2ZTQyYy1iOTU5LTQ5MDQtOGNkNC0yYzcxMTI1ZDJiZGQiLCJpZCI6NzY1OTcsImlhdCI6MTYzOTU2MDcwOH0.kbWigipGD6l2OPBGpnkkN6dzp8NuNjoHNNM1NF4gaIo';
    let viewer;
    let building;
    let building2
    let model0;
    let road;
    let isPlay = true;
    let waterPrimitive;
    /**
     * 初始化viewer
     */
    const initViewer = async () => {
        viewer = new Cesium.Viewer('sceneContainer', {
            infoBox: false,
            shouldAnimate: true,
            vrButton: false,
            geocoder: false,
            homeButton: false,
            sceneModePicker: false,
            baseLayerPicker: false,
            navigationHelpButton: false,
            animation: false,
            timeline: false,
            fullscreenButton: false,
            contextOptions: {
                requestWebgl1: false,
                allowTextureFilterAnisotropic: true,
                webgl: {
                    alpha: false,
                    depth: true,
                    stencil: false,
                    antialias: true,
                    powerPreference: 'high-performance',
                    premultipliedAlpha: true,
                    preserveDrawingBuffer: false,
                    failIfMajorPerformanceCaveat: false
                },
            },
        });

        viewer._cesiumWidget._creditContainer.style.display = "none";
        viewer.resolutionScale = 1.0;
        viewer.scene.msaaSamples = 4;
        viewer.postProcessStages.fxaa.enabled = true;
        viewer.scene.globe.depthTestAgainstTerrain = true;
        viewer.scene.debugShowFramesPerSecond = true;

        // 影像夜晚滤镜
        viewer.imageryLayers.removeAll();
        viewer.imageryLayers.addImageryProvider(new TencentImageryProvider({ style: 4 }));

        // 动态局部天空盒
        viewer.scene.skyBox = new SkyBox({
            speed: 0.05,
            sources: {
                positiveX: './Static/images/posx.jpg',
                negativeX: './Static/images/negx.jpg',
                positiveY: './Static/images/posz.jpg',
                negativeY: './Static/images/negz.jpg',
                positiveZ: './Static/images/posy.jpg',
                negativeZ: './Static/images/negy.jpg'
            }
        });

        // 场景设置
        viewer.scene.highDynamicRange = true;
        viewer.scene.postProcessStages.bloom.enabled = true;
        viewer.scene.postProcessStages.bloom.uniforms.contrast = 255
        viewer.scene.postProcessStages.bloom.uniforms.brightness = 0.05
        viewer.scene.postProcessStages.bloom.uniforms.glowOnly = false
        viewer.scene.postProcessStages.bloom.uniforms.delta = 1.1
        viewer.scene.postProcessStages.bloom.uniforms.sigma = 5
        viewer.scene.postProcessStages.bloom.uniforms.stepSize = 0.6
        viewer.scene.postProcessStages.bloom.uniforms.isSelected = false
        viewer.scene.postProcessStages.bloom.uniforms.selectedBloom = 10
        viewer.scene.postProcessStages.bloom.uniforms.bloomColor = Cesium.Color.fromCssColorString("#fafafa");
        viewer.scene.sun.show = false;
        viewer.scene.moon.show = false;
        viewer.scene.undergroundMode = false;
        viewer.scene.terrainProvider.isCreateSkirt = false;
        viewer.scene.skyAtmosphere.show = false;
        viewer.scene.globe.showGroundAtmosphere = false
        viewer.scene.globe.enableLighting = false
        viewer.scene.fog.enabled = false
        // viewer.scene.screenSpaceCameraController.minimumZoomDistance = 0;
        // viewer.scene.screenSpaceCameraController.maximumZoomDistance = 50000;
        viewer.clock.currentTime = Cesium.JulianDate.fromIso8601("2024-01-15T14:00:00Z");
        viewer.camera.setView({
            destination: { x: -2327247.038981403, y: 5390425.690024069, z: 2487093.3146744343 },
            orientation: {
                heading: Cesium.Math.toRadians(293.6635524369704),
                pitch: Cesium.Math.toRadians(-22.617957999782014),
                roll: Cesium.Math.toRadians(0.0013787893420239103)
            }
        })
        // let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        // handler.setInputAction((movement) => {
        //     let cartesian = viewer.scene.pickPosition(movement.position);
        //     let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        //     let lon = Cesium.Math.toDegrees(cartographic.longitude);
        //     let lat = Cesium.Math.toDegrees(cartographic.latitude);
        //     console.log(lon, lat, cartographic.height)
        // }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    }


    /**
     * 初始化场景
     */
    const initScene = async () => {

        const initTiles = async () => {
            // 白膜建筑
            building = await Cesium.Cesium3DTileset.fromUrl(
                "./Static/Data/gz/tileset.json", {
                customShader: new Cesium.CustomShader({
                    uniforms: {
                        u_envTexture: {
                            value: new Cesium.TextureUniform({
                                url: "./Static/images/pic.jpg"
                            }),
                            type: Cesium.UniformType.SAMPLER_2D
                        },
                        u_build1: {
                            type: Cesium.UniformType.SAMPLER_2D,
                            value: new Cesium.TextureUniform({
                                url: "./Static/images/color2.png",
                            }),
                        },
                        u_lerp: {
                            type: Cesium.UniformType.FLOAT,
                            value: -100,
                        },
                        u_lightPosition: {
                            type: Cesium.UniformType.VEC3,
                            value: Cesium.Cartesian3.fromDegrees(113.27956833332897, 23.09121843059473, 1)
                        },
                        u_lightColor: {
                            type: Cesium.UniformType.VEC3,
                            value: Cesium.Color.fromCssColorString("#6900ff")
                        },
                        u_lightPosition2: {
                            type: Cesium.UniformType.VEC3,
                            value: Cesium.Cartesian3.fromDegrees(113.35446694395083, 23.13402304623628, 1)
                        },
                        u_lightColor2: {
                            type: Cesium.UniformType.VEC3,
                            value: Cesium.Color.fromCssColorString("#FF4500")
                        },
                        u_lightRadius: {
                            type: Cesium.UniformType.FLOAT,
                            value: 2000
                        },
                        u_play: {
                            type: Cesium.UniformType.BOOL,
                            value: true
                        },
                        u_lerp2: {
                            type: Cesium.UniformType.FLOAT,
                            value: 0,
                        },
                        u_color: {
                            type: Cesium.UniformType.VEC4,
                            value: Cesium.Color.fromCssColorString("#62809b"),
                        },
                    },
                    mode: Cesium.CustomShaderMode.REPLACE_MATERIAL,
                    lightingModel: Cesium.LightingModel.UNLIT,
                    fragmentShaderText: `
                    #define sat( a ) clamp( a, 0.0, 1.0 )
                    float noise_fun(vec2 co) {   
                        return fract(sin(dot(co.xy ,vec2(12.45678, 93.970204))) * 4321.12345) * 20.;
                    }
                    float getDistanceDecay( float lightDistance, float distance,float decay) {
                        if ( distance > 0.0 && decay > 0.0 ) {
                            return pow( sat( - lightDistance / distance + 1.0 ), decay );
                        }
                        return 1.0;
                    }
                    vec3 addPointLight(vec3 lightPosition, vec3 lightColor, vec3 positionWC , vec3 normal){
                        float distance = u_lightRadius;
                        float decay = 1.0;
                        float lightDistance = length( lightPosition - positionWC );
                        lightColor *= getDistanceDecay( lightDistance, distance, decay );
                        return lightColor;
                    }
                    void fragmentMain(FragmentInput fsInput,inout czm_modelMaterial material) {
                        vec3 positionMC = fsInput.attributes.positionMC;
                        vec3 positionEC = fsInput.attributes.positionEC;
                        vec3 normalEC = fsInput.attributes.normalEC;
                        vec3 posToCamera = normalize(-positionEC); 
                        vec2 uv = fsInput.attributes.texCoord_0;
                        float diffuseCoefficient = max(0.0, dot(normalEC, vec3(0.2)) * 1.0);
                        vec4 glColor1 = vec4(0.);
                        vec4 glColor2 = vec4(0.);
                        {
                            float heightInterval = 50.0;
                            float lineWidth = 10.0;
                            float modResult = mod(positionMC.z, heightInterval);
                            vec3 finalColor = vec3(0.3);
                            vec4 textureColor3 = texture(u_build1,vec2(fract(uv.s),float(uv.t * 5.0) - (czm_frameNumber/60.)));
                            if (modResult < lineWidth / 2.0) {
                                finalColor = textureColor3.rgb * 2.5;
                            }
                            glColor1.rgb = mix(u_color.rgb * 1.5, finalColor,clamp(positionMC.z / 20., 0.0, 1.0));
                            glColor1.rgb *= min(diffuseCoefficient + 0.2, 1.0);
                            glColor1.a = 1.0;
                        }
                        {
                            vec3 coord = normalize(vec3(czm_inverseViewRotation * reflect(posToCamera, normalEC)));
                            vec4 darkRefColor = texture(u_envTexture, vec2(coord.x, (coord.z - coord.y) / 2.0));
                            glColor2.rgb = mix(mix(vec3(.2), vec3(.1,.2,.6),clamp(positionMC.z / 400., 0.0, 1.0)) , darkRefColor.rgb ,0.2);
                            glColor2.rgb *= min(diffuseCoefficient + 0.1, 1.0);

                            // 基础点光源高亮指定范围
                            glColor2.rgb += addPointLight(
                                u_lightPosition ,
                                u_lightColor,
                                (czm_model * vec4(positionMC,1.0)).xyz ,
                                normalEC);
                            glColor2.rgb += addPointLight(
                                u_lightPosition2 ,
                                u_lightColor2,
                                (czm_model * vec4(positionMC,1.0)).xyz ,
                                normalEC);

                            // cesiumlab 光圈特效
                            float _baseHeight = 0.0;
                            float _heightRange = 20.0;
                            float _glowRange = 300.0;
                            float czm_height = positionMC.z - _baseHeight;
                            float czm_a11 = fract(czm_frameNumber / 120.0) * 3.14159265 * 2.0;
                            float czm_a12 = czm_height / _heightRange + sin(czm_a11) * 0.1;
                            float times = czm_frameNumber / 60.0;
                            glColor2.rgb *= vec3(czm_a12);// 渐变
                            float time = fract(czm_frameNumber / 360.0);
                            time = abs(time - 0.5) * 2.0;
                            float czm_h = clamp(czm_height / _glowRange, 0.0, 1.0);
                            float czm_diff = step(0.005, abs(czm_h - time));
                            glColor2.rgb += glColor2.rgb * (1.0 - czm_diff);
                            glColor2.a = 1.0;
                        }
        
                        float noise = noise_fun(vec2(positionMC.x, positionMC.y));
                        bool condition1 = positionMC.z > (u_lerp + noise);
                        bool condition2 = u_play && u_lerp < 0. && u_lerp2 < positionEC.x && positionEC.x < u_lerp2 + 350.;
                        bool condition3 = u_play && u_lerp > 800. && u_lerp2 < positionEC.x && positionEC.x < u_lerp2 + 350.;

                        material.diffuse = mix(glColor2.rgb, glColor1.rgb, float(condition1 || condition2 || condition3));
                        material.alpha = mix(glColor2.a, glColor1.a, float(condition1 || condition2 || condition3));
                       
                    }
                         `
                })
            });
            viewer.scene.primitives.add(building);

            // 白膜建筑线框渲染
            building2 = await Cesium.Cesium3DTileset.fromUrl(
                "./Static/Data/gz/tileset.json", {
                debugWireframe: true,
                enableDebugWireframe: true,
                customShader: new Cesium.CustomShader({
                    mode: Cesium.CustomShaderMode.REPLACE_MATERIAL,
                    lightingModel: Cesium.LightingModel.UNLIT,
                    uniforms: {
                        u_lerp: {
                            type: Cesium.UniformType.FLOAT,
                            value: 0,
                        },
                        u_color: {
                            type: Cesium.UniformType.VEC4,
                            value: Cesium.Color.fromCssColorString("#62809b"),
                        },
                        u_play: {
                            type: Cesium.UniformType.BOOL,
                            value: true
                        },
                    },
                    fragmentShaderText: `
                float noise_fun(vec2 co) {   
                    return fract(sin(dot(co.xy ,vec2(12.45678, 93.970204))) * 4321.12345) * 20.;
                }
                void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material) {
                    vec3 positionMC = fsInput.attributes.positionMC;
                    vec3 positionEC = fsInput.attributes.positionEC;
                    if(u_play && u_lerp <positionEC.x && positionEC.x < u_lerp + 350.) {
                        material.diffuse = u_color.rgb;
                        material.alpha = 1.;
                    }else {
                        discard;
                    }
                }
                `
                })
            })
            viewer.scene.primitives.add(building2);

            // 广州塔模型
            model0 = await Cesium.Cesium3DTileset.fromUrl(
                "./Static/Data/gzt/tileset.json", {
                customShader: new Cesium.CustomShader({
                    uniforms: {
                        u_build0: {
                            type: Cesium.UniformType.SAMPLER_2D,
                            value: new Cesium.TextureUniform({
                                url: "./Static/images/color.png",
                            }),
                        },
                        u_build1: {
                            type: Cesium.UniformType.SAMPLER_2D,
                            value: new Cesium.TextureUniform({
                                url: "./Static/images/color2.png",
                            }),
                        }
                    },
                    lightingModel: Cesium.LightingModel.UNLIT,
                    fragmentShaderText: `
                        void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material) {
                            vec3 positionEC = fsInput.attributes.positionEC;
                            vec3 normalEC = fsInput.attributes.normalEC;
                            vec2 uv = fsInput.attributes.texCoord_0;
                            vec3 positionMC = fsInput.attributes.positionMC;
                            float times = czm_frameNumber / 60.0;
                            vec4 textureColor = texture(u_build0,vec2(fract(float(uv.s) - times), uv.t));
                            vec4 textureColor2 = texture(u_build0,vec2(fract(uv.s),float(uv.t) - times));
                            vec4 textureColor3 = texture(u_build1,vec2(fract(uv.s),float(uv.t * 5.0) - times));
                            // material
                            material.diffuse *= textureColor.rgb + textureColor2.rgb + textureColor3.rgb;
                            material.alpha += textureColor.a + textureColor3.a;
                        }
                         `
                }),
                maximumScreenSpaceError: 2,
            })
            viewer.scene.primitives.add(model0);
            model0.root.transform = generateModelMatrix([113.31914084147262, 23.10896926740387, 0], [0, 0, 0], [2, 2, 2])
        }

        const initWater = async () => {
            const waterPlane = [];
            const waterData = await Cesium.Resource.fetchJson({ url: "./Static/data/water.json" });
            waterData.features.map(feature => {
                feature.geometry.coordinates[0].map(coordinate => {
                    waterPlane.push(Cesium.Cartesian3.fromDegrees(...coordinate));
                })
            })
            const polygon = new Cesium.PolygonGeometry({
                polygonHierarchy: new Cesium.PolygonHierarchy(waterPlane),
            });
            const instance = new Cesium.GeometryInstance({
                geometry: polygon
            });
            waterPrimitive = new Cesium.GroundPrimitive({
                geometryInstances: instance,
                appearance: new Cesium.MaterialAppearance({
                    material: new Cesium.Material({
                        fabric: {
                            uniforms: {
                                baseWaterColor: Cesium.Color.fromCssColorString("#62809b"),
                                blendColor: new Cesium.Color(0, 1, 0.699, 1),
                                refMap: "./Static/images/color.png",
                                normalMap: "./Static/images/waterNormals.jpg",
                                frequency: 800,
                                animationSpeed: 0.01,
                                amplitude: 5,
                                specularIntensity: 1,
                                fadeFactor: 3
                            },
                            source: `
                        // Thanks for the contribution Jonas
                        // http://29a.ch/2012/7/19/webgl-terrain-rendering-water-fog
                        
                        uniform sampler2D refMap;
                        uniform sampler2D normalMap;
                        uniform vec4 baseWaterColor;
                        uniform vec4 blendColor;
                        uniform float frequency;
                        uniform float animationSpeed;
                        uniform float amplitude;
                        uniform float specularIntensity;
                        uniform float fadeFactor;
                        
                        czm_material czm_getMaterial(czm_materialInput materialInput)
                        {
                            czm_material material = czm_getDefaultMaterial(materialInput);
                        
                            float time = czm_frameNumber * animationSpeed;
                        
                            // fade is a function of the distance from the fragment and the frequency of the waves
                            float fade = max(1.0, (length(materialInput.positionToEyeEC) / 10000000000.0) * frequency * fadeFactor);
                        
                            float specularMapValue = 1.0;
                        
                            // note: not using directional motion at this time, just set the angle to 0.0;
                            vec4 noise = czm_getWaterNoise(normalMap, materialInput.st * frequency, time, 0.0);
                            vec3 normalTangentSpace = noise.xyz * vec3(1.0, 1.0, (1.0 / amplitude));
                        
                            // fade out the normal perturbation as we move further from the water surface
                            normalTangentSpace.xy /= fade;
                        
                            // attempt to fade out the normal perturbation as we approach non water areas (low specular map value)
                            normalTangentSpace = mix(vec3(0.0, 0.0, 50.0), normalTangentSpace, specularMapValue);
                        
                            normalTangentSpace = normalize(normalTangentSpace);
                        
                            // get ratios for alignment of the new normal vector with a vector perpendicular to the tangent plane
                            float tsPerturbationRatio = clamp(dot(normalTangentSpace, vec3(0.0, 0.0, 1.0)), 0.0, 1.0);
                        
                            // fade out water effect as specular map value decreases
                            material.alpha = mix(blendColor.a, baseWaterColor.a, specularMapValue) * specularMapValue;
                        
                            // base color is a blend of the water and non-water color based on the value from the specular map
                            // may need a uniform blend factor to better control this
                            material.diffuse = mix(blendColor.rgb, baseWaterColor.rgb, specularMapValue);
                        
                            // diffuse highlights are based on how perturbed the normal is
                            material.diffuse += (0.1 * tsPerturbationRatio);
                        
                            material.diffuse = material.diffuse;

                            vec2 reflectCoord = gl_FragCoord.xy / czm_viewport.zw; 
                            vec2 reflectionTexcoord = vec2(1.0 - reflectCoord.x, reflectCoord.y);
                            material.diffuse += blendColor.rgb * 0.4;
                            material.diffuse *= 0.5;
                            material.diffuse *= texture(refMap, reflectionTexcoord + normalTangentSpace.xz * 5.0).rgb;

                            material.normal = normalize(materialInput.tangentToEyeMatrix * normalTangentSpace);
                        
                            material.specular = specularIntensity;
                            material.shininess = 10.0;
                        
                            return material;
                        }
                        `
                        }
                    }),
                    translucent: false,
                }),
                asynchronous: false
            })
            viewer.scene.primitives.add(waterPrimitive);
        }

        const initRoad = async () => {

            const appearance = new Cesium.PolylineMaterialAppearance({
                material: new Cesium.Material({
                    fabric: {
                        uniforms: {
                            u_color: Cesium.Color.fromCssColorString("#62809b"),
                            u_speed: 200,
                        },
                        source: `
                        uniform vec4 u_color;
                        uniform float u_speed;
                        uniform float u_glow;
                        czm_material czm_getMaterial(czm_materialInput materialInput){
                            czm_material material = czm_getDefaultMaterial(materialInput);
                            vec2 st = materialInput.st;
                            float t =fract(czm_frameNumber / u_speed);
                            t *= 1.03;
                            float alpha = smoothstep(t- 0.03, t, st.s) * step(-t, -st.s);
                            alpha += 0.1;
                            vec4 fragColor;
                            fragColor.rgb = (u_color.rgb) / 0.5;
                            fragColor = czm_gammaCorrect(fragColor);
                            material.diffuse = fragColor.rgb;
                            material.alpha = alpha;
                            material.emission = fragColor.rgb * 1.5;
                            return material;
                        }
                    `
                    }
                })
            })
            const instances = [];
            const promise = Cesium.GeoJsonDataSource.load('./Static/Data/guangzhou.geojson');
            promise.then((dataSource) => {
                const entities = dataSource.entities.values;
                for (let i = 0; i < entities.length; i++) {
                    const entity = entities[i];
                    const instance = new Cesium.GeometryInstance({
                        geometry: new Cesium.PolylineGeometry({
                            positions: entity.polyline.positions.getValue(),
                            width: 3
                        })
                    })
                    instances.push(instance);
                }
                road = new Cesium.Primitive({
                    geometryInstances: instances,
                    appearance: appearance,
                    asynchronous: false
                })
                viewer.scene.primitives.add(road)
            })
        }

        const initFireWorks = async () => {

            Cesium.Math.setRandomNumberSeed(315);
            const modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(
                Cesium.Cartesian3.fromDegrees(113.31889874065983, 23.107780636178287, 400)
            );
            const emitterInitialLocation = new Cesium.Cartesian3(0.0, 100.0, 200.0);

            let particleCanvas;

            function getImage() {
                if (!Cesium.defined(particleCanvas)) {
                    particleCanvas = document.createElement("canvas");
                    particleCanvas.width = 20;
                    particleCanvas.height = 20;
                    const context2D = particleCanvas.getContext("2d");
                    context2D.beginPath();
                    context2D.arc(8, 8, 8, 0, Cesium.Math.TWO_PI, true);
                    context2D.closePath();
                    context2D.fillStyle = "rgb(255, 255, 255)";
                    context2D.fill();
                }
                return particleCanvas;
            }

            const minimumExplosionSize = 30.0;
            const maximumExplosionSize = 1000.0;
            const particlePixelSize = new Cesium.Cartesian2(7.0, 7.0);
            const burstSize = 400.0;
            const lifetime = 15.0;
            const numberOfFireworks = 20.0;

            const emitterModelMatrixScratch = new Cesium.Matrix4();

            function createFirework(offset, color, bursts) {
                const position = Cesium.Cartesian3.add(
                    emitterInitialLocation,
                    offset,
                    new Cesium.Cartesian3()
                );
                const emitterModelMatrix = Cesium.Matrix4.fromTranslation(
                    position,
                    emitterModelMatrixScratch
                );
                const particleToWorld = Cesium.Matrix4.multiply(
                    modelMatrix,
                    emitterModelMatrix,
                    new Cesium.Matrix4()
                );
                const worldToParticle = Cesium.Matrix4.inverseTransformation(
                    particleToWorld,
                    particleToWorld
                );

                const size = Cesium.Math.randomBetween(
                    minimumExplosionSize,
                    maximumExplosionSize
                );
                const particlePositionScratch = new Cesium.Cartesian3();
                const force = function (particle) {
                    const position = Cesium.Matrix4.multiplyByPoint(
                        worldToParticle,
                        particle.position,
                        particlePositionScratch
                    );
                    if (Cesium.Cartesian3.magnitudeSquared(position) >= size * size) {
                        Cesium.Cartesian3.clone(
                            Cesium.Cartesian3.ZERO,
                            particle.velocity
                        );
                    }
                };

                const normalSize =
                    (size - minimumExplosionSize) /
                    (maximumExplosionSize - minimumExplosionSize);
                const minLife = 0.3;
                const maxLife = 1.0;
                const life = normalSize * (maxLife - minLife) + minLife;

                viewer.scene.primitives.add(
                    new Cesium.ParticleSystem({
                        image: getImage(),
                        startColor: color,
                        endColor: color.withAlpha(0.0),
                        particleLife: life,
                        speed: 100.0,
                        imageSize: particlePixelSize,
                        emissionRate: 0,
                        emitter: new Cesium.SphereEmitter(0.5),
                        bursts: bursts,
                        lifetime: lifetime,
                        updateCallback: force,
                        modelMatrix: modelMatrix,
                        emitterModelMatrix: emitterModelMatrix,
                    })
                );
            }

            const xMin = -100.0;
            const xMax = 100.0;
            const yMin = -80.0;
            const yMax = 100.0;
            const zMin = -50.0;
            const zMax = 50.0;

            const colorOptions = [
                {
                    minimumRed: 0.75,
                    green: 0.0,
                    minimumBlue: 0.8,
                    alpha: 1.0,
                },
                {
                    red: 0.0,
                    minimumGreen: 0.75,
                    minimumBlue: 0.8,
                    alpha: 1.0,
                },
                {
                    red: 0.0,
                    green: 0.0,
                    minimumBlue: 0.8,
                    alpha: 1.0,
                },
                {
                    minimumRed: 0.75,
                    minimumGreen: 0.75,
                    blue: 0.0,
                    alpha: 1.0,
                },
            ];

            for (let i = 0; i < numberOfFireworks; ++i) {
                const x = Cesium.Math.randomBetween(xMin, xMax);
                const y = Cesium.Math.randomBetween(yMin, yMax);
                const z = Cesium.Math.randomBetween(zMin, zMax);
                const offset = new Cesium.Cartesian3(x, y, z);
                const color = Cesium.Color.fromRandom(
                    colorOptions[i % colorOptions.length]
                );

                const bursts = [];
                for (let j = 0; j < 3; ++j) {
                    bursts.push(
                        new Cesium.ParticleBurst({
                            time: Cesium.Math.nextRandomNumber() * lifetime,
                            minimum: burstSize,
                            maximum: burstSize,
                        })
                    );
                }

                createFirework(offset, color, bursts);
            }

        }

        await initTiles();

        await initWater();

        await initRoad();

        await initFireWorks();

    }

    /**
     * 初始化场景事件
     */
    const initEvent = async () => {

        let step = 20;
        let step2 = 1;
        let _date = viewer.clock.currentTime,
            _startTime = Cesium.JulianDate.addSeconds(_date, 10, new Cesium.JulianDate()),
            _stopTime = Cesium.JulianDate.addSeconds(_date, 60, new Cesium.JulianDate()),
            _time1 = Cesium.JulianDate.addSeconds(_date, 1 * 10, new Cesium.JulianDate()),
            _time2 = Cesium.JulianDate.addSeconds(_date, (2 * 10), new Cesium.JulianDate()),
            _time3 = Cesium.JulianDate.addSeconds(_date, (3 * 10), new Cesium.JulianDate()),
            _time4 = Cesium.JulianDate.addSeconds(_date, (4 * 10), new Cesium.JulianDate()),
            _time5 = Cesium.JulianDate.addSeconds(_date, (5 * 10), new Cesium.JulianDate()),
            _time6 = Cesium.JulianDate.addSeconds(_date, (6 * 10), new Cesium.JulianDate());
        let _property = new Cesium.SampledProperty(Cesium.Color)
        _property.addSample(_time1, Cesium.Color.fromCssColorString('#62809b'))
        _property.addSample(_time2, Cesium.Color.fromCssColorString('#87CEFA'))
        _property.addSample(_time3, Cesium.Color.fromCssColorString('#003cff'))
        _property.addSample(_time4, Cesium.Color.fromCssColorString('#F08080'))
        _property.addSample(_time5, Cesium.Color.fromCssColorString('#FFA500'))
        _property.addSample(_time6, Cesium.Color.fromCssColorString('#FF4500'))
        viewer.clock.startTime = _startTime;
        viewer.clock.stopTime = _stopTime;
        viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP
        viewer.scene.postUpdate.addEventListener((scene, time) => {
            // 动态线框扫描
            if (building2.customShader.uniforms.u_lerp.value < -5000) {
                step = 20;
            } else if (building2.customShader.uniforms.u_lerp.value > 5000) {
                step = -20;
            }
            building.customShader.uniforms.u_lerp2.value += step;
            building2.customShader.uniforms.u_lerp.value += step;
            // 切换外观
            if (isPlay) {
                if (building.customShader.uniforms.u_lerp.value < -300) {
                    step2 = 1;
                } else if (building.customShader.uniforms.u_lerp.value > 1000) {
                    step2 = -1;
                }
            }
            building.customShader.uniforms.u_lerp.value += step2;
            // 颜色主题
            _property.getValue(time) && (
                road && (road.appearance.material.uniforms.u_color = _property.getValue(time)),
                (building.customShader.uniforms.u_color.value = _property.getValue(time)),
                (building2.customShader.uniforms.u_color.value = _property.getValue(time)),
                waterPrimitive && (waterPrimitive.appearance.material.uniforms.baseWaterColor = _property.getValue(time))

            )
        })

        let gui = new dat.GUI();
        gui.add({ play: true }, "play").name("自动切换").onChange(function (value) {
            isPlay = value;
        })
        gui.add({ lerp: -100 }, "lerp", -100, 800, 1).name("外观过渡").onChange(function (value) {
            building.customShader.uniforms.u_lerp.value = value;
        })
        gui.add({ play: true }, "play").name("线框扫描").onChange(function (value) {
            building.customShader.uniforms.u_play.value = value;
            building2.customShader.uniforms.u_play.value = value;
        })
        // let bloomOptions = {
        //     bloomEnabled: true,
        //     glowOnly: false,
        //     contrast: 119,
        //     brightness: 0.05,
        //     delta: 0.9,
        //     sigma: 3.78,
        //     stepSize: 5,
        //     isSelected: false,
        //     smoothWidth: 0.01,
        //     luminosityThreshold: 0.0,
        //     color: "#ffffff",
        //     selectedBloom: 1.0
        // }
        // let sceneBloom = gui.addFolder('辉光控制');
        // sceneBloom.add(bloomOptions, 'bloomEnabled').name("开关").onChange(function (value) {
        //     viewer.scene.postProcessStages.bloom.enabled = value;
        // })
        // sceneBloom.add(bloomOptions, 'glowOnly').name("glowOnly").onChange(function (value) {
        //     viewer.scene.postProcessStages.bloom.uniforms.glowOnly = value;
        // })
        // sceneBloom.add(bloomOptions, 'contrast', -255.0, 255.0, 0.01).name("contrast").onChange(function (value) {
        //     viewer.scene.postProcessStages.bloom.uniforms.contrast = value;
        // })
        // sceneBloom.add(bloomOptions, 'brightness', -1.0, 1.0, 0.01).name("brightness").onChange(function (value) {
        //     viewer.scene.postProcessStages.bloom.uniforms.brightness = value;
        // })
        // sceneBloom.add(bloomOptions, 'delta', 0.1, 5, 0.01).name("delta").onChange(function (value) {
        //     viewer.scene.postProcessStages.bloom.uniforms.delta = value;
        // })
        // sceneBloom.add(bloomOptions, 'sigma', 0.1, 10, 0.01).name("sigma").onChange(function (value) {
        //     viewer.scene.postProcessStages.bloom.uniforms.sigma = value;
        // })
        // sceneBloom.add(bloomOptions, 'selectedBloom', 0.1, 10, 0.01).name("selectedBloom").onChange(function (value) {
        //     viewer.scene.postProcessStages.bloom.uniforms.selectedBloom = value;
        // })
        // sceneBloom.add(bloomOptions, 'stepSize', 0.1, 10).name("stepSize").onChange(function (value) {
        //     viewer.scene.postProcessStages.bloom.uniforms.stepSize = value;
        // })
        // sceneBloom.add(bloomOptions, "smoothWidth", 0, 1, 0.01).name("smoothWidth").onChange(function (value) {
        //     viewer.scene.postProcessStages.bloom.uniforms.smoothWidth = parseFloat(value)
        // })
        // sceneBloom.addColor(bloomOptions, "color", 0, 1, 0.01).name("color").onChange(function (value) {
        //     viewer.scene.postProcessStages.bloom.uniforms.bloomColor = Cesium.Color.fromCssColorString(value);
        // })

        // 延迟2s加载数据 gitee网速较慢
        setTimeout(() => closeLoading(), 2000);
    }


    /**
     * 生成矩阵
     * @param {*} position 
     * @param {*} rotation 
     * @param {*} scale 
     * @returns 
     */
    const generateModelMatrix = (position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1]) => {
        const rotationX = Cesium.Matrix4.fromRotationTranslation(
            Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(rotation[0])));

        const rotationY = Cesium.Matrix4.fromRotationTranslation(
            Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(rotation[1])));

        const rotationZ = Cesium.Matrix4.fromRotationTranslation(
            Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(rotation[2])));
        if (!(position instanceof Cesium.Cartesian3)) {
            position = Cesium.Cartesian3.fromDegrees(...position)
        }
        const enuMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(position);
        Cesium.Matrix4.multiply(enuMatrix, rotationX, enuMatrix);
        Cesium.Matrix4.multiply(enuMatrix, rotationY, enuMatrix);
        Cesium.Matrix4.multiply(enuMatrix, rotationZ, enuMatrix);
        const scaleMatrix = Cesium.Matrix4.fromScale(new Cesium.Cartesian3(...scale));
        const modelMatrix = Cesium.Matrix4.multiply(enuMatrix, scaleMatrix, new Cesium.Matrix4());

        return modelMatrix;
    }

    const main = async () => {
        await initViewer();
        await initScene();
        await initEvent();
    };


    /**
     * ------------
     * 功能插件相关
     * ------------
     */

    /**
     * 动态局部天空盒
     */
    const BoxGeometry = Cesium.BoxGeometry,
        Cartesian3 = Cesium.Cartesian3,
        defaultValue = Cesium.defaultValue,
        defined = Cesium.defined,
        destroyObject = Cesium.destroyObject,
        DeveloperError = Cesium.DeveloperError,
        GeometryPipeline = Cesium.GeometryPipeline,
        Matrix3 = Cesium.Matrix3,
        Matrix4 = Cesium.Matrix4,
        Transforms = Cesium.Transforms,
        VertexFormat = Cesium.VertexFormat,
        BufferUsage = Cesium.BufferUsage,
        CubeMap = Cesium.CubeMap,
        DrawCommand = Cesium.DrawCommand,
        loadCubeMap = Cesium.loadCubeMap,
        RenderState = Cesium.RenderState,
        VertexArray = Cesium.VertexArray,
        BlendingState = Cesium.BlendingState,
        SceneMode = Cesium.SceneMode,
        ShaderProgram = Cesium.ShaderProgram,
        ShaderSource = Cesium.ShaderSource;
    const SkyBoxFS = "uniform samplerCube u_cubeMap;\n\
            in vec3 v_texCoord;\n\
            void main()\n\
            {\n\
            vec4 color = texture(u_cubeMap, normalize(v_texCoord));\n\
            out_FragColor = vec4(czm_gammaCorrect(color).rgb, czm_morphTime);\n\
            }\n\
            ";
    const SkyBoxVS = "in vec3 position;\n\
            out vec3 v_texCoord;\n\
            uniform mat3 u_rotateMatrix;\n\
            void main()\n\
            {\n\
            vec3 p = czm_viewRotation * u_rotateMatrix * (czm_temeToPseudoFixed * (czm_entireFrustum.y * position));\n\
            gl_Position = czm_projection * vec4(p, 1.0);\n\
            v_texCoord = position.xyz;\n\
            }\n\
            ";
    function SkyBox(options) {

        this.sources = options.sources;
        this._sources = undefined;
        /**
         * Determines if the sky box will be shown.
         *
         * @type {Boolean}
         * @default true
         */
        this.show = defaultValue(options.show, true);
        this.speed = defaultValue(options.speed, 0);

        this._command = new DrawCommand({
            modelMatrix: Matrix4.clone(Matrix4.IDENTITY),
            owner: this
        });
        this._cubeMap = undefined;

        this._attributeLocations = undefined;
        this._useHdr = undefined;


    }
    const skyboxMatrix3 = new Matrix3();
    SkyBox.prototype.update = function (frameState, useHdr) {
        const that = this;

        if (!this.show) {
            return undefined;
        }

        if ((frameState.mode !== SceneMode.SCENE3D) &&
            (frameState.mode !== SceneMode.MORPHING)) {
            return undefined;
        }

        if (!frameState.passes.render) {
            return undefined;
        }

        const context = frameState.context;

        if (this._sources !== this.sources) {
            this._sources = this.sources;
            const sources = this.sources;

            if ((!defined(sources.positiveX)) ||
                (!defined(sources.negativeX)) ||
                (!defined(sources.positiveY)) ||
                (!defined(sources.negativeY)) ||
                (!defined(sources.positiveZ)) ||
                (!defined(sources.negativeZ))) {
                throw new DeveloperError('this.sources is required and must have positiveX, negativeX, positiveY, negativeY, positiveZ, and negativeZ properties.');
            }

            if ((typeof sources.positiveX !== typeof sources.negativeX) ||
                (typeof sources.positiveX !== typeof sources.positiveY) ||
                (typeof sources.positiveX !== typeof sources.negativeY) ||
                (typeof sources.positiveX !== typeof sources.positiveZ) ||
                (typeof sources.positiveX !== typeof sources.negativeZ)) {
                throw new DeveloperError('this.sources properties must all be the same type.');
            }

            if (typeof sources.positiveX === 'string') {
                // Given urls for cube-map images.  Load them.
                loadCubeMap(context, this._sources).then(function (cubeMap) {
                    that._cubeMap = that._cubeMap && that._cubeMap.destroy();
                    that._cubeMap = cubeMap;
                });
            } else {
                this._cubeMap = this._cubeMap && this._cubeMap.destroy();
                this._cubeMap = new CubeMap({
                    context: context,
                    source: sources
                });
            }
        }

        const command = this._command;
        command.modelMatrix = Transforms.eastNorthUpToFixedFrame(frameState.camera._positionWC);
        if (!defined(command.vertexArray)) {
            let rotate = 0;
            command.uniformMap = {
                u_cubeMap: function () {
                    return that._cubeMap;
                },
                u_rotateMatrix: function () {
                    rotate += that.speed;
                    const rotationZMatrix = Matrix3.fromRotationZ(Cesium.Math.toRadians(rotate));
                    const rotMatrix = Matrix4.fromRotationTranslation(rotationZMatrix);
                    Matrix4.multiply(command.modelMatrix, rotMatrix, command.modelMatrix);
                    return Matrix4.getMatrix3(command.modelMatrix, skyboxMatrix3);
                },
            };

            const geometry = BoxGeometry.createGeometry(BoxGeometry.fromDimensions({
                dimensions: new Cartesian3(2.0, 2.0, 2.0),
                vertexFormat: VertexFormat.POSITION_ONLY
            }));
            const attributeLocations = this._attributeLocations = GeometryPipeline.createAttributeLocations(geometry);

            command.vertexArray = VertexArray.fromGeometry({
                context: context,
                geometry: geometry,
                attributeLocations: attributeLocations,
                bufferUsage: BufferUsage._DRAW
            });

            command.renderState = RenderState.fromCache({
                blending: BlendingState.ALPHA_BLEND
            });
        }

        if (!defined(command.shaderProgram) || this._useHdr !== useHdr) {
            const fs = new ShaderSource({
                defines: [useHdr ? 'HDR' : ''],
                sources: [SkyBoxFS]
            });
            command.shaderProgram = ShaderProgram.fromCache({
                context: context,
                vertexShaderSource: SkyBoxVS,
                fragmentShaderSource: fs,
                attributeLocations: this._attributeLocations
            });
            this._useHdr = useHdr;
        }

        if (!defined(this._cubeMap)) {
            return undefined;
        }

        return command;
    };
    SkyBox.prototype.isDestroyed = function () {
        return false
    };
    SkyBox.prototype.destroy = function () {
        const command = this._command;
        command.vertexArray = command.vertexArray && command.vertexArray.destroy();
        command.shaderProgram = command.shaderProgram && command.shaderProgram.destroy();
        this._cubeMap = this._cubeMap && this._cubeMap.destroy();
        return destroyObject(this);
    }

    /**
     * 底图拓展来源 github:cesium-map
     */
    const BD_FACTOR = (3.14159265358979324 * 3000.0) / 180.0
    const PI = 3.1415926535897932384626
    const RADIUS = 6378245.0
    const EE = 0.00669342162296594323
    /**
     * 定义坐标转换工具
     */
    class CoordTransform {
        /**
         * BD-09 To GCJ-02
         * @param lng
         * @param lat
         * @returns {number[]}
         */
        static BD09ToGCJ02(lng, lat) {
            let x = +lng - 0.0065
            let y = +lat - 0.006
            let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * BD_FACTOR)
            let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * BD_FACTOR)
            let gg_lng = z * Math.cos(theta)
            let gg_lat = z * Math.sin(theta)
            return [gg_lng, gg_lat]
        }

        /**
         * GCJ-02 To BD-09
         * @param lng
         * @param lat
         * @returns {number[]}
         * @constructor
         */
        static GCJ02ToBD09(lng, lat) {
            lat = +lat
            lng = +lng
            let z =
                Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * BD_FACTOR)
            let theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * BD_FACTOR)
            let bd_lng = z * Math.cos(theta) + 0.0065
            let bd_lat = z * Math.sin(theta) + 0.006
            return [bd_lng, bd_lat]
        }

        /**
         * WGS-84 To GCJ-02
         * @param lng
         * @param lat
         * @returns {number[]}
         */
        static WGS84ToGCJ02(lng, lat) {
            lat = +lat
            lng = +lng
            if (this.out_of_china(lng, lat)) {
                return [lng, lat]
            } else {
                let d = this.delta(lng, lat)
                return [lng + d[0], lat + d[1]]
            }
        }

        /**
         * GCJ-02 To WGS-84
         * @param lng
         * @param lat
         * @returns {number[]}
         * @constructor
         */
        static GCJ02ToWGS84(lng, lat) {
            lat = +lat
            lng = +lng
            if (this.out_of_china(lng, lat)) {
                return [lng, lat]
            } else {
                let d = this.delta(lng, lat)
                let mgLng = lng + d[0]
                let mgLat = lat + d[1]
                return [lng * 2 - mgLng, lat * 2 - mgLat]
            }
        }

        /**
         *
         * @param lng
         * @param lat
         * @returns {number[]}
         */
        static delta(lng, lat) {
            let dLng = this.transformLng(lng - 105, lat - 35)
            let dLat = this.transformLat(lng - 105, lat - 35)
            const radLat = (lat / 180) * PI
            let magic = Math.sin(radLat)
            magic = 1 - EE * magic * magic
            const sqrtMagic = Math.sqrt(magic)
            dLng = (dLng * 180) / ((RADIUS / sqrtMagic) * Math.cos(radLat) * PI)
            dLat = (dLat * 180) / (((RADIUS * (1 - EE)) / (magic * sqrtMagic)) * PI)
            return [dLng, dLat]
        }

        /**
         *
         * @param lng
         * @param lat
         * @returns {number}
         */
        static transformLng(lng, lat) {
            lat = +lat
            lng = +lng
            let ret =
                300.0 +
                lng +
                2.0 * lat +
                0.1 * lng * lng +
                0.1 * lng * lat +
                0.1 * Math.sqrt(Math.abs(lng))
            ret +=
                ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) *
                    2.0) /
                3.0
            ret +=
                ((20.0 * Math.sin(lng * PI) + 40.0 * Math.sin((lng / 3.0) * PI)) * 2.0) /
                3.0
            ret +=
                ((150.0 * Math.sin((lng / 12.0) * PI) +
                    300.0 * Math.sin((lng / 30.0) * PI)) *
                    2.0) /
                3.0
            return ret
        }

        /**
         *
         * @param lng
         * @param lat
         * @returns {number}
         */
        static transformLat(lng, lat) {
            lat = +lat
            lng = +lng
            let ret =
                -100.0 +
                2.0 * lng +
                3.0 * lat +
                0.2 * lat * lat +
                0.1 * lng * lat +
                0.2 * Math.sqrt(Math.abs(lng))
            ret +=
                ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) *
                    2.0) /
                3.0
            ret +=
                ((20.0 * Math.sin(lat * PI) + 40.0 * Math.sin((lat / 3.0) * PI)) * 2.0) /
                3.0
            ret +=
                ((160.0 * Math.sin((lat / 12.0) * PI) +
                    320 * Math.sin((lat * PI) / 30.0)) *
                    2.0) /
                3.0
            return ret
        }

        /**
         *
         * @param lng
         * @param lat
         * @returns {boolean}
         */
        static out_of_china(lng, lat) {
            lat = +lat
            lng = +lng
            return !(lng > 73.66 && lng < 135.05 && lat > 3.86 && lat < 53.55)
        }
    }

    Cesium.CoordTransform = CoordTransform

    /**
     * 定义火星投影 高德和腾讯地图坐标系
     */
    class GCJMercatorTilingScheme extends Cesium.WebMercatorTilingScheme {
        constructor(options) {
            super(options)
            let projection = new Cesium.WebMercatorProjection()
            this._projection.project = function (cartographic, result) {
                result = CoordTransform.WGS84ToGCJ02(
                    Cesium.Math.toDegrees(cartographic.longitude),
                    Cesium.Math.toDegrees(cartographic.latitude)
                )
                result = projection.project(
                    new Cesium.Cartographic(
                        Cesium.Math.toRadians(result[0]),
                        Cesium.Math.toRadians(result[1])
                    )
                )
                return new Cesium.Cartesian2(result.x, result.y)
            }
            this._projection.unproject = function (cartesian, result) {
                let cartographic = projection.unproject(cartesian)
                result = CoordTransform.GCJ02ToWGS84(
                    Cesium.Math.toDegrees(cartographic.longitude),
                    Cesium.Math.toDegrees(cartographic.latitude)
                )
                return new Cesium.Cartographic(
                    Cesium.Math.toRadians(result[0]),
                    Cesium.Math.toRadians(result[1])
                )
            }
        }
    }

    const IMG_URL =
        'https://p{s}.map.gtimg.com/sateTiles/{z}/{sx}/{sy}/{x}_{reverseY}.jpg?version=400&&key=d84d6d83e0e51e481e50454ccbe8986b'

    const ELEC_URL =
        'https://rt{s}.map.gtimg.com/tile?z={z}&x={x}&y={reverseY}&styleid={style}&scene=0&version=347&&key=d84d6d83e0e51e481e50454ccbe8986b'

    class TencentImageryProvider extends Cesium.UrlTemplateImageryProvider {
        constructor(options = {}) {
            let url = options.style === 'img' ? IMG_URL : ELEC_URL
            options['url'] = url.replace('{style}', options.style || 1)
            if (!options.subdomains || !options.subdomains.length) {
                options['subdomains'] = ['0', '1', '2']
            }
            if (options.style === 'img') {
                options['customTags'] = {
                    sx: (imageryProvider, x, y, level) => {
                        return x >> 4
                    },
                    sy: (imageryProvider, x, y, level) => {
                        return ((1 << level) - y) >> 4
                    }
                }
            }
            options.crs = options.crs || 'WGS84'
            if (options.crs === 'WGS84') {
                options['tilingScheme'] = new GCJMercatorTilingScheme(options)
            }
            super(options)
        }
    }

    function closeLoading() {
        document.getElementById("loadingIndicator").style.display = "none";
        document.getElementById("loadingIndicator2").style.display = "none"
    }

    window.onload = main;
})();