export interface Customer {
    _id?: string;
    name: string;
    photo?: string | null;
    email: string;
    phoneNumber?: string;
    address?: string;
    transactions?: [];
    createdAt?: Date;
    updatedAt?: Date;
    [key: string]: any;
  }
  
  export interface CustomerResponse {
    success: boolean;
    data: Customer;
  }
  
  export interface CustomersResponse {
    success: boolean;
    data: Customer[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  }
  
  export interface CustomerParams {
    page?: number;
    limit?: number;
    sortField?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
  }