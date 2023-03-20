import axios from 'axios'
import { useEffect, useState, useReducer } from 'react';
function Rules(params) {
    const [ignored, forcedUpdate] = useReducer(x => x + 1, 0)
    const [rules, setRules] = useState([])
    const [Details, setDetails] = useState([])
    useEffect(() => {
        getRules()
    }, [])
    async function getRules() {
        let result = await axios.get(params.baseUrl + 'rules')
        setRules(result.data.Rules)
    }
    const handleAddDetails = (e) => {
        e.preventDefault()
        let id = e.target.value
        let d = Details
        d.push(id)
        setDetails(d)
        forcedUpdate()
    }
const handleRemoveDetails = (e)=>{
    e.preventDefault()
        let id = e.target.value
        let d = Details
        d = removeItemAll(d,id)
        setDetails(d)
        forcedUpdate()
}
    function removeItemAll(arr, value) {
        var i = 0;
        while (i < arr.length) {
          if (arr[i] === value) {
            arr.splice(i, 1);
          } else {
            ++i;
          }
        }
        return arr;
      }

    return (<>
        {rules && <div className="rules">
            {rules.map((rule) =>
                <div key={rule.id}>
                    {rule.Rule}
                    {Details.includes(String(rule.id)) && <>{rule.Description}<button value={rule.id} onClick={handleRemoveDetails}>Hide</button></>}
                    {!Details.includes(String(rule.id)) &&
                        <button value={rule.id} onClick={handleAddDetails}>Details</button>}
                </div>
            )}
        </div>}
    </>)
}

export default Rules;