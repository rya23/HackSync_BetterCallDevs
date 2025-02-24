import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler


class TravelDataProcessor:
    def __init__(self):
        self.scaler = StandardScaler()

    def preprocess_location_data(self, data):
        """Preprocesses location data including coordinates, ratings, and features"""
        processed_data = pd.DataFrame(data)
        numerical_cols = ["latitude", "longitude", "rating", "price_level"]
        processed_data[numerical_cols] = self.scaler.fit_transform(
            processed_data[numerical_cols]
        )
        return processed_data

    def encode_user_preferences(self, preferences):
        """Converts user preferences into embeddings"""
        preference_vector = np.zeros(128)
        # Simulate preference encoding
        for pref in preferences:
            preference_vector += self._get_preference_embedding(pref)
        return preference_vector
