package httpx

import (
	"io/fs"
	"log"
	"net/http"
	"path"
	"strings"
)

func StaticHandler(assets fs.FS) http.Handler {
	files := http.FileServer(http.FS(assets))
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		name := strings.TrimPrefix(path.Clean(r.URL.Path), "/")
		if name != "" {
			// "" is root, never 404
			if _, err := fs.Stat(assets, name); err != nil {
				serveNotFound(w, r, assets)
				return
			}
		}
		files.ServeHTTP(w, r)
	})
}

func serveNotFound(w http.ResponseWriter, r *http.Request, assets fs.FS) {
	page, err := fs.ReadFile(assets, "404.html")
	if err != nil {
		// Fallback if 404.html is not found
		http.NotFound(w, r)
	}
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.WriteHeader(http.StatusNotFound)
	_, err = w.Write(page)
	if err != nil {
		log.Fatalf("write 404 page: %v", err)
	}
}
