package com.mik.whereismymoney
import jakarta.persistence.*
import java.time.LocalDate

@Entity
@Table(name = "expenses")
data class Expense(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    val category: String,
    val amount: Double,
    val date: LocalDate = LocalDate.now()
)