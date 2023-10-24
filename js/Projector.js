import * as THREE from './vendors/three.js-131/build/three.module.js';

const Projector = (_props) => {

	const props = {
		texture: null,
        projector: null,
        matrix: null,
	};

	Object.assign(props, _props);

	const projector = new THREE.PerspectiveCamera(45, 1.0, 1, 1000);

	projector.position.z = 200;
    projector.lookAt(new THREE.Vector3(0, 0, 0));
    projector.matrixWorldInverse.copy(projector.matrixWorld).invert();

    const matrix = new THREE.Matrix4();
	matrix.set(1.0, 0.0, 0.0, 0.5,
                0.0, 1.0, 0.0, 0.5,
                0.0, 0.0, 1.0, 0.5,
                0.0, 0.0, 0.0, 1.0);
    
    matrix.multiply(projector.projectionMatrix);
    matrix.multiply(projector.matrixWorldInverse);

    const createMaterial = () => {
        return new THREE.ShaderMaterial({
            uniforms: {
                image: {
                    type: 't',
                    value: props.texture
                },
                projectorMatrix: {
                    type: 'm4',
                    value: matrix
                },
                lightDirection: {
                    type: 'vec3',
                    value: (new THREE.Vector3(1, 0, 0.5)).normalize()
                },
                rotationAngles: {
                    type: 'vec3',
                    value: new THREE.Vector3(0.0, 0.0, 0.0)
                }
            },
			vertexShader: `
				uniform sampler2D image;
			    uniform mat4 projectorMatrix;
			    uniform vec3 rotationAngles;

			    varying vec2 projectedTextureCoords;
			    varying vec3 vNormal;

			    mat4 rotationMatrix(vec3 axis, float angle) {
			        axis = normalize(axis);

			        float x = axis.x;
			        float y = axis.y;
			        float z = axis.z;
			        float s = sin(angle);
			        float c = cos(angle);
			        float oc = 1.0 - c;

			        return mat4((oc * x * x) + c,       (oc * x * y) - (z * s), (oc * z * x) + (y * s), 0.0,
			                    (oc * x * y) + (z * s), (oc * y * y) + c,       (oc * y * z) - (x * s), 0.0,
			                    (oc * z * x) - (y * s), (oc * y * z) + (x * s), (oc * z * z) + c,       0.0,
			                    0.0,                    0.0,                    0.0,                    1.0);
			    }


			    vec3 rotate(vec3 v, vec3 rotationAngles) {
			        mat4 mx = rotationMatrix(vec3(1.0, 0.0, 0.0), rotationAngles.x);
			        mat4 my = rotationMatrix(vec3(0.0, 1.0, 0.0), rotationAngles.y);
			        mat4 mz = rotationMatrix(vec3(0.0, 0.0, 1.0), rotationAngles.z);

			        v = (mx * vec4(v, 1.0)).xyz;
			        v = (my * vec4(v, 1.0)).xyz;
			        v = (mz * vec4(v, 1.0)).xyz;

			        return v;
			    }


			    void main() {
			        vNormal = normal;

			        vec3 newPosition = rotate(position, rotationAngles);

			        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);

			        vec4 coords = projectorMatrix * modelMatrix * vec4(position, 1.0);
			        projectedTextureCoords = coords.xy / coords.w;
			    }
			`,
            fragmentShader: `
		    	uniform sampler2D image;
			    uniform vec3 lightDirection;

			    varying vec2 projectedTextureCoords;
			    varying vec3 vNormal;


			    void main() {
			        vec4 lightColor = dot(lightDirection, vNormal) * vec4(0.5, 0.5, 0.5, 1.0);
			        vec4 color = texture2D(image, projectedTextureCoords);

			        color = mix(color, lightColor, 0.2);

			        gl_FragColor = color;
			    }
		    `,
        	side: THREE.DoubleSide,
        });
    };

	const base = {
		createMaterial,
	};

	return base;
};	

export default Projector;
