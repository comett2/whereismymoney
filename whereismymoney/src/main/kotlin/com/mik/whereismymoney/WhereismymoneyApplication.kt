package com.mik.whereismymoney

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class WhereismymoneyApplication

fun main(args: Array<String>) {
	runApplication<WhereismymoneyApplication>(*args)
    System.out.println("Hello, World!")
}
