import { CoreApi } from '@framework/utils/core-api';
import { API_ENDPOINTS } from '@framework/utils/endpoints';

export type CustomerType = {
  id: string;
  [key: string]: unknown;
};
export type ContactType = {
  name: string;
  email: string;
  subject: string;
  description: string;
};

class Customer extends CoreApi {
  constructor(_base_path: string) {
    super(_base_path);
  }
  async updateCustomer(input: CustomerType) {
    const res = await this.http
      .put(this._base_path + '/' + input.id, input);
    return res.data;
  }
  async contact(input: ContactType) {
    const res = await this.http.post(API_ENDPOINTS.CONTACT, input);
    return res.data;
  }
  async deleteAddress({ id }: { id: string }) {
    const res = await this.http
      .delete(`${API_ENDPOINTS.ADDRESS}/${id}`);
    return res.data;
  }
}

export const CustomerService = new Customer(API_ENDPOINTS.CUSTOMERS);
