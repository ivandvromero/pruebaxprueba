import axios from 'axios';
import { AxiosAdapter } from './axios-adapter';
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('AxiosAdapter', () => {
  const http: AxiosAdapter = new AxiosAdapter();
  it('should send a get request', async () => {
    const mockData = 'test';
    mockedAxios.get.mockResolvedValue({ data: mockData });
    const url = 'www.url.com';
    const headers = {};
    const res = await http.get(url, headers);
    expect(res).toEqual(mockData);
  });

  it('should send a post request', async () => {
    const mockData = ['test'];
    mockedAxios.post.mockResolvedValue({ data: mockData });
    const url = 'www.url.com';
    const headers = {};
    const body = {};
    const res = await http.post(url, headers, body);
    expect(res).toEqual(mockData);
  });

  it('should send a post request', async () => {
    const mockData = ['test'];
    mockedAxios.post.mockResolvedValue({ data: mockData });
    const url = 'www.url.com';
    const headers = {};
    const body = {};
    const res = await http.postMambu(url, headers, body);
    expect(res).toEqual({ data: mockData });
  });
});
