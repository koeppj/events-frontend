import { BoxClient } from 'box-typescript-sdk-gen';
import { BoxUser, BackendData, LoginResponse } from './types';

export async function login(email: string, password: string): Promise<LoginResponse> {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json; charset=utf-8' },
      body: JSON.stringify({ 
        username: email, 
        password: password })
    });
    if (!response.ok) {
      return { 
        success: false, responseMessage: response.statusText, backendData: undefined 
      };
    }
    const backendData: BackendData = await response.json();
    const loginResponse: LoginResponse = {
      success: true,
      responseMessage: 'Login successful',
      backendData: backendData
    };
    return loginResponse;
  }
  catch (error) {
    console.error('Error logging in:', error);
    return { 
      success: false, responseMessage: "Something went wrong", backendData: undefined 
    };
  }

};

export async function getBoxFolders(client: BoxClient | undefined): Promise<any> {
  if (!client) {
    return [];
  }
  const folders = await client.search.searchForContent({
    query: 'EventsOne',
    type: 'folder'
  })
  console.log('Folders');
  return folders;
};
