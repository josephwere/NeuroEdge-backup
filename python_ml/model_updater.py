import time
from ml_models import check_for_update, load

def auto_update_models(registry, interval=3600):
    while True:
        for engine_name, model in registry.models.items():
            if check_for_update(engine_name):
                print(f"♻️ Updating model for {engine_name}")
                registry.load_model(engine_name, f"models/{engine_name}.pt")
        time.sleep(interval)
