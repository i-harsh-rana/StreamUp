import axios from 'axios'

const getSubscribersCount = async(userId)=>{
    try {
        const response = await axios.get(`/api/v1/subscription/us/${userId}`, {
            withCredentials: true
        })
        
        return response.data.data.length;

    } catch (error) {
        console.log('Error in fetching Subscribers Count', error);
    }
}

export {
    getSubscribersCount
}