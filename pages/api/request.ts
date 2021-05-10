import axios, {Method} from 'axios';

export type Headers = {contentType: string};
export type Request = {
  url: string;
  method: Method;
  requestName: string;
  headers: Headers;
  body: object;
};
export type Response = {status: number; headers: Headers; body: object};

export default async (req, res) => {
  let request: Request = req.body;
  // console.log('REQUEST', request);
  try {
    let response = await axios({
      method: request.method,
      url: request.url,
      headers: request.headers,
      data: request.body,
    });
    let jsonResponse: Response = {
      status: response.status,
      body: response.data,
      headers: response.headers,
    };
    res.json(jsonResponse);
  } catch (error) {
    let jsonResponse: Response = {
      status: error.response.status,
      body: {},
      headers: error.response.headers,
    };
    res.json(jsonResponse);
  }
};
