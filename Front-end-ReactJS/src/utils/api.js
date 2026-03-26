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

const getRules = ()=>{
    const URL = '/v1/api/rule'

    return axios.get(URL);
}

const deleteRule = (rule_id)=>{
    const URL = '/v1/api/rule/'+rule_id

    return axios.delete(URL);
}

const updateRule = (rule)=>{
    const URL = '/v1/api/rule'

    const data = rule

    return axios.put(URL,data);
}

export {createUserAPI,login,getRules,deleteRule,updateRule}