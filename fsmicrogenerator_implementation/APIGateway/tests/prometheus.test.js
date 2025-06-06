const fs = require('fs');
const path = require('path');
const { generatePrometheusTargets } = require('../helpers/prometheus.helpers');

jest.mock('fs');

describe('generatePrometheusTargets', () => {
  const mockServices = [
    {
      serviceName: 'product',
      instances: [
        { host: 'product1', port: '3000', status: 'enabled' },
        { host: 'product2', port: '3000', status: 'disabled' }
      ]
    },
    {
      serviceName: 'customer',
      instances: [
        { host: 'customer1', port: '3000', status: 'enabled' }
      ]
    }
  ];

  const outputPath = path.join(__dirname, 'mock_services.json');

  beforeEach(() => {
    fs.writeFileSync.mockClear();
    fs.mkdirSync.mockClear();
  });

  it('should generate correct targets and write to file', async () => {
    await generatePrometheusTargets(mockServices, outputPath);

    const expectedOutput = [
      {
        targets: ['product1:3000'],
        labels: { job: 'product_service' }
      },
      {
        targets: ['customer1:3000'],
        labels: { job: 'customer_service' }
      }
    ];

    expect(fs.mkdirSync).toHaveBeenCalledWith(path.dirname(outputPath), { recursive: true });
    expect(fs.writeFileSync).toHaveBeenCalledWith(outputPath, JSON.stringify(expectedOutput, null, 2));
  });
});
