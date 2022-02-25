import pickBy from 'lodash/pickBy';
import Request from './request';
type NumberOrString = number | string;
export type ParamsType = {
  type?: string;
  text?: string;
  category?: string;
  status?: string;
  is_active?: string;
  shop_id?: string;
  limit?: number;
};
export class CoreApi {
  http = Request;
  constructor(public _base_path: string) {}
  private stringifySearchQuery(values: any) {
    const parsedValues = pickBy(values);
    return Object.keys(parsedValues)
      .map((k) => {
        if (k === 'type') {
          return `${k}.slug:${parsedValues[k]};`;
        }
        if (k === 'category') {
          return `categories.slug:${parsedValues[k]};`;
        }
        return `${k}:${parsedValues[k]};`;
      })
      .join('')
      .slice(0, -1);
  }
  async find(params: ParamsType) {
    const {
      type,
      text: name,
      category,
      status,
      is_active,
      shop_id,
      limit = 30,
    } = params;
    const searchString = this.stringifySearchQuery({
      type,
      name,
      category,
      status,
      shop_id,
      is_active,
    });
    const queryString = `?search=${searchString}&searchJoin=and&limit=${limit}`;
    return await this.http.get(this._base_path + queryString);
  }
  async findAll() {
    return await this.http.get(this._base_path);
  }
  async fetchUrl(url: string) {
    return await this.http.get(url);
  }
  async postUrl(url: string, data: any) {
    return await this.http.post(url, data);
  }
  async findOne(id: NumberOrString) {
    return await this.http.get(`${this._base_path}/${id}`);
  }
  async create(data: any, options?: any) {
    return await this.http
      .post(this._base_path, data, options)
      .then((res) => res.data);
  }
  async update(id: NumberOrString, data: any) {
    return await this.http
      .put(`${this._base_path}/${id}`, data)
      .then((res) => res.data);
  }
  async delete(id: NumberOrString) {
    return await this.http.delete(`${this._base_path}/${id}`);
  }
  async upload(url: string, variables: any) {
    let formData = new FormData();
    variables.forEach((attachment: any) => {
      formData.append("attachment", attachment);
    });
    const options = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    // const response = await this.http.post(`${this._base_path}`, formData, options);
    const response = await this.http.post(url, formData, options);
    return response.data;
  };
}
