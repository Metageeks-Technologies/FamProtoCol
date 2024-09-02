import axios from 'axios';

const token=process.env.TELE_BOT_TOKEN;

const baseUrl=`https://api.telegram.org/bot${token}`;

export const tele_api = async () => {
  return {
    get(method: string, params: any) {
      return axios.get(`/${method}`, {
        baseURL: baseUrl,
        params,
      });
    },
    post(method: string, data: any) {
      return axios({
        method: "post",
        baseURL: baseUrl,
        url: `/${method}`,
        data,
      });
    }
  }
}
