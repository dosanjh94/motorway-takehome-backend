const queryMock = jest.fn();
const mockCache = {
  get: jest.fn(),
  put: jest.fn()
}
import { getVehicleState } from "../../services/vehicleStateService";

// Create a mock Sequelize module
jest.mock("sequelize", () => {
  return { Sequelize: jest.fn().mockImplementation(() => ({ query: queryMock })) };
});

class MockCache {
  cache: {[key:string]: any};
  constructor() {
    this.cache = {};
  }

  get(key: string) {
    return this.cache[key];
  }

  put(key: string, value: any) {
    this.cache[key] = value;
  }

  clear() {
    this.cache = {};
  }
}


var memoryCache = new MockCache();

jest.mock("memory-cache", () => ({
  Cache: jest.fn().mockImplementation(() => (mockCache)),
}));


describe("getVehicleState", () => {
  beforeEach(() => {
    // Clear the cache and reset the mock before each test
    memoryCache.clear();

    jest.clearAllMocks();
  });


  it("should retrieve vehicle state from the database if not available in cache", async () => {
    // Arrange
    const vehicleId = 1;
    const lastStateDate = new Date("2023-05-17");
    const expectedQuery = `select s.state from "vehicles" v join "stateLogs" s 
    on s."vehicleId" = v.id where v.id = ${vehicleId} and s."timestamp" < to_timestamp(${lastStateDate.getTime()/1000})
    order by s."timestamp" desc limit 1`;
    const databaseResult = { state: "database value" };

    // Mock the Sequelize query method to return the database result

    queryMock.mockResolvedValue([databaseResult])
    // Act
    const result = await getVehicleState(vehicleId, lastStateDate);

    // Assert
    expect(result).toEqual(databaseResult);
    expect(queryMock).toHaveBeenCalledWith(expectedQuery);
    expect(queryMock).toHaveBeenCalledTimes(1);
  });

  it("should retrieve vehicle state from cache if available", async () => {
    // Arrange
    const vehicleId = 1;
    const lastStateDate = new Date("2023-05-17");

    // Set the cached value
    const cachedValue = "cached value";
    console.log(memoryCache);

    mockCache.get.mockReturnValue(cachedValue)

    // Act
    const result = await getVehicleState(vehicleId, lastStateDate);

    // Assert
    expect(result).toBe(cachedValue);
    expect(mockCache.get).toHaveBeenCalledWith(`${vehicleId}${lastStateDate}`);
    expect(mockCache.get).toHaveBeenCalledTimes(2);
  });


});
