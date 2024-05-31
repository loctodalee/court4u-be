import { otp } from "@prisma/client";

export interface IOtpService {
  newOtp({ email }: { email: string }): Promise<otp>;
}
