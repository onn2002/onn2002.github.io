let numCircles = 4;
let padding = 100;
let bigCircleDiameter = 150;
let smallCircleDiameter = bigCircleDiameter * 0.3;

let xPositions = [];
let yPosition;
let secondSetXPositions = [];
let secondSetYPositions = [];
let finalXPositions = [];
let finalYPosition;

let alphaValues = [];
let disappearingIndex = 0;
let appearingIndex = -1;
let secondSet = false;
let secondSetAlphaValues = [];
let secondSetYellowAlphaValues = [];
let moving = false;
let moveProgress = 0;

let logo; // Variable to hold the logo image
let logoDiameter = 100; // Diameter of the logo image
let logoRadius; // Radius for the logo's circular path
let logoAngle = 0; // Angle for the logo's circular path

function preload() {
  // Load the logo image
  logo = loadImage('ciclogo.png');
}

function setup() {
  createCanvas(1280, 720);

  // Initial positions and alpha values setup
  setupPositionsAndAlpha();
  
  // Set the radius for the logo's circular path
  logoRadius = height / 3; // Adjust the radius as needed
}

function draw() {
  background(255);

  if (!secondSet) {
    drawCirclesAndLines(xPositions, yPosition, alphaValues, 250, 234, 123, 232, 161, 242);
  } else {
    animateSecondSet();
  }

  manageAlphaValues();
  
  // Animate and display the logo
  animateLogo();
}

function setupPositionsAndAlpha() {
  xPositions = [];
  alphaValues = [];
  secondSetAlphaValues = [];
  secondSetYellowAlphaValues = [];
  for (let i = 0; i < numCircles; i++) {
    xPositions.push(width / 2 - (bigCircleDiameter + padding) * (numCircles - 1) / 2 + i * (bigCircleDiameter + padding));
    alphaValues.push(255);
    secondSetAlphaValues.push(0);
    secondSetYellowAlphaValues.push(0);
  }

  yPosition = height / 2;

  secondSetXPositions = [
    width / 2 - (bigCircleDiameter + padding),
    width / 2 - (bigCircleDiameter + padding) / 2,
    width / 2 + (bigCircleDiameter + padding) / 2,
    width / 2 + (bigCircleDiameter + padding)
  ];
  secondSetYPositions = [
    height / 2 + padding,
    height / 2 - padding,
    height / 2 + padding,
    height / 2 - padding
  ];

  finalXPositions = [
    width / 2 - (bigCircleDiameter + padding),
    width / 2,
    width / 2 + (bigCircleDiameter + padding),
    width / 2 + (bigCircleDiameter + padding) * 2
  ];
  finalYPosition = height / 2 + padding;
}

function drawCirclesAndLines(positionsX, positionY, alphas, yellowR, yellowG, yellowB, purpleR, purpleG, purpleB) {
  // Draw lines behind the circles
  stroke(0, 0, 139);
  for (let i = 0; i < numCircles - 1; i++) {
    let startX = positionsX[i] + bigCircleDiameter / 2;
    let endX = positionsX[i + 1] - bigCircleDiameter / 2;
    let alpha = min(alphas[i], alphas[i + 1]);
    stroke(0, 0, 139, alpha);
    strokeWeight(10);
    line(startX, positionY, endX, positionY);
  }

  // Draw circles
  for (let i = 0; i < numCircles; i++) {
    noStroke();
    fill(yellowR, yellowG, yellowB, alphas[i]);
    ellipse(positionsX[i], positionY, bigCircleDiameter);

    fill(purpleR, purpleG, purpleB, alphas[i]);
    ellipse(positionsX[i], positionY, smallCircleDiameter);
  }
}

