import apiClient from './api';

export interface TileDTO {
  id?: number;
  title: string;
  text: string;
  color: string;
  category: 'ZUHAUSE' | 'DRAUSSEN' | 'ARZT' | 'ESSEN' | 'NOTFALL';
  position?: number;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

class TileService {
  async getAllTiles(): Promise<TileDTO[]> {
    const response = await apiClient.get<TileDTO[]>('/tiles');
    return response.data;
  }

  async getTilesByCategory(category: string): Promise<TileDTO[]> {
    const response = await apiClient.get<TileDTO[]>(`/tiles/category/${category}`);
    return response.data;
  }

  async getTile(id: number): Promise<TileDTO> {
    const response = await apiClient.get<TileDTO>(`/tiles/${id}`);
    return response.data;
  }

  async createTile(tile: TileDTO): Promise<TileDTO> {
    const response = await apiClient.post<TileDTO>('/tiles', tile);
    return response.data;
  }

  async updateTile(id: number, tile: TileDTO): Promise<TileDTO> {
    const response = await apiClient.put<TileDTO>(`/tiles/${id}`, tile);
    return response.data;
  }

  async deleteTile(id: number): Promise<void> {
    await apiClient.delete(`/tiles/${id}`);
  }

  async reorderTiles(tileIds: number[]): Promise<void> {
    await apiClient.post('/tiles/reorder', { tileIds });
  }
}

export default new TileService();
