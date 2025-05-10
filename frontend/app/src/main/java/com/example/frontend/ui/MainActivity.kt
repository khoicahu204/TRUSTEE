package com.example.frontend

import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.example.charityapp.api.ApiClient
import com.example.charityapp.api.AuthApi
import com.example.charityapp.model.RegisterRequest
import com.example.charityapp.model.UserResponse
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class MainActivity : AppCompatActivity() {

    private lateinit var etName: EditText
    private lateinit var etEmail: EditText
    private lateinit var etPassword: EditText
    private lateinit var btnRegister: Button
    private lateinit var tvResult: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // Khởi tạo view
        etName = findViewById(R.id.etName)
        etEmail = findViewById(R.id.etEmail)
        etPassword = findViewById(R.id.etPassword)
        btnRegister = findViewById(R.id.btnRegister)
        tvResult = findViewById(R.id.tvResult)

        btnRegister.setOnClickListener {
            val name = etName.text.toString().trim()
            val email = etEmail.text.toString().trim()
            val password = etPassword.text.toString().trim()

            if (name.isEmpty() || email.isEmpty() || password.isEmpty()) {
                tvResult.text = "Vui lòng điền đầy đủ thông tin."
                return@setOnClickListener
            }

            val request = RegisterRequest(name, email, password)
            val authApi = ApiClient.retrofit.create(AuthApi::class.java)

            authApi.register(request).enqueue(object : Callback<UserResponse> {
                override fun onResponse(call: Call<UserResponse>, response: Response<UserResponse>) {
                    if (response.isSuccessful) {
                        val user = response.body()
                        tvResult.text = "Đăng ký thành công: ${user?.email}"
                    } else {
                        tvResult.text = "Lỗi: ${response.errorBody()?.string()}"
                    }
                }

                override fun onFailure(call: Call<UserResponse>, t: Throwable) {
                    tvResult.text = "Kết nối thất bại: ${t.message}"
                }
            })
        }
    }
}