function animateSecondSet() {
  if (!moving) {
    // Draw lines behind the circles in 'N' shape
    stroke(147, 112, 219);
    for (let i = 0; i < numCircles - 1; i++) {
      let startX = secondSetXPositions[i];
      let endX = secondSetXPositions[i + 1];
      let startY = secondSetYPositions[i];
      let endY = secondSetYPositions[i + 1];
      let alpha = min(secondSetAlphaValues[i], secondSetAlphaValues[i + 1]);
      stroke(147, 112, 219, alpha);
      strokeWeight(10);
      line(startX, startY, endX, endY);
    }

    // Render circles in 'N' shape
    for (let i = 0; i < numCircles; i++) {
      noStroke();
      fill(250, 234, 123, secondSetYellowAlphaValues[i]);
      ellipse(secondSetXPositions[i], secondSetYPositions[i], bigCircleDiameter);

      fill(232, 161, 242, secondSetAlphaValues[i]);
      ellipse(secondSetXPositions[i], secondSetYPositions[i], smallCircleDiameter);
    }

    // Delay for 1-2 seconds before dropping circles
    setTimeout(startDroppingCircles, 1000); // Adjust delay time as needed
  } else {
    // Animation for dropping circles to form a straight line
    moveProgress += 0.01;
    for (let i = 0; i < numCircles; i++) {
      secondSetXPositions[i] = lerp(secondSetXPositions[i], finalXPositions[i], moveProgress);
      secondSetYPositions[i] = lerp(secondSetYPositions[i], finalYPosition, moveProgress);
    }

    // Draw lines behind the circles in straight line
    stroke(147, 112, 219);
    for (let i = 0; i < numCircles - 1; i++) {
      let startX = secondSetXPositions[i];
      let endX = secondSetXPositions[i + 1];
      let startY = secondSetYPositions[i];
      let endY = secondSetYPositions[i + 1];
      let alpha = min(secondSetAlphaValues[i], secondSetAlphaValues[i + 1]);
      stroke(147, 112, 219, alpha);
      strokeWeight(10);
      line(startX, startY, endX, endY);
    }

    // Render circles forming a line
    for (let i = 0; i < numCircles; i++) {
      noStroke();
      fill(250, 234, 123, secondSetYellowAlphaValues[i]);
      ellipse(secondSetXPositions[i], secondSetYPositions[i], bigCircleDiameter);

      fill(232, 161, 242, secondSetAlphaValues[i]);
      ellipse(secondSetXPositions[i], secondSetYPositions[i], smallCircleDiameter);
    }

    // Check if the animation is complete
    if (moveProgress >= 1) {
      setTimeout(() => {
        resetSecondSetAlphaValues();
        resetFirstSetAlphaValues();
        secondSet = false; // Toggle back to first set
        moving = false; // Reset moving flag
        moveProgress = 0; // Reset move progress
      }, 1000); // Adjust delay time as needed
    }
  }
}

function manageAlphaValues() {
  if (!secondSet && disappearingIndex < numCircles) {
    alphaValues[disappearingIndex] -= 11.5;
    if (alphaValues[disappearingIndex] <= 0) {
      disappearingIndex++;
      if (disappearingIndex === numCircles) {
        resetAlphaValues();
        appearingIndex = 0;
        secondSet = true; // Toggle to second set
        setTimeout(startDroppingCircles, 1000); // Start second set animation after delay
      }
    }
  }

  if (secondSet && appearingIndex >= 0 && appearingIndex < numCircles) {
    secondSetAlphaValues[appearingIndex] += 15;
    if (secondSetAlphaValues[appearingIndex] >= 255) {
      secondSetAlphaValues[appearingIndex] = 255; // Cap the value at 255

      // Start the yellow circle appearance after purple circle is fully visible
      if (secondSetAlphaValues[appearingIndex] === 255) {
        secondSetYellowAlphaValues[appearingIndex] += 15;
        if (secondSetYellowAlphaValues[appearingIndex] >= 255) {
          secondSetYellowAlphaValues[appearingIndex] = 255;
          appearingIndex++;
        }
      }
    }
  }

  // Check if we need to start disappearing the second set after moving into a straight line
  if (secondSet && !moving && moveProgress >= 1 && disappearingIndex >= 0 && disappearingIndex < numCircles) {
    secondSetAlphaValues[disappearingIndex] -= 11.5;
    if (secondSetAlphaValues[disappearingIndex] <= 0) {
      disappearingIndex++;
      if (disappearingIndex === numCircles) {
        resetSecondSetAlphaValues();
        resetFirstSetAlphaValues();
        secondSet = false; // Toggle back to first set
        disappearingIndex = 0;
        appearingIndex = -1; // Reset appearing index for the next cycle
      }
    }
  }
}

function resetAlphaValues() {
  alphaValues = Array(numCircles).fill(0);
}

function resetSecondSetAlphaValues() {
  secondSetAlphaValues = Array(numCircles).fill(0);
  secondSetYellowAlphaValues = Array(numCircles).fill(0);
}

function resetFirstSetAlphaValues() {
  alphaValues = Array(numCircles).fill(255);
  disappearingIndex = 0;
  appearingIndex = -1; // Ensure that it is ready for the next cycle
  setupPositionsAndAlpha();
}

function startDroppingCircles() {
  moving = true;
  moveProgress = 0;
}

function startDisappearingCircles() {
  disappearingIndex = 0; // Start disappearing from the first circle
}

function animateLogo() {
  // Update the logo's angle for circular motion
  logoAngle += 0.01; // Adjust the speed as needed

  // Calculate the logo's position based on the angle
  let logoX = width / 2 + logoRadius * cos(logoAngle);
  let logoY = height / 2 + logoRadius * sin(logoAngle);

  // Display the logo
  imageMode(CENTER);
  image(logo, logoX, logoY, logoDiameter, logoDiameter);
}
