import axios from 'axios'

import Link from 'next/link';
import React, {useState, useEffect} from 'react';
import styles from '@/styles/test.module.css';

export default function Test({ data }) {

  const [board,setBoard] = useState(data);
  const [cursor, setCursor] = useState([parseInt(board.length/2),1]);
  const [cellColors, setCellColors] = useState({
    [`${cursor[0]}-${cursor[1]}`]: 'yellow'
  });

  useEffect( ()=>{
    //커서 이동-리스너 사용
    window.addEventListener('keydown', moveCursor);
    //색갈 입히기-moveCursor 내 넣으면 리스너로 넘어간 변수값 기준 처리되어 한턴 늦게반영
    setCellColors({
        [`${cursor[0]}-${cursor[1]}`]: 'yellow'
    });
    //커서 이동 리스너 제거
    return () => {
        window.removeEventListener('keydown', moveCursor);
      };
  },[cursor]); //의존성에 cursor 추가하여 리스너에 바뀐값 반영

  const moveCursor = function(event) {
    const {key, keyCode} = event;

    //커서 범위 기준
    //가로:1 이상 가로길이-1 이하
    //세로:전체길이/2 이상 전체길이-1 이하
    //ex)가로 5 세로 5일 경우 전체 판 길이는 7x12
    //이때 가로 인덱스가 1 이상 6 이하로, 세로는 6 이상 11 이하
    if (keyCode==37 || keyCode==65){ //왼쪽
        if (cursor[1]>1 && board[cursor[0]][cursor[1]-1]!=0) {
            setCursor([cursor[0],cursor[1]-1]);
        }
    }
    else if (keyCode==38 || keyCode==87){ //위쪽
        if (cursor[0]>parseInt(board.length/2) && board[cursor[0]-1][cursor[1]]!=0) {
            setCursor([cursor[0]-1,cursor[1]]);
        }
    }
    else if (keyCode==39 || keyCode==68){ //오른
        if (cursor[1]<board[1].length-2 && board[cursor[0]][cursor[1]+1]!=0) {
            setCursor([cursor[0],cursor[1]+1]);
        }
    }
    else if (keyCode==40 || keyCode==83){ //아래
        if (cursor[0]<board.length-2 && board[cursor[0]+1][cursor[1]]!=0){
            setCursor([cursor[0]+1,cursor[1]]);
        }
    }
    else if(keyCode==32){ //회전
        if (board[cursor[0]][cursor[1]]!=0){
            axios.post('http://127.0.0.1:8000/rotate/',{
                sero: `${cursor[0]}`,
                karo: `${cursor[1]}`,
                witch: `${board[cursor[0]][cursor[1]]}`
            }).then((response)=>{
                setBoard(response.data.board);
            }).catch((error)=>console.log(error))
        }
    }
  }

  const playGame = function(event) {
    axios.get('http://127.0.0.1:8000/play').then((response)=>{
    setBoard(response.data.board);
    }).catch((error)=>console.log(error));

  }

  useEffect(()=>{
    setBoard(board);
  },[board])

  return (
    <div>
      <h1>This is the Test</h1>
      <table className={styles.board}>
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
      <div>
        <button onClick={playGame}>시작</button>
      </div>
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