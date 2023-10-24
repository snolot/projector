import * as THREE from './vendors/three.js-131/build/three.module.js';

const TextureCreator = () => {

    const WIDTH = 2048;
    const HEIGHT = 2048;

    const createTexture = async(message = 'Hello') => {
        return new Promise(resolve => {
            const canvas = document.createElement('canvas');

            canvas.height = HEIGHT;
            canvas.width = WIDTH;

            drawRandomShapes(canvas, message);
        
            const texture = new THREE.CanvasTexture(canvas);

            resolve(texture);
        });
    };

    const generateRandomColor = () => {
        // It'll be totally random. Trust me.
        const colors = [
            '#FA7921',
            '#1C1C1C',
            '#4C4C4C'
        ];

        return colors[Math.floor(Math.random() * colors.length)];
    };

    const drawRandomShapes = (canvas, message) => {
        const context = canvas.getContext('2d');

        context.beginPath();
        context.rect(0, 0, WIDTH, HEIGHT);
        context.fillStyle = generateRandomColor();
        context.fill();

        for (let i = WIDTH; i > 0; i -= 300) {
            context.strokeStyle = generateRandomColor();
            context.lineWidth = Math.random() * 150 + 50;
            context.beginPath();
            context.arc(WIDTH / 2, HEIGHT / 2, i, 0, 2 * Math.PI);
            context.stroke();
        }

        context.font = `${WIDTH / 6}px Neuland Grotesk Condensed`;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillStyle = '#000000';
        context.fillText(message, WIDTH / 2, HEIGHT / 2);

        context.font = `${WIDTH / 6}px Neuland Grotesk Condensed`;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillStyle = '#FFFFFF';
        context.fillText(message, WIDTH / 2 + 12, HEIGHT / 2 + 12);
    };

    const base = {
        createTexture,
    };

    return base;
};

export default TextureCreator;
