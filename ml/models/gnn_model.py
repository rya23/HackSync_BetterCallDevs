import torch
import torch_geometric
from torch_geometric.nn import GCNConv, global_mean_pool


class TravelGNN(torch.nn.Module):
    def __init__(self):
        super(TravelGNN, self).__init__()
        self.conv1 = GCNConv(in_channels=128, out_channels=64)
        self.conv2 = GCNConv(in_channels=64, out_channels=32)
        self.classifier = torch.nn.Linear(32, 16)

    def forward(self, x, edge_index, batch):
        x = self.conv1(x, edge_index)
        x = torch.relu(x)
        x = self.conv2(x, edge_index)
        x = global_mean_pool(x, batch)
        return self.classifier(x)

    def optimize_route(self, locations, constraints):
        # Convert locations to graph structure
        graph = self._build_travel_graph(locations)
        return self.forward(graph.x, graph.edge_index, graph.batch)
