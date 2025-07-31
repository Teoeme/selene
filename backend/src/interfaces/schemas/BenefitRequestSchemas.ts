import { z } from 'zod'; 

//esquemas de entrada
export const CreateBenefitRequestSchema = z.object({
  benefitId: z.string().min(1, 'Benefit ID is required'),
  reason: z.string()
    .min(10, 'Reason must be at least 10 characters long')
    .max(500, 'Reason must not exceed 500 characters')
    .trim()
});

export const ListBenefitRequestsQuerySchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected']).optional(),
  employeeId: z.string().uuid().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional()
});

export const BenefitRequestParamsSchema = z.object({
  id: z.string()
    .min(1, 'Benefit request ID is required')
    .uuid('Benefit request ID must be a valid UUID')
});

export const ApproveRejectBenefitRequestParamsSchema = z.object({
  id: z.string()
    .min(1, 'Benefit request ID is required')
});

export const GetBenefitRequestParamsSchema = z.object({
  id: z.string()
    .min(1, 'Benefit request ID is required')
});




// Esquemas de salida
export const BenefitRequestResponseSchema = z.object({
  id: z.string(),
  benefitId: z.string(),
  benefitName: z.string(),
  employee: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email()
  }),
  reason: z.string(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
  requestDate: z.date(),
  resolutionDate: z.date().nullable(),
  company: z.object({
    id: z.string(),
    name: z.string()
  })
});

export const BenefitRequestListItemSchema = z.object({
  id: z.string(),
  benefitName: z.string(),
  employeeName: z.string(),
  reason: z.string(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
  requestDate: z.date(),
  resolutionDate: z.date().nullable(),
  company: z.object({
    id: z.string(),
    name: z.string()
  })
});

export type CreateBenefitRequestInput = z.infer<typeof CreateBenefitRequestSchema>;
export type ListBenefitRequestsQuery = z.infer<typeof ListBenefitRequestsQuerySchema>;
export type BenefitRequestParams = z.infer<typeof BenefitRequestParamsSchema>;
export type BenefitRequestResponse = z.infer<typeof BenefitRequestResponseSchema>;
export type BenefitRequestListItem = z.infer<typeof BenefitRequestListItemSchema>;
