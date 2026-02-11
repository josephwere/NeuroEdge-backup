//kernel/api/router.go
package handlers

import (
	"net/http"

	"github.com/gorilla/mux"
)

func NewRouter() *mux.Router {
	r := mux.NewRouter()

	// Public health/liveness
	r.HandleFunc("/healthz", func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte("ok"))
	}).Methods("GET")

	// Protected kernel routes
	r.HandleFunc("/kernel/health", withAPIKeyAuth(HealthHandler)).Methods("GET")
	r.HandleFunc("/kernel/nodes", withAPIKeyAuth(NodesHandler)).Methods("GET")
	r.HandleFunc("/kernel/capabilities", withAPIKeyAuth(CapabilitiesHandler)).Methods("GET")

	return r
}
