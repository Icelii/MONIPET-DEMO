import { HttpInterceptorFn } from '@angular/common/http';

export const mockBackendInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes('/api/')) {
    const endpointPath = req.url.split('/api/')[1].split('?')[0];
    const normalizedPath = endpointPath.replace(/^\/+|\/+$/g, '');

    let mockUrl = '';

    if (normalizedPath === 'pets') mockUrl = '/mock-data/pets.json';
    else if (normalizedPath === 'types_pet') mockUrl = '/mock-data/types_pet.json';
    else if (normalizedPath === 'breeds') mockUrl = '/mock-data/breeds.json';

    else if (normalizedPath === 'products') mockUrl = '/mock-data/products.json';
    else if (normalizedPath === 'types_products') mockUrl = '/mock-data/types_products.json';
    else if (normalizedPath === 'categories') mockUrl = '/mock-data/categories.json';
    else if (normalizedPath === 'products/list') mockUrl = '/mock-data/products/list.json';
    else if (normalizedPath === 'pets/list') mockUrl = '/mock-data/pets/list.json';

    else if (normalizedPath.startsWith('pets/adopter/')) {
      mockUrl = '/mock-data/pets.json';
    }
    else if (normalizedPath.startsWith('pets/')) {
      const param = normalizedPath.split('pets/')[1];
      if (/^\d+$/.test(param)) {
        mockUrl = `/mock-data/pets/${param}.json`;
      }
    }
    
    else if (normalizedPath.startsWith('products/')) {
      const param = normalizedPath.split('products/')[1];
      if (/^\d+$/.test(param)) {
        mockUrl = `/mock-data/products/${param}.json`;
      }
    }

    if (mockUrl !== '') {
      console.log(`[Mock Interceptor] Redirigiendo ${req.url} -> ${mockUrl}`); 
      
      const mockReq = req.clone({
        url: mockUrl,
        method: 'GET' 
      });

      return next(mockReq);
    }
  }

  return next(req);
};
