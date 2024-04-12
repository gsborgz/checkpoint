import { AppStatus } from '@/app/api/v1/status/route';

describe('api/v1/status', () => {
  describe('GET', () => {
    it('should return 200', async () => {
      const response = await fetch('http://localhost:3000/api/v1/status');
      const responseBody: AppStatus = await response.json();
      const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();

      expect(response.status).toBe(200);
      expect(responseBody.updated_at).toEqual(parsedUpdatedAt);
      expect(responseBody.dependencies.database.version).toEqual('16.2');
      expect(responseBody.dependencies.database.max_connections).toBeDefined();
      expect(responseBody.dependencies.database.opened_connections).toBe(1);
    });
  });
});
