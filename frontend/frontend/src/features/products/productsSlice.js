import {createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../api/axios'
export const fetchProducts = createAsyncThunk(
    'products/fetchAll',
    async (params = {}, {rejectWithValue}) =>{
        try{
            const {data} = await axios.get('/products',{params})
            return data
        } catch(err){
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch products')
        }
    }
)
export const fetchProductById = createAsyncThunk(
    'products/fetchById',
    async(Id, {rejectedWithValue}) =>{
        try{
            const { data} = await axios.get (`products/${id}`)
            return data
        } catch(err){
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch product')
        }
    }
)
const productsSlice = createSlice({
    name :'products',
    initialState : {
        items: [],
        selectedProduct: null,
        loading: false,
        error:'',
        count:0,
    },
    reducers:{},
    extraReducers: (builder) => {
  builder
    .addCase(fetchProducts.pending, (state) => {
      state.loading = true;
      state.error = '';
    })

    .addCase(fetchProducts.fulfilled, (state,action)=>{
            state.loading= false
            state.items= action.payload.products
            state.count = action .payload.count

        })
        .addCase(fetchProducts.rejected,(state,action)=>{
            state.loading = false
            state.error = action.payload
        })
        .addCase(fetchProductById.pending,(state)=>{
            state.loading = true
        })
        .addCase(fetchProductById.fulfilled,(state,action)=>{
            state.loading = false
            state.selectedProduct = action.payload
        })
        .addCase(fetchProductById.rejected,(state,action)=>{
            state.loading = false
            state.error = action.payload
        })

        }
    
})
export default productsSlice.reducer