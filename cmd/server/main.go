package main

import (
	"errors"
	"log"
	"net/http"
	"resumetitan/internal/config"
	"resumetitan/internal/httpx"
	"resumetitan/web"
	"time"
)

func main() {
	// Load environment variables, shutdown if missing
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("config error: %v", err)
	}

	mux := http.NewServeMux()

	// Serve static assets at root path
	mux.Handle("/", httpx.StaticHandler(web.Files))

	// Register api routes
	mux.HandleFunc("GET /api/health", httpx.GetHealth)

	srv := &http.Server{
		Addr:         ":" + cfg.Port,
		Handler:      mux,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 20 * time.Second,
		IdleTimeout:  120 * time.Second,
	}

	log.Printf("Server listening on %s\n", srv.Addr)

	if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
		log.Fatalf("Server failed: %v", err)
	}
}
