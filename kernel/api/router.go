package handlers

import (
	"net/http"

	"github.com/gorilla/mux"
)

func NewRouter() *mux.Router {
	r := mux.NewRouter()
	r.HandleFunc("/kernel/health", HealthHandler).Methods("GET")
	r.HandleFunc("/kernel/nodes", NodesHandler).Methods("GET")
	r.HandleFunc("/kernel/capabilities", CapabilitiesHandler).Methods("GET")
	return r
}
