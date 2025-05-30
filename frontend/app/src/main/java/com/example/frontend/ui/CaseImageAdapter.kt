package com.example.frontend.ui

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.example.frontend.databinding.ItemCaseBinding
import com.example.frontend.model.DonationCase

class PendingCaseAdapter(
    private val list: List<DonationCase>,
    private val onItemClick: (DonationCase) -> Unit
) : RecyclerView.Adapter<PendingCaseAdapter.ViewHolder>() {

    inner class ViewHolder(private val binding: ItemCaseBinding) : RecyclerView.ViewHolder(binding.root) {
        fun bind(item: DonationCase) {
            binding.tvTitle.text = item.title
            binding.tvDescription.text = item.description
            binding.root.setOnClickListener {
                onItemClick(item)
            }
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val binding = ItemCaseBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ViewHolder(binding)
    }

    override fun getItemCount(): Int = list.size

    override fun onBindViewHolder(holder: ViewHolder, position: Int) = holder.bind(list[position])
}
