from models.transformer_model import TravelTransformerModel
from models.gnn_model import TravelGNN
from models.seq2seq_planner import Seq2SeqPlanner
from utils.data_processor import TravelDataProcessor


class AITravelPlanner:
    def __init__(self):
        self.transformer = TravelTransformerModel()
        self.gnn = TravelGNN()
        self.seq2seq = Seq2SeqPlanner()
        self.data_processor = TravelDataProcessor()

    def generate_travel_plan(self, user_query, duration, preferences):
        # Extract travel preferences using transformer
        travel_embeddings = self.transformer.extract_travel_preferences(user_query)

        # Process location data
        processed_data = self.data_processor.preprocess_location_data(
            self._fetch_location_data()
        )

        # Optimize route using GNN
        optimal_route = self.gnn.optimize_route(processed_data, preferences)

        # Generate detailed itinerary
        itinerary = self.seq2seq.generate_itinerary(travel_embeddings, duration)

        return self._format_response(itinerary, optimal_route)

    def _fetch_location_data(self):
        # Simulate fetching location data from database
        return {"locations": [...], "ratings": [...], "features": [...]}
