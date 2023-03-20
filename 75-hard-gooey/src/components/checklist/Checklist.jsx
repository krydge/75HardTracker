import { useEffect, useState } from "react";
import axios from 'axios'
function Checklist(params) {
    const [activities, setActivities] = useState([])
    const [completed, setCompleted] = useState([])
    useEffect(() => {
        getActivities()
    }, [])
    async function getActivities() {
        let result = await axios.get(params.baseUrl + 'activities')
        setActivities(result.data)
    }
    async function getCompleted() {
        let body= {"user":{"username":params.username}}
        let result = await axios.get(params.baseUrl + 'completed',{ params: { body } })
        setCompleted(result.data)
    }
    console.log(activities)
    return (
        <div>
            {activities && activities.map((activity) =>
                <div key={activity.id}>
                    {activity.activity_name}<input type="checkbox" value="false"></input>
                </div>
            )}
        </div>
    )
}

export default Checklist