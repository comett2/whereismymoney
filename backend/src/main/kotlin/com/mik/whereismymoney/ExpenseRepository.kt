package com.mik.whereismymoney

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ExpenseRepository : JpaRepository<Expense, Long>;