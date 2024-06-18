document.addEventListener('DOMContentLoaded', () => {
    const shapes = {
        CT: 'Cone',
        ST: 'Prism',
        CS: 'Cylinder',
        CC: 'Sphere',
        SS: 'Cube',
        TT: 'Pyramid'
    };

    const validShapeSets = [
        ['ST', 'CT', 'CS'],  // Prism, Cone, Cylinder
        ['CC', 'TT', 'SS']   // Sphere, Pyramid, Cube
    ];

    let statues = [];
    let swapSelections = [];
    let calledShapes = [];
    const shapeOptions = ['Circle', 'Square', 'Triangle'];

    function generateInitialStatues() {
        const selectedSet = validShapeSets[Math.floor(Math.random() * validShapeSets.length)];
        return selectedSet.sort(() => Math.random() - 0.5);
    }

    function randomizeCalledShapes() {
        const randomShapes = [];
        while (randomShapes.length < 3) {
            const shape = shapeOptions[Math.floor(Math.random() * shapeOptions.length)];
            if (!randomShapes.includes(shape)) {
                randomShapes.push(shape);
            }
        }
        return randomShapes;
    }

    function updateStatueDisplay() {
        statues.forEach((statue) => {
            const shapeKey = statue.shape;
            statue.element.querySelector('.shape').textContent = shapes[shapeKey];
        });
    }

    function updateCalledShapesDisplay(calledShapes) {
        const displayElement = document.getElementById('calledShapesDisplay');
        const shortShapes = calledShapes.map(shape => shape.charAt(0));
        displayElement.textContent = shortShapes.join('      ');
    }

    function startGame() {
        const initialStatues = generateInitialStatues();
        statues = [
            { element: document.getElementById('statue1'), shape: initialStatues[0] },
            { element: document.getElementById('statue2'), shape: initialStatues[1] },
            { element: document.getElementById('statue3'), shape: initialStatues[2] }
        ];
        updateStatueDisplay();

        calledShapes = randomizeCalledShapes();
        updateCalledShapesDisplay(calledShapes);

        document.getElementById('result').style.display = 'none';
    }

    function performSwap() {
        if (swapSelections.length < 2) return;

        const [firstSelection, secondSelection] = swapSelections;
        const firstStatue = statues[firstSelection.statueIndex - 1];
        const secondStatue = statues[secondSelection.statueIndex - 1];

        const firstShape = firstStatue.shape;
        const secondShape = secondStatue.shape;

        if (firstShape === secondShape) {
            // Do nothing if both shapes are the same (invalid swap)
            swapSelections = [];
            return;
        }

        if (firstShape[0] === firstShape[1] && secondShape[0] === secondShape[1]) {
            // Double shape swapping with double shape
            const newShape = firstShape[0] + secondShape[0];
            firstStatue.shape = newShape;
            secondStatue.shape = newShape;
        } else if (firstShape[0] === firstShape[1] || secondShape[0] === secondShape[1]) {
            // Double shape swapping with single shape
            let doubleShape, singleShape;
            if (firstShape[0] === firstShape[1]) {
                doubleShape = firstShape;
                singleShape = secondShape;
            } else {
                doubleShape = secondShape;
                singleShape = firstShape;
            }

            const [d1, d2] = doubleShape;
            const [s1, s2] = singleShape;
            const selectedShape = doubleShape === firstShape ? secondSelection.shape : firstSelection.shape;

            const newShape1 = d1 + selectedShape;
            const newShape2 = d2 + (s1 === selectedShape ? s2 : s1);

            if (doubleShape === firstShape) {
                firstStatue.shape = newShape1.split('').sort().join('');
                secondStatue.shape = newShape2.split('').sort().join('');
            } else {
                firstStatue.shape = newShape2.split('').sort().join('');
                secondStatue.shape = newShape1.split('').sort().join('');
            }
        } else {
            // Single shape swapping with single shape
            const firstShapeComponents = firstShape.split('');
            const secondShapeComponents = secondShape.split('');

            for (let i = 0; i < firstShapeComponents.length; i++) {
                if (firstShapeComponents[i] === firstSelection.shape) {
                    firstShapeComponents[i] = secondSelection.shape;
                }
            }
            for (let i = 0; i < secondShapeComponents.length; i++) {
                if (secondShapeComponents[i] === secondSelection.shape) {
                    secondShapeComponents[i] = firstSelection.shape;
                }
            }

            firstStatue.shape = firstShapeComponents.sort().join('');
            secondStatue.shape = secondShapeComponents.sort().join('');
        }

        swapSelections = [];
        updateStatueDisplay();
        checkForWin();
    }

    function checkForWin() {
        const targetShapes = calledShapes.map(calledShape => {
            return Object.keys(shapes).find(shapeKey => !shapeKey.includes(calledShape.charAt(0)));
        });

        const currentShapes = statues.map(statue => statue.shape);
        if (targetShapes.every(shape => currentShapes.includes(shape))) {
            document.getElementById('result').style.display = 'block';
        }
    }

    document.getElementById('startButton').addEventListener('click', startGame);

    document.querySelectorAll('.swap-select').forEach(select => {
        select.addEventListener('change', event => {
            const statueIndex = parseInt(event.target.dataset.statue, 10);
            const selectedShape = event.target.value.charAt(0);
            if (selectedShape) {
                swapSelections.push({ statueIndex, shape: selectedShape });
                event.target.value = "";  // Reset the dropdown after selection
                if (swapSelections.length === 2) {
                    performSwap();
                }
            }
        });
    });

    startGame();  // Initialize the game on page load
});
