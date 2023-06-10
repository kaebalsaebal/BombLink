import axios from 'axios'

import Link from 'next/link';
import React, {useState, useEffect} from 'react';
import styles from '@/styles/test.css'

export default function Test({ data }) {

  let board = data;

  const [cursor, setCursor] = useState([0,0]);
  const [cellColors, setCellColors] = useState({
    [`${cursor[0]}-${cursor[1]}`]: 'yellow'
});

  const changeCursor = function(event) {
    const {key, keyCode} = event;

    if (keyCode==37){
        if (cursor[1]>0) {
            setCursor([cursor[0],cursor[1]-1]);
        }
    }
    else if (keyCode==38){
        if (cursor[0]>0) {
            setCursor([cursor[0]-1,cursor[1]]);
        }
    }
    else if (keyCode==39){
        if (cursor[1]<board[1].length-1) {
            setCursor([cursor[0],cursor[1]+1]);
        }
    }
    else if (keyCode==40){
        if (cursor[0]<board.length-1){
            setCursor([cursor[0]+1,cursor[1]]);
        }
    }
    
    setCellColors({
        [`${cursor[0]}-${cursor[1]}`]: 'yellow'
    });
  }

  useEffect( ()=>{
    window.addEventListener('keydown', changeCursor);
    return () => {
        window.removeEventListener('keydown', changeCursor);
      };
  });

  return (
    <div>
      <h1>This is the Test</h1>
      <table className='board'>
        <tbody>
            {board.map((row: Array<string>, idx: number) => (
                <tr key={idx}>
                    {row.map((val: string, idx2: number) => {
                        const cellKey = `${idx}-${idx2}`;
                        const cellColor = cellColors[cellKey] || 'white';
                        return (
                        <td key={cellKey} style={{color: cellColor}}>{val}</td>
                        )
                    })}
                </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
  
export async function getServerSideProps() {
  try {
      const response = await axios.get('http://127.0.0.1:8000/test');
      const data = response.data.board;
      return { props: {data} };
  } catch (error) {
      console.error(error);
      return { props: {data: []} };
  }
}