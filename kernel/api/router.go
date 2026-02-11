//kernel/api/router.go
package handlers

import (
	"net/http"

	"github.com/gorilla/mux"
)

func secureHandler(next http.HandlerFunc) http.HandlerFunc {
	return withRequestLogging(withRateLimit(withAPIKeyAuth(next)))
}

func NewRouter() *mux.Router {
	r := mux.NewRouter()

	// Public health/liveness
	r.HandleFunc("/healthz", withRequestLogging(func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte("ok"))
	})).Methods("GET")

	// Protected kernel routes
	r.HandleFunc("/kernel/health", secureHandler(HealthHandler)).Methods("GET")
	r.HandleFunc("/kernel/nodes", secureHandler(NodesHandler)).Methods("GET")
	r.HandleFunc("/kernel/capabilities", secureHandler(CapabilitiesHandler)).Methods("GET")

	return r
}
