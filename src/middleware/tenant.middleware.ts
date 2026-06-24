// src/middleware/tenant.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { errorResponse } from '../utils/response.utils';

export interface TenantRequest extends Request {
  tenant?: {
    id: string;
    slug: string;
    name: string;
    customDomain: string | null;
    status: string;
    settings: any;
  };
  academyId?: string;
}

export const resolveTenant = async (req: TenantRequest, res: Response, next: NextFunction) => {
  try {
    const host = req.headers.host || '';
    const customDomain = req.headers['x-academy-domain'] as string;
    
    let academy = null;
    
    // Strategy 1: Custom domain header
    if (customDomain) {
      academy = await prisma.academy.findUnique({
        where: { customDomain },
      });
    }
    // Strategy 2: Subdomain (academy-slug.lms.com)
    else if (host.includes('.lms.com')) {
      const slug = host.split('.')[0];
      academy = await prisma.academy.findUnique({
        where: { slug },
      });
    }
    // Strategy 3: Local development (localhost:3001?academy=demo)
    else {
      const slug = req.query.academy as string;
      if (slug) {
        academy = await prisma.academy.findUnique({
          where: { slug },
        });
      }
    }
    
    if (!academy || academy.status !== 'ACTIVE') {
      return errorResponse(res, 'Academy not found or inactive', 404);
    }
    
    req.tenant = {
      id: academy.id,
      slug: academy.slug,
      name: academy.name,
      customDomain: academy.customDomain,
      status: academy.status,
      settings: academy.settings,
    };
    req.academyId = academy.id;
    
    next();
  } catch (error) {
    return errorResponse(res, 'Failed to resolve tenant', 500);
  }
};