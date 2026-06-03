import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../api/axios'
// - Async thunks -
export const registerUser = createAsyncThunk(
    'auth/register',
    async (userData, {rejectWithValue}) =>{
        try{
            const {data} = await axios.post('/auth/register', userData)
            localStorage.setItem('token', data.token)
            return data
        } catch(err){
            console.log("AXIOS ERROR:", err);
            console.log("RESPONSE:", err.response);
            return rejectWithValue(err.response?.data?.message || 'Registration failed')
        }
    }
)
export const loginUser = createAsyncThunk(
    'auth/login', async(userData, {rejectWithValue}) =>{
        try{
            const {data} = await axios.post('/auth/login',userData)
            localStorage.setItem('token', data.token)
            return data
        } catch (err){
            return rejectWithValue (err.response?.data?.message || 'login failed')
        }
    }
)
 // -slice -
 const authSlice = createSlice({
    name:'auth',
    initialState:{
        user:null,
        token:localStorage.getItem('token') || null,
        loading:false,
        error:'',
    },
    reducers: {
        logout: (state)=>{
            state.user = null
            state.token = null
            localStorage.removeItem('token')
        },
        clearError:(state)=>{
            state.error =''
        },
    },
    extraReducers: (builder)=> {
        builder
        //register
        .addCase(registerUser.pending,(state)=>{
            state.loading = true
            state.error = ''
        })
        .addCase(registerUser.fulfilled,(state,action)=>{
            state.loading= false
            state.user = action.payload.user
            state.token = action.payload.token
        })
        .addCase(registerUser.rejected,(state,action)=>{
            state.loading = false
            state.error = action.payload
        })
        //login
        .addCase(loginUser.pending,(state)=>{
            state.loading = true
            state.error =''
        })
        .addCase(loginUser.fulfilled,(state,action)=>{
            state.loading = false
            state.user = action.payload.user
            state.token = action.payload.token

        })
        .addCase(loginUser.rejected, (state,action)=>{
            state.loading = false
            state.error = action.payload
        })
    }
 })
 export const {logout, clearError} = authSlice.actions
 export default authSlice.reducer

