
function List(props){
    const item = (
        props.data.listData.map((item,index)=>{
            return (
                <li key={index}>
                    <input type="checkbox" checked={props.type==='done'} onChange={()=>props.checkboxChange(index,props.type)}></input>
                    <p className="title">{item.title}</p>
                    <div className="priceBox">
                        {item.priceData.map((ltem,index)=>
                        <p key={index}>{parseFloat(ltem.toFixed(3))}</p>
                        )}
                    </div>
                </li>
            )
        })
    );
    
    const sum = (
        props.data.sumData.map((item,index)=>
            <p key={index}>{parseFloat(item.toFixed(3))}</p>
        )

    );
  
    return(
        <div>
            <ul className="list">{item}</ul>
            <div className="list">
                <span className="title">{props.type==='todo'?'将要花费：':'已花费：'}</span>
                <div className="priceBox">
                    {sum}
                </div>
            </div>
        </div>
    )
}


  
export default List;