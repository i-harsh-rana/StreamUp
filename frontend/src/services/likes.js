import axios from "axios"

const fetchCommnetLike = async(commentId)=>{
    try {
        const response = await axios.get(`/api/v1/like/toggle/c/${commentId}`, {
            withCredentials: true
        })
        console.log(response.data.data);
        
        if(response.status === 200){
            return response.data.data
        }
    } catch (error) {
        console.log("Error in toggle comment likes", error)
    }
}

export {
    fetchCommnetLike
}