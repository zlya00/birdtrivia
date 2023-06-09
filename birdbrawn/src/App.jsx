import React from 'react'
import './App.css'
import BirdList from './components/BirdList.jsx'
import bird_data from '../../bird_data.json';
import sparrow from './assets/images/sparrow_green.png'
import crow from './assets/images/crow_green.png'
import goose from './assets/images/goose_green.png'

let processedIndices = new Set();

export default function App() {
  const shuffledBirds = bird_data;
  const [singleTile, setSingleTile] = React.useState([getRandomBird()]);
  const [birds, setBirds] = React.useState([getRandomBird()]);
  const [scoreCount, setScoreCount] = React.useState(0);
  const [highScore, setHighScore] = React.useState(0);
  const [lifeCount, setLifeCount] = React.useState(3);

  const resetGame = () => {
    processedIndices = new Set();
    setSingleTile([getRandomBird()]);
    setBirds([getRandomBird()]);
    setScoreCount(0);
    setLifeCount(3);
  }

  function getRandomBird() {
    let randomIndex = Math.floor(Math.random() * shuffledBirds.length);
    while (processedIndices.has(randomIndex)) {
      randomIndex = Math.floor(Math.random() * shuffledBirds.length);
    }
    processedIndices.add(randomIndex);
    const randomBird = shuffledBirds[randomIndex];
    const newBird = {id: randomIndex, name: randomBird.name, weight: randomBird.weight, image: randomBird.image_url, rightSpot: true};
    return newBird;
  }
  
  const tilePlaced = (event, newBird) => {
    if (lifeCount > 0 && event.to.id === "birds") {
      setSingleTile([getRandomBird()]);
      setBirds((prevBirds) => {
        const sortedBirds = [...prevBirds].sort((a, b) => a.weight - b.weight);
        if (JSON.stringify(prevBirds) !== JSON.stringify(sortedBirds)) {
          newBird.rightSpot = false;
          setLifeCount(lifeCount-1);
        }
        else {
          newBird.rightSpot = true;
          setScoreCount(scoreCount+1);
          setHighScore(Math.max(scoreCount+1, highScore));
        }
        return sortedBirds;
      });
    }
  };

  return (
    <div className="App">
      <img className="sparrowImg" src={sparrow} style={{opacity: lifeCount > 2 ? 1 : 0.3}} />
      <img className="crowImg" src={crow} style={{opacity: lifeCount > 1 ? 1 : 0.3}} /> 
      <img className="gooseImg" src={goose} style={{opacity: lifeCount > 0 ? 1 : 0.3, transform: 'scaleX(-1)'}}/>
      <h1 className="score">
        score: {scoreCount}
        <span className="spacer"></span>
        lives: {lifeCount}
      </h1>
      {lifeCount < 1 && <button className="restartButton" onClick={resetGame}>restart<p className="highscore"><div style={{ height: "20px" }}></div>high score: {highScore}</p></button>}
      <div style={{ height: "200px" }}>
      <BirdList id="singleTile" list={singleTile} setList={setSingleTile} group="shared" onEnd={(event) => tilePlaced(event, singleTile[0])} />
      </div>
      <div style={{height: "110px"}}></div>
      <BirdList id="birds" list={birds} setList={setBirds} group="shared"/>
    </div>
  );
}