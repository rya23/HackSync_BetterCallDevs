import torch
import torch.nn as nn


class ItineraryEncoder(nn.Module):
    def __init__(self, input_dim, hidden_dim):
        super(ItineraryEncoder, self).__init__()
        self.hidden_dim = hidden_dim
        self.lstm = nn.LSTM(input_dim, hidden_dim, batch_first=True)

    def forward(self, x):
        return self.lstm(x)


class ItineraryDecoder(nn.Module):
    def __init__(self, hidden_dim, output_dim):
        super(ItineraryDecoder, self).__init__()
        self.lstm = nn.LSTM(hidden_dim, hidden_dim, batch_first=True)
        self.fc = nn.Linear(hidden_dim, output_dim)

    def forward(self, x, hidden):
        output, hidden = self.lstm(x, hidden)
        return self.fc(output), hidden


class Seq2SeqPlanner:
    def __init__(self):
        self.encoder = ItineraryEncoder(input_dim=256, hidden_dim=128)
        self.decoder = ItineraryDecoder(hidden_dim=128, output_dim=512)

    def generate_itinerary(self, user_preferences, duration):
        # Generate day-by-day itinerary
        encoded_prefs = self.encoder(user_preferences)
        daily_plans = self.decoder.generate_sequence(encoded_prefs, max_length=duration)
        return self._format_itinerary(daily_plans)
