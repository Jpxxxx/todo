
import React, { useState,useEffect } from 'react';
import axios from 'axios';
import './App.css';
import List from './components/list';
import _ from 'lodash';


function App() {

  const [hlData, sethlData] = useState({});
  const [hlArr, sethlArr] = useState([]);
  const [list,setList]=useState(
    {
      todoList:{listData:[],sumData:[0,0,0]},
      doneList:{listData:[],sumData:[0,0,0]}
    }
  )

  const [loading,setLoading] =useState(false);
    
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState('CNY');



  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await axios(
        'https://api.globus.furniture/forex',
      );
      sethlData(result.data);
      let hlArr=[];
      hlArr.push(change('RUB','CNY',1,result.data));
      hlArr.push(change('RUB','USD',1,result.data));
      hlArr.push(change('CNY','USD',1,result.data));

      sethlArr(hlArr);
      setLoading(false);
    };
    fetchData();
  }, []);


  // 汇率条
  const bar = (
    hlArr.map((item,index)=>
      <span key={index}>{parseFloat(item.toFixed(3))} </span>
    )
  );

  function add() {
    let {todoList,doneList}=_.cloneDeep(list);
    let itemData={title:'',priceData:[],done:false};

    itemData.title=title;
    itemData.priceData[0]=change('RUB',type,price,hlData);
    itemData.priceData[1]=change('CNY',type,price,hlData);
    itemData.priceData[2]=change('USD',type,price,hlData);

    todoList.listData.push(itemData);
    todoList.sumData=sum(todoList.listData);
    
    setList({todoList,doneList})
  }

  function sum(data){
    let sum=[0,0,0];
    sum.forEach((sumItem,index)=>{
      data.forEach((rowItem)=>{
        sum[index]+=rowItem.priceData[index];
      })
    })
    return sum
  }

  function checkboxChange(index,type){
    let {todoList,doneList}=_.cloneDeep(list);

    if(type==='todo'){
      doneList.listData.push(_.cloneDeep(todoList.listData[index]));
      todoList.listData.splice(index,1);
    }else{
      todoList.listData.push(_.cloneDeep(doneList.listData[index]));
      doneList.listData.splice(index,1);
    }

    todoList.sumData=sum(todoList.listData);
    doneList.sumData=sum(doneList.listData);
    setList({todoList,doneList})
  }


  return (
    <div className="App">
      <form>
        <input placeholder="任务" value={title} onChange={(event)=>{setTitle(event.target.value)}}></input>
        <input placeholder="价格" value={price} onChange={(event)=>{setPrice(event.target.value)}}></input>
        <select value={type} onChange={(event)=>{setType(event.target.value)}}>
          <option value ="CNY">人民币</option>
          <option value ="USD">美元</option>
          <option value ="RUB">卢布</option>
        </select>
        <button type="button" disabled={loading} onClick={() => add()}>添加</button>
      </form>
      <div className="bar">{bar}</div>

      <p>计划：</p>
      <div>
        <List data={list.todoList} type="todo" checkboxChange={checkboxChange}></List>
      </div>

      <p>完成：</p>
      <div>
        <List data={list.doneList} type="done" checkboxChange={checkboxChange}></List>
      </div>

    </div>
  );
}

 // 换算
 function change(type1,type2,price,data,index){ 
  let _data=null;
  if(type1===type2){
      _data=parseFloat(price);
  }else if(type2==='CNY'){
      _data=parseFloat(data[type1].value)*price;        
  }else if(type1==='CNY'){
      _data=price/parseFloat(data[type2].value)
  }else if(type1&&type2){
      let CNY='';
      CNY=price/parseFloat(data[type2].value);
      _data=parseFloat(data[type1].value)*CNY;
  }
  return _data; 
}

export default App;
