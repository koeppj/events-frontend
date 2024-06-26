export type BoxUser = {
  name: string;
  email: string;
  id: string;
};

export type BoxConfig = {
  client_id: string
  client_secret: string,
  enterprise_id: string,
  api_endpoint: string,
};

export type BackendData = {
  accessToken: string,
  boxConfig: BoxConfig,
  boxUser: BoxUser
}

export type LoginResponse = {
  success: boolean,
  responseMessage: string,
  backendData: BackendData | undefined
}




