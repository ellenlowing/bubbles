let Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Composites = Matter.Composites,
  Common = Matter.Common,
  MouseConstraint = Matter.MouseConstraint,
  Mouse = Matter.Mouse,
  Composite = Matter.Composite,
  Bodies = Matter.Bodies;

// create engine
let engine = Engine.create(),
  world = engine.world;

engine.gravity.y = -1;

let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight;

// create renderer
let render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    width: WIDTH,
    height: HEIGHT,
    showAngleIndicator: false,
  },
});

Render.run(render);

// create runner
let runner = Runner.create();
Runner.run(runner, engine);

blowEl.addEventListener("on-blow", () => {
  let x = WIDTH / 2;
  let y = HEIGHT;
  let r = Math.random() * 30 + 20;
  let c = Bodies.circle(x, y, r);
  Composite.add(world, c);
});

// Composite.add(world, [
// walls
// Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
// Bodies.rectangle(400, 600, WIDTH, 50, { isStatic: true }),
// Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
// Bodies.rectangle(0, 300, 50, 600, { isStatic: true }),
// ]);

// add mouse control
let mouse = Mouse.create(render.canvas),
  mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: {
        visible: false,
      },
    },
  });

Composite.add(world, mouseConstraint);

// keep the mouse in sync with rendering
render.mouse = mouse;

// fit the render viewport to the scene
Render.lookAt(render, {
  min: { x: 0, y: 0 },
  max: { x: WIDTH, y: HEIGHT },
});
