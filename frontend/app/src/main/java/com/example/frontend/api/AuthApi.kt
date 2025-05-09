package com.example.charityapp.api

import com.example.charityapp.model.RegisterRequest
import com.example.charityapp.model.UserResponse
import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.POST

interface AuthApi {
    @POST("auth/register")
    fun register(@Body request: RegisterRequest): Call<UserResponse>
}