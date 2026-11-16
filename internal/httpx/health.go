package httpx

import "net/http"

func GetHealth(w http.ResponseWriter, r *http.Request) {
	writeJson(w, http.StatusOK, map[string]bool{"ok": true})
}
