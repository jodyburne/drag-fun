import React, {useEffect, useState} from 'react'
import axios from 'axios'
import Score from './Score.jsx'

let randos = []
for (let i = 1; i < 133; i++){
    randos.push(i)
}
let num = 131

function Game() {
  function randomLipsync(){  
let i = Math.floor(Math.random() * num)
console.log(randos)
console.log(i)
console.log(num)
num-=1
return randos.splice(i, 1)[0]

  }  
  let index1 = Math.floor(Math.random() * 2)
  let index2 = 1
  if (index1 === 1)
    index2 = 0
  const [questions, setQuestions] = useState(0)
  const [score, setScore] = useState(0)
  const [lipsyncs, setLipsyncs] = useState({
    song: '',
    artist: '',
    q1: '',
    q2: '',
    q1won: true,
    q2won: true,
    winner: ''
  })
    let img1 = lipsyncs.q1.id === 90 ? 'https://i.ytimg.com/vi/YlnNt7D2OdA/hqdefault.jpg' : lipsyncs.q1.image_url
    let img2 = lipsyncs.q2.id === 90 ? 'https://i.ytimg.com/vi/YlnNt7D2OdA/hqdefault.jpg' : lipsyncs.q2.image_url
   useEffect(()=> {

     axios.get(`http://www.nokeynoshade.party/api/lipsyncs/${randomLipsync()}`) 
     .then(response => {

       let q1Id = response.data.queens[index1].id
       let q2Id = response.data.queens[index2].id
       let song = response.data.name
       let artist = response.data.artist 
      let won1 =  response.data.queens[index1].won ? true : false
      let won2 =  response.data.queens[index2].won ? true : false
      let winner
      if (won1 && won2){
          winner = 'both'
      } else if (!won1 && !won2) {
          winner = 'neither'
      } else if (won1) {
          winner = 'one'
      } else {
          winner = 'two'
      }

      
       Promise.all([
          axios.get(`http://www.nokeynoshade.party/api/queens/${q1Id}`),
          axios.get(`http://www.nokeynoshade.party/api/queens/${q2Id}`) 
       ]).then(([queen1, queen2]) => {
            setLipsyncs({
              song: song,
              artist: artist,
              q1: queen1.data,
              q2: queen2.data,
              q1won: won1,
              q2won: won2,
              winner: winner
             })
       })   
     })
   }, [questions])

   function handleClick(e){
     if (lipsyncs.winner === e.target.name) {
     setScore(score + 1)
     
     } else {
      setScore(score)
     }
     setQuestions(questions + 1)
     console.log(questions)
     return 
     
   }

return (
    <div>
    {!lipsyncs.q1 && <div>Loading queens...</div>}
      {lipsyncs.q1 && (
    <div className='main'>

            <div>
            <h1>{lipsyncs.song}</h1>
            <h2>{lipsyncs.artist}</h2>
            </div>

            <div>
                <button
                onClick={handleClick}
                name='neither'>
                neither!</button>
        
                <button
                onClick={handleClick}
                name='both'
                >both♥♥</button>
            </div>
        
      
           <div className='options'>
         
             <div>
             <p>{lipsyncs.q1.name}</p>   
            <figure>
                <img 
                    onClick={handleClick}
                    src={img1}
                    alt={lipsyncs.q1.name}
                    name='one'
                />
            </figure>
           </div>
        
           <div>
            <p>{lipsyncs.q2.name}</p>
            <figure>
                <img width='200px' 
                onClick={handleClick}
                src={img2}
                alt={lipsyncs.q2.name}
                name='two'
                />
          </figure>
         </div>
       </div>
      <Score
      score={score}
      />
      </div>
      )
      }
     </div>
)}
      export default Game