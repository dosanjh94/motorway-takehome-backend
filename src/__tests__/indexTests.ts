import request from 'supertest';
import { app } from '../index';

describe('Vehicle API', () => {

  it('should return 400 Bad Request for invalid vehicleId parameter', async () => {
    const response = await request(app)
      .get('/invalidId/2023-05-18T10:00:00')
      .expect(400);

    // Add assertions to validate the response
    expect(response.body.errors).toContainEqual({"location": "params", "msg": "Invalid value", "path": "vehicleId", "type": "field", "value": "invalidId"});
  });

  it('should return 400 Bad Request for invalid timestamp parameter', async () => {
    const response = await request(app)
      .get('/1/invalidTimestamp')
      .expect(400);
  
    // Add assertions to validate the response
    expect(response.body.errors).toContainEqual({"location": "params", "msg": "Invalid value", "path": "timestamp", "type": "field", "value": "invalidTimestamp"});
  });

});
