package main

import (
	"master/internal/router"
)

func main() {
	r := router.NewRouter()
	r.Run(":8022") // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}
