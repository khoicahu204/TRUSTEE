package com.example.frontend.model

data class DonationCase(
    val id: Int,
    val title: String,
    val description: String,
    val targetAmount: Int,
    val currentAmount: Int,
    val status: String,
    val createdAt: String,
    val user: User,
    val images: List<CaseImage>?
)
