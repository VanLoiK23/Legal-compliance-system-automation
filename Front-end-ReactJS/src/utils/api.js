import axios from "./axios.customize";

const createUserAPI =(name,email,password)=>{
    const URL = '/v1/api/register'
    const data = {
        name,email,password
    }
    return axios.post(URL,data)
}

const login =(email,password)=>{
    const URL = '/v1/api/login'
    const data = {
        email,password
    }
    return axios.post(URL,data)
}

const getUser = ()=>{
    const URL = '/v1/api/user'

    return axios.get(URL);
}

const deleteUser = (id)=>{
    const URL = '/v1/api/user/'+id

    return axios.delete(URL);
}

const updateUser = (user)=>{
    const URL = '/v1/api/user'

    const data = user

    return axios.put(URL,data);
}

export {createUserAPI,login,getUser,deleteUser,updateUser